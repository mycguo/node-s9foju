import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { applyTransaction, EntityStore, Query, QueryEntity, Store } from '@datorama/akita';
import { forkJoin, Observable, Subject, throwError, timer } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { DataManagementNodeConfigState } from './interfaces/data-management-node-config-state';
import { DataManagementNodeConfigRecord } from './interfaces/data-management-node-config-record';
import DetailedError from '../../../shared/components/loading/detailed-error';
import { DataManagementTaskRequest } from './interfaces/data-management-task-request';
import { DataManagementTaskStatusResponse } from './interfaces/data-management-task-status-response';
import { TaskTypes } from './enums/task-types.enum';
import { DataManagementConfig } from './interfaces/data-management-config';
import { DataManagementNodeConfigResponse } from './interfaces/data-management-node-config-response';
import { NodeStates } from './enums/node-sates.enum';
import { DataManagementTaskStatusState } from './interfaces/data-management-task-status-state';
import { TaskStatus } from './enums/task-status.enum';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class DataManagementService {

  static readonly DATA_MANAGEMENT_ENDPOINT = '/api/nx/dataManagement';
  static readonly DATA_MANAGEMENT_CONFIG_ENDPOINT = DataManagementService.DATA_MANAGEMENT_ENDPOINT + '/configuration';

  static readonly DEFAULT_NODE_ID = 'default';
  static readonly TASK_UPDATE_INTERVAL = 3000;
  static readonly DAY_IN_MILLIS = 86400000; // 1000 * 60 * 60 * 24

  static readonly nodesConfigStore: EntityStore<DataManagementNodeConfigState, DataManagementNodeConfigResponse, string> =
    new EntityStore<DataManagementNodeConfigState>({
      active: void 0
    }, {name: 'nodesConfigStore', idKey: 'nodeId', resettable: true});
  static readonly nodesConfigQuery: QueryEntity<DataManagementNodeConfigState, DataManagementNodeConfigResponse, string> =
    new QueryEntity<DataManagementNodeConfigState>(DataManagementService.nodesConfigStore);

  static readonly tasksStore: Store<DataManagementTaskStatusState> = new Store<DataManagementTaskStatusState>(
    {},
    {name: 'taskStatusStore', resettable: true}
  );
  static readonly tasksQuery: Query<DataManagementTaskStatusState> = new Query<DataManagementTaskStatusState>(
    DataManagementService.tasksStore
  );

  private killTrigger: Subject<void> = new Subject();

  constructor(
    private http: HttpClient,
    private logger: Logger,
  ) { }

  /**
   * Get default data management configuration plus custom configuration of all nodes
   */
  getConfiguration(): Observable<DataManagementConfig> {
    DataManagementService.nodesConfigStore.setLoading(true);

    return this.http.get<DataManagementConfig>(DataManagementService.DATA_MANAGEMENT_CONFIG_ENDPOINT)
      .pipe(
        map((resp: { allNodesConfig: DataManagementNodeConfigRecord[], nodesConfig: DataManagementNodeConfigResponse[] }) => {
          applyTransaction(() => {
            DataManagementService.nodesConfigStore.setLoading(false);
            DataManagementService.nodesConfigStore.set(resp.nodesConfig);

            const defaultNode: DataManagementNodeConfigResponse = {
              nodeId: DataManagementService.DEFAULT_NODE_ID,
              nodeName: 'Default Settings',
              nodeState: NodeStates.CONNECTED,
              dataManagementConfigRecords: resp.allNodesConfig
            };
            DataManagementService.nodesConfigStore.add(defaultNode);
          });
          return resp;
        }),
        catchError(this.errorHandler.bind(this))
      );
  }

  /**
   * Set default data management configuration plus custom configuration of all nodes
   */
  setConfiguration(dataManagementConfig: DataManagementConfig): Observable<DataManagementConfig> {
    DataManagementService.nodesConfigStore.setLoading(true);

    return this.http.put<DataManagementConfig>(
      DataManagementService.DATA_MANAGEMENT_CONFIG_ENDPOINT,
      dataManagementConfig
    )
      .pipe(
        catchError((err: HttpErrorResponse): Observable<never> => {
          DataManagementService.nodesConfigStore.setLoading(false);
          return throwError(err.error);
        })
      );
  }

  /**
   * Start or Cancel the process of backup, purge or reset task for the requested nodes.
   * @param taskType - backup, purge or reset
   * @param taskRequest - task parameters
   */
  runTask(taskType: TaskTypes, taskRequest: DataManagementTaskRequest): Observable<string> {
    return this.http.post<{meta: Object, response: string}>(
      `${DataManagementService.DATA_MANAGEMENT_ENDPOINT}/${taskType}`, taskRequest
    )
      .pipe(
        map((resp: {meta: Object, response: string}) => resp.response),
        catchError(this.taskErrorHandler.bind(this))
      );
  }

  /**
   * Gets the status of backup, purge or reset task for the requested nodes.
   * @param taskType - backup, purge or reset
   */
  getTaskStatus(taskType: TaskTypes): Observable<DataManagementTaskStatusResponse> {
    return this.http.get<DataManagementTaskStatusResponse>(
      `${DataManagementService.DATA_MANAGEMENT_ENDPOINT}/${taskType}/status`
    )
      .pipe(
        catchError(this.taskErrorHandler.bind(this))
      );
  }

  /**
   * Checks status of running tasks every TASK_UPDATE_INTERVAL seconds
   * returns true if all tasks finished or false if tasks running
   */
  taskStatusChecker(): Observable<TaskStatus> {
    return timer(0, DataManagementService.TASK_UPDATE_INTERVAL)
      .pipe(
        takeUntil(this.killTrigger),
        switchMap(() => this.getAllTasksStatus()),
        map((tasks) => {

          // get all tasks with running status
          const runningTasks = {};
          Object.keys(tasks).forEach((task) => {
              runningTasks[task] = tasks[task]?.consolidatedStatus === TaskStatus.RUNNING;
          });

          DataManagementService.tasksStore.update(runningTasks);

          const hasRunningTasks: boolean = Object.values(runningTasks).some(status => status);

          // if no task is running kill timer and return success, otherwise return false
          if (!hasRunningTasks) {
            // finish timer job
            this.killTrigger.next();
            return this.hasFailedTasks(tasks) ? TaskStatus.FAILED : TaskStatus.SUCCESS;
          }
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          this.killTrigger.next();
          DataManagementService.tasksStore.reset();
          return throwError(err);
        })

      );
  }

  private getAllTasksStatus(): Observable<{[key in TaskTypes]: DataManagementTaskStatusResponse}> {
    return forkJoin({
      [TaskTypes.BACKUP]: this.getTaskStatus(TaskTypes.BACKUP),
      [TaskTypes.PURGE]: this.getTaskStatus(TaskTypes.PURGE),
      [TaskTypes.RESET]: this.getTaskStatus(TaskTypes.RESET),
    });
  }

  private hasFailedTasks(tasks: {[key in TaskTypes]: DataManagementTaskStatusResponse}): boolean {
    return Object.values(tasks).some(task =>
      task.consolidatedStatus === TaskStatus.FAILED
    );
  }

  /**
   * observable error handler
   * @param err Http Error
   */
  private errorHandler(err: HttpErrorResponse): Observable<never> {
    applyTransaction(() => {
      DataManagementService.nodesConfigStore.setError<DetailedError>(Object.assign({}, {title: void 0}, err));
      DataManagementService.nodesConfigStore.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(err);
  }

  private taskErrorHandler(err: HttpErrorResponse): Observable<never> {
    this.logger.error(err.message);
    return throwError(err);
  }

  /**
   * Store helpers
   */
  // select all custom nodes
  // filter out default node entry
  selectNodes(): Observable<DataManagementNodeConfigResponse[]> {
    return DataManagementService.nodesConfigQuery.selectAll({
      filterBy: node => node.nodeId !== DataManagementService.DEFAULT_NODE_ID
    });
  }

  selectActiveNode(): Observable<DataManagementNodeConfigResponse> {
    return DataManagementService.nodesConfigQuery.selectActive();
  }

  setActiveNode(nodeId: string): void {
    DataManagementService.nodesConfigStore.setActive(nodeId);
  }

  selectLoading(): Observable<boolean> {
    return DataManagementService.nodesConfigQuery.selectLoading();
  }

  selectError(): Observable<DetailedError> {
    return DataManagementService.nodesConfigQuery.selectError<DetailedError>();
  }

  selectTasksStatus(): Observable<boolean> {
    return DataManagementService.tasksQuery.select()
      .pipe(
        map(tasks => Object.values(tasks).some(status => status))
      );
  }

  resetStores(): void {
    DataManagementService.nodesConfigStore.reset();
    DataManagementService.tasksStore.reset();
    this.killTrigger.next();
  }

  getConvertedPurgeAgeValue(purgeAge: number, toServerDataFormat: boolean): number {
    if (toServerDataFormat) {
      return purgeAge * DataManagementService.DAY_IN_MILLIS; // coverts purge age from days to millis
    }
    return Math.floor(purgeAge / DataManagementService.DAY_IN_MILLIS); // coverts purge age from millis to days
  }
}
