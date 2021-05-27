import { Component, OnDestroy, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import DetailedError from '../../../shared/components/loading/detailed-error';
import { DataManagementService } from '../../services/data-management/data-management.service';
import { finalize, map, take, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NodeDataInfo } from '../../components/node-data-info-list/node-data-info.model';
import { DataStoreType } from '../../services/data-management/enums/data-store-type.enum';
import { DataManagementTaskRequest } from '../../services/data-management/interfaces/data-management-task-request';
import { TaskAction } from '../../services/data-management/enums/task-action.enum';
import { DataManagementConfig } from '../../services/data-management/interfaces/data-management-config';
import { TaskTypes } from '../../services/data-management/enums/task-types.enum';
import { NodeTaskRequest } from '../../components/node-data-store-settings/node-task-request';
import { NotificationService } from '../../../../services/notification-service/notification.service';
import { NotificationDowngradeService } from '../../../../services/notification-downgrade/notification-downgrade.service';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import { NOTIFICATION_TYPE_ENUM } from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogInterface } from '../../../shared/components/confirm-dialog/confirm-dialog.interface';
import { DialogService } from '../../../shared/services/dialog/dialog.service';
import { NodeDataStoreSettings } from '../../components/node-data-store-settings/node-data-store-settings.interface';
import { DataStoreBackupModalComponent } from '../../components/data-store-backup-modal/data-store-backup-modal.component';
import { DataManagementTaskStatusResponse } from '../../services/data-management/interfaces/data-management-task-status-response';
import { TaskStatus } from '../../services/data-management/enums/task-status.enum';

@UntilDestroy()
@Component({
  selector: 'nx-data-management-container',
  template: `
    <nx-loading
      [isLoading]="selectLoading$ | async"
      [error]="selectError$ | async"
      [showContent]="showContent"
      [contentTemplate]="content">
      <ng-template #content>
        <div class="nx-data-management-container">
          <nx-node-data-info-list
            class="nx-data-management-container__nodes"
            [nodeDataInfoList]="nodesData$ | async"
            (nodeSelect)="nodeSelect($event)"
          ></nx-node-data-info-list>

          <nx-node-data-store-settings-container
            class="nx-data-management-container__node-details"
            [isLoading]="selectLoading$ | async"
            (applySettings)="applySettings($event)"
            (runTask)="runTaskHandler($event)"
          ></nx-node-data-store-settings-container>
        </div>
      </ng-template>
    </nx-loading>

  `,
  styleUrls: ['./data-management.container.less'],
  providers: [
    TitleCasePipe,
    {
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class DataManagementContainer implements OnInit, OnDestroy {

  selectLoading$: Observable<boolean>;
  selectError$: Observable<DetailedError>;
  nodesData$: Observable<NodeDataInfo[]>;

  dataManagementConfig: DataManagementConfig;

  showContent = false;

  taskStatusCheckerSubscription: Subscription;

  constructor(
    private dataManagement: DataManagementService,
    private dialog: DialogService,
    private notificationService: NotificationService,
    private titleCasePipe: TitleCasePipe
  ) {
    this.selectLoading$ = this.dataManagement.selectLoading();
    this.selectError$ = this.dataManagement.selectError();
    this.nodesData$ = this.dataManagement.selectNodes()
      .pipe(
        map(data => {
          return data.map(node => {
            return new NodeDataInfo({
              id: node.nodeId,
              name: node.nodeName,
              freeSpace: node.volumeFree,
              totalSpace: node.volumeSize,
              useDefaultSettings: node.useAllNodesConfig,
              nodeState: node.nodeState,
              nodesData: node.dataManagementConfigRecords
            });
          });
        })
      );
  }

  ngOnInit(): void {
    this.getConfiguration();
    this.getTaskStatus(true);
  }

  ngOnDestroy() {
    this.dataManagement.resetStores();
  }

  nodeSelect(nodeId) {
    this.dataManagement.setActiveNode(nodeId);
  }

  applySettings(settings: NodeDataStoreSettings): void {
    const config: DataManagementConfig = {
      allNodesConfig: [],
      nodesConfig: []
    };

    if (settings.node.id === DataManagementService.DEFAULT_NODE_ID) {
      config.allNodesConfig = settings.dataStoreSettings;
    } else {
      config.nodesConfig = [
        {
          nodeId: settings.node.id,
          useAllNodesConfig: settings.node.useDefaultSettings,
          dataManagementConfigRecords: settings.dataStoreSettings
        }
      ];
    }

    this.dataManagement.setConfiguration(config)
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          this.getConfiguration(settings.node.id);
        })
      )
      .subscribe(() => {
          this.notificationService.sendNotification$(
            new LaCustomNotificationDefinition(
              `${settings.node.name} updated successfully`,
              NOTIFICATION_TYPE_ENUM.SUCCESS
            )
          );
        }, ((error: Error) => {
          this.notificationService.sendNotification$(
            new LaCustomNotificationDefinition(
              error.message || `Error updating ${settings.node.name} configuration`,
              NOTIFICATION_TYPE_ENUM.ALERT
            )
          );
        })
      );

  }

  runTaskHandler(request: NodeTaskRequest): void {
    const taskRequest = this.buildTaskRequest(request);

    if (request.taskType === TaskTypes.BACKUP) {
      const backupDialogRef = this.dialog.open(DataStoreBackupModalComponent, {
        data: request,
        panelClass: ['nx-modal-wrapper', 'nx-modal-wrapper_size_sm']
      });

      backupDialogRef.afterClosed().pipe(
        take(1)
      ).subscribe((backupResponse: string) => {
        if (backupResponse) {
          this.notificationService.sendNotification$(
            new LaCustomNotificationDefinition(
              backupResponse,
              NOTIFICATION_TYPE_ENUM.SUCCESS
            )
          );

          this.getTaskStatus();
        }
      });
      return;
    }

    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `${request.taskType} Data`,
        message: this.getConfirmMessage(request.taskType, taskRequest),
        confirmButtonMessage: this.titleCasePipe.transform(request.taskType)
      } as ConfirmDialogInterface,
      panelClass: ['nx-modal-wrapper', 'nx-modal-wrapper_size_sm']
    });

    confirmDialogRef.afterClosed().pipe(
      take(1)
    ).subscribe((hasConfirmed: boolean) => {
      if (hasConfirmed) {
        this.runTask(request.taskType, taskRequest);
      }
    });
  }

  private runTask(taskType: TaskTypes, taskRequest: DataManagementTaskRequest) {
    this.dataManagement.runTask(taskType, taskRequest)
      .pipe(
        untilDestroyed(this),
        take(1)
      )
      .subscribe((response: string) => {
          this.notificationService.sendNotification$(
            new LaCustomNotificationDefinition(
              `${response}`,
              NOTIFICATION_TYPE_ENUM.SUCCESS
            )
          );

          this.getTaskStatus();
        }, (() => {
          this.notificationService.sendNotification$(
            new LaCustomNotificationDefinition(
              `Error starting ${this.titleCasePipe.transform(taskType)} job`,
              NOTIFICATION_TYPE_ENUM.ALERT
            )
          );
        })
      );
  }

  /**
   * Get task status and display notification when task finished or errored
   */
  private getTaskStatus(initialCheck: boolean = false): void {
    if (this.taskStatusCheckerSubscription !== void 0) {
      this.taskStatusCheckerSubscription.unsubscribe();
    }
    this.taskStatusCheckerSubscription = this.dataManagement.taskStatusChecker()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(status => {
        // if called from init and there are no running tasks don't display success notification
        if (status !== void 0 && !initialCheck) {
          if (status === TaskStatus.SUCCESS) {
            this.notificationService.sendNotification$(
              new LaCustomNotificationDefinition(
                'Job finished',
                NOTIFICATION_TYPE_ENUM.SUCCESS
              )
            );
          } else if (status === TaskStatus.FAILED) {
            this.notificationService.sendNotification$(
              new LaCustomNotificationDefinition(
                'Job failed',
                NOTIFICATION_TYPE_ENUM.ALERT
              )
            );
          }
        }
        // if there were running tasks set initial to false to display notification when tasks are finished
        initialCheck = false;

      }, () => {
        this.notificationService.sendNotification$(
          new LaCustomNotificationDefinition(
            `Error getting job status`,
            NOTIFICATION_TYPE_ENUM.ALERT
          )
        );
      });
  }

  private buildTaskRequest(request: NodeTaskRequest): DataManagementTaskRequest {
    switch (request.taskType) {
      case TaskTypes.PURGE:
        return {
          action: TaskAction.START,
          dataStoreType: request.dataStoreType,
          nodeIds: request.nodeId === DataManagementService.DEFAULT_NODE_ID ? this.getAllNodesIds() : [request.nodeId],
          purgeAge: this.getPurgeAge(request.nodeId, request.dataStoreType)
        };
      case TaskTypes.RESET:
        return {
          action: TaskAction.START,
          dataStoreType: request.dataStoreType,
          nodeIds: request.nodeId === DataManagementService.DEFAULT_NODE_ID ? this.getAllNodesIds() : [request.nodeId]
        };
    }
  }

  private getAllNodesIds(): string[] {
    return this.dataManagementConfig.nodesConfig.map(node => node.nodeId);
  }

  private getPurgeAge(nodeId: string, dataStoreType: DataStoreType): number {
    if (nodeId === DataManagementService.DEFAULT_NODE_ID) {
      return this.dataManagementConfig.allNodesConfig.find(
        settings => settings.dataStoreType === dataStoreType
      )?.purgeAge;
    }
    const nodesConfig = this.dataManagementConfig.nodesConfig.find(
      node => node.nodeId === nodeId
    );

    // if node use default settings return default settings purgeAge
    if (nodesConfig.useAllNodesConfig) {
      return this.dataManagementConfig.allNodesConfig.find(
        record => record.dataStoreType === dataStoreType
      )?.purgeAge;
    }

    return nodesConfig?.dataManagementConfigRecords?.find(
      record => record.dataStoreType === dataStoreType
    )?.purgeAge;
  }

  private getConfirmMessage(taskType: TaskTypes, taskRequest: DataManagementTaskRequest): string {
    switch (taskType) {
      case TaskTypes.PURGE:
        return `Are you sure you want to ${taskType} the ${taskRequest.dataStoreType} database? Data older than ${this.dataManagement.getConvertedPurgeAgeValue(taskRequest.purgeAge, false)} days will be purged.`;
      case TaskTypes.RESET:
        return `Resetting will permanently delete all ${taskRequest.dataStoreType} data. Do you want to continue?`;
    }
  }

  private getConfiguration(nodeId?: string) {
    this.dataManagement.getConfiguration()
      .pipe(
        untilDestroyed(this),
        take(1),
        tap(() => {
          // select default node on init
          this.dataManagement.setActiveNode(nodeId ?? DataManagementService.DEFAULT_NODE_ID);
          this.showContent = true;
        })
      )
      .subscribe(dataManagementConfig => {
        this.dataManagementConfig = dataManagementConfig;
      });
  }

}
