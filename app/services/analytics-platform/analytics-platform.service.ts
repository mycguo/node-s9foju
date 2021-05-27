import { Injectable, OnDestroy } from '@angular/core';
import { AnalyticsPlatformRestClientService } from '../analytics-platform-rest-client/analytics-platform-rest-client.service';
import { applyTransaction, EntityStore, Query, QueryEntity, Store } from '@datorama/akita';
import { NEVER, Observable, Subject, throwError, timer } from 'rxjs';
import { AnalyticsPlatformConfigState } from './config/analytics-platform-config.state';
import { RequestErrors } from '../../utils/api/request-errors';
import NxResponseUtil from '../../utils/api/nx-response.util';
import RequestType from '../../utils/api/request-type.enum';
import { catchError, finalize, map, switchMap, take, takeUntil } from 'rxjs/operators';
import AnalyticsPlatformConfig from './config/analytics-platform-config';
import { AnalyticsPlatformConfigStatusState } from './analytics-platform-config-status.state';
import AnalyticsPlatformMonitoredDevicesState from './monitored-devices/analytics-platform-monitored-devices.state';
import AnalyticsPlatformMonitoredDevice from './monitored-devices/analytics-platform-monitored-device.model';
import { EntityQueryable } from '../../modules/grid/services/grid-string-filter/entity-queryable';
import GridData from '../../modules/grid/models/grid-data.model';
import { SimpleFilterService } from '../table-filter/simple-filter.service';
import { ResettableService } from '../resettable-service';
import { ConfirmDialogComponent } from '../../modules/shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogInterface } from '../../modules/shared/components/confirm-dialog/confirm-dialog.interface';
import { DialogService } from '../../modules/shared/services/dialog/dialog.service';
import { Size } from '../../modules/shared/enums/size';
import { LiveInsightEdgeConnectionStatusService } from './connection/live-insight-edge-connection-status-service';
import { StatusIndicatorValues } from '../../modules/shared/components/status-indicator/enums/status-indicator-values.enum';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { subDays } from 'date-fns';
import {Logger} from '../../modules/logger/logger';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsPlatformService
  extends SimpleFilterService<AnalyticsPlatformMonitoredDevicesState, AnalyticsPlatformMonitoredDevice>
  implements OnDestroy, EntityQueryable<AnalyticsPlatformMonitoredDevicesState>, ResettableService {

  private static readonly ALLOWABLE_GLOBAL_FILTER_KEYS: Array<string> =
    ['deviceName', 'analyticsNode', 'site', 'region', 'tags'];

  static readonly store: Store<AnalyticsPlatformConfigState> =
      new Store(<AnalyticsPlatformConfigState>{
        config: {
          hostname: '',
          port: null
        },
        configSubmitting: false
      }, { name: 'analyticsPlatformConfig', resettable: true });

  static readonly query: Query<AnalyticsPlatformConfigState> =
      new Query<AnalyticsPlatformConfigState>(AnalyticsPlatformService.store);

  static readonly statusStore: Store<AnalyticsPlatformConfigStatusState> =
    new Store(<AnalyticsPlatformConfigStatusState> {
      status: StatusIndicatorValues.UNKNOWN,
      analyticsVersion: 'Unknown',
      supportedCapabilities: []
    }, { name: 'analyticsPlatformConfigStatus', resettable: true });

  static readonly statusQuery: Query<AnalyticsPlatformConfigStatusState> =
    new Query<AnalyticsPlatformConfigStatusState>(AnalyticsPlatformService.statusStore);

  static readonly monitoredDevicesStore: EntityStore<AnalyticsPlatformMonitoredDevicesState> =
    new EntityStore<AnalyticsPlatformMonitoredDevicesState>({
        active: []
      },
      {name: 'AnalyticsPlatformMonitoredDevices', idKey: 'deviceSerial', resettable: true});

  static readonly monitoredDevicesQuery: QueryEntity<AnalyticsPlatformMonitoredDevicesState> =
    new QueryEntity<AnalyticsPlatformMonitoredDevicesState>(AnalyticsPlatformService.monitoredDevicesStore);

  static readonly importSnmpStatusStore: Store<{isLoading: boolean}> =
    new Store<{isLoading: boolean}>({}, {name: 'importSnmpStatus', resettable: true});

  static readonly importSnmpStatusQuery: Query<{isLoading: boolean}> =
    new Query<{isLoading: boolean}>(AnalyticsPlatformService.importSnmpStatusStore);

  static readonly TASK_UPDATE_INTERVAL = 3000;
  private readonly ANALYTICS_SNMP_BASE_URL = AnalyticsPlatformRestClientService.ANALYTICS_BASE_URL + '/snmp';
  private killTrigger: Subject<void> = new Subject();

  /**
   * Constructor
   */
  constructor(
    private analyticsApiClient: AnalyticsPlatformRestClientService,
    private logger: Logger,
    private dialog: DialogService,
    private liveInsightEdgeConnectionStatusService: LiveInsightEdgeConnectionStatusService,
    private http: HttpClient
  ) {
    super(AnalyticsPlatformService.monitoredDevicesQuery,
      'AnalyticsPlatformMonitoredDevicesFilters', 'deviceSerial', AnalyticsPlatformService.ALLOWABLE_GLOBAL_FILTER_KEYS);
  }

  /**
   * Sets the config for the analytics platform config params.
   * @param updated The updated config.
   */
  setConfig(updated: AnalyticsPlatformConfig) {
    AnalyticsPlatformService.store.update({configSubmitting: true});
    this.analyticsApiClient.updateAnalyticsPlatformConfig(updated)
      .pipe(take(1))
      .subscribe(
          () => {
            this.fetchConfig();
            this.checkConnection();
            applyTransaction(() => {
              AnalyticsPlatformService.store.update({configSubmitting: false, error: void 0});
            });
          },
    err => {
            this.logger.error(err);
            const requestErrors = <RequestErrors> {
              requestType: RequestType.PUT,
              errorMessage: NxResponseUtil.parseErrorMessage(err)
            };
            AnalyticsPlatformService.store.update({configSubmitting: false, error: requestErrors});
          }
      );
  }

  /**
   * Triggers a fetch action for the analytics config.
   */
  fetchConfig() {
    AnalyticsPlatformService.store.setLoading(true);
    this.analyticsApiClient.getAnalyticsPlatformConfig()
      .pipe(take(1))
      .subscribe(
        response => {
          applyTransaction(() => {
            AnalyticsPlatformService.store.update(
              {
                config: new AnalyticsPlatformConfig(response.hostname, response.port)
              });
            AnalyticsPlatformService.store.setLoading(false);
            AnalyticsPlatformService.store.setError(null);
          });
        },
        err => {
          this.logger.error(err);
          const requestErrors = <RequestErrors> {
            requestType: RequestType.GET,
            errorMessage: NxResponseUtil.parseErrorMessage(err)
          };
          applyTransaction(() => {
            AnalyticsPlatformService.store.setLoading(false);
            AnalyticsPlatformService.store.setError(requestErrors);
          });
        }
    );
  }

  /**
   * Triggers the delete for the analytics paltform config.
   */
  openDeleteConfigDialog() {
    this.dialog.open(
      ConfirmDialogComponent,
      {
        data: {
          title: `Delete Configuration`,
          message: `Are you sure you want to delete your LiveNA configuration?`
        } as ConfirmDialogInterface,
        size: Size.SM
      },
      (hasConfirmed) => { if (hasConfirmed) { this.deleteConfig(); } }
    );
  }

  deleteConfig() {
    AnalyticsPlatformService.store.setLoading(true);
    this.analyticsApiClient.deleteAnalyticsPlatformConfig()
      .pipe(take(1))
      .subscribe(
        () => {
          AnalyticsPlatformService.statusStore.update({ status: StatusIndicatorValues.UNCONFIGURED });
          this.fetchConfig();
        },
        err => {
          this.logger.error(err);
          const requestErrors = <RequestErrors> {
            requestType: RequestType.DELETE,
            errorMessage: NxResponseUtil.parseErrorMessage(err)
          };
          applyTransaction(() => {
            AnalyticsPlatformService.store.setLoading(false);
            AnalyticsPlatformService.store.setError(requestErrors);
          });
        });
  }

  /**
   * Triggers a connection check for the analytics platform to determine the connection status.
   */
  checkConnection() {
    AnalyticsPlatformService.statusStore.setLoading(true);
    this.analyticsApiClient.getConnectionStatus()
      .pipe(take(1))
      .subscribe(
        (result) => {
          const connectionStatus = this.liveInsightEdgeConnectionStatusService.getDisplayStatus(result);
          applyTransaction(() => {
            AnalyticsPlatformService.statusStore.setLoading(false);
            AnalyticsPlatformService.statusStore.setError(null);
            AnalyticsPlatformService.statusStore.update({
              status: connectionStatus,
              analyticsVersion: result.analyticsVersion,
              supportedCapabilities: result.supportedCapabilities
            });
          });
        },
        err => {
          this.logger.error(err);
          const requestErrors = <RequestErrors> {
            requestType: RequestType.GET,
            errorMessage: NxResponseUtil.parseErrorMessage(err)
          };
          applyTransaction(() => {
            AnalyticsPlatformService.statusStore.update({status: StatusIndicatorValues.ERROR});
            AnalyticsPlatformService.statusStore.setLoading(false);
            AnalyticsPlatformService.statusStore.setError(requestErrors);
          });
        }
      );
  }

  /**
   * Triggers a fetch action for the analytics monitored devices.
   */
  fetchMonitoredDevices() {
    super.clearFilters();
    AnalyticsPlatformService.monitoredDevicesStore.setLoading(true);
    this.analyticsApiClient.getMonitoredDevices()
      .pipe(
        take(1),
        map(response => {
            return response.analyticsDevices;
          }
        )
      )
      .subscribe(
        response => {
          applyTransaction(() => {
            AnalyticsPlatformService.monitoredDevicesStore.set(response);
            AnalyticsPlatformService.monitoredDevicesStore.setLoading(false);
          });
        },
        err => {
          this.logger.error(err);
          const requestErrors = <RequestErrors> {
            requestType: RequestType.GET,
            errorMessage: NxResponseUtil.parseErrorMessage(err)
          };
          applyTransaction(() => {
            AnalyticsPlatformService.monitoredDevicesStore.setLoading(false);
            AnalyticsPlatformService.monitoredDevicesStore.setError(requestErrors);
          });
        }
      );
  }

  /**
   * Resets any config request errors.
   */
  resetErrors() {
    applyTransaction(() => {
        AnalyticsPlatformService.store.setError(void 0);
        AnalyticsPlatformService.store.update({ error: null });
      }
    );
  }

  /**
   * Returns the state observable for the analytics platform config.
   */
  configState$(): Observable<AnalyticsPlatformConfigState> {
    return AnalyticsPlatformService.query.select();
  }

  /**
   * Returns the status observable for the analytics platform connection.
   */
  statusState$(): Observable<StatusIndicatorValues> {
    return AnalyticsPlatformService.statusQuery.select('status');
  }

  capabilityState(): Observable<string[]> {
    return AnalyticsPlatformService.statusQuery.select('supportedCapabilities');
  }

  /**
   * Returns the analytics version string.
   */
  analyticsVersion$(): Observable<string> {
    return AnalyticsPlatformService.statusQuery.select('analyticsVersion');
  }

  /**
   * Start SNMP data import
   */
  startSnmpImport(timeRange: number): Observable<any> {
    AnalyticsPlatformService.importSnmpStatusStore.update({isLoading: true});
    const startTimeMillis = subDays(new Date(), timeRange).getTime();
    return this.http.post(this.ANALYTICS_SNMP_BASE_URL + '/resetData', {startTimeMillis: startTimeMillis})
      .pipe(
        finalize(() => {
          AnalyticsPlatformService.importSnmpStatusStore.update({isLoading: false});
        })
      );
  }

  /**
   * Gets status of importing task
   */
  getSnmpImportStatus(): Observable<boolean> {
    return this.http.get<Partial<{receivedAllHistoricalData?: boolean}>>(this.ANALYTICS_SNMP_BASE_URL + '/dataStatus')
      .pipe(
        map(resp => !!resp.receivedAllHistoricalData)
      );
  }

  /**
   * Checks status of import task every TASK_UPDATE_INTERVAL seconds until the task completes
   */
  importSnmpDataStatusChecker(): Observable<boolean> {
    return timer(0, AnalyticsPlatformService.TASK_UPDATE_INTERVAL)
      .pipe(
        takeUntil(this.killTrigger),
        switchMap(() => this.getSnmpImportStatus()), // kills any previous observables
        map((isImportComplete: boolean) => {
          if (isImportComplete) {
            this.killTrigger.next();
            AnalyticsPlatformService.importSnmpStatusStore.update({isLoading: false});
            return true;
          }

          AnalyticsPlatformService.importSnmpStatusStore.update({isLoading: true});
          return false;
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          this.killTrigger.next();
          AnalyticsPlatformService.importSnmpStatusStore.reset();
          return throwError(err);
        })
      );
  }

  /**
   * Returns import SNMP task status
   */
  selectImportSnmpDataLoading(): Observable<boolean> {
    return AnalyticsPlatformService.importSnmpStatusQuery.select('isLoading');
  }

  /**
   * Returns the loading state observable for the analytics platform config.
   */
  loadingState$(): Observable<boolean> {
    return AnalyticsPlatformService.query.selectLoading();
  }

  /**
   * Returns the loading state observable for the analytics platform connection status.
   */
  checkingConnection$(): Observable<boolean> {
    return AnalyticsPlatformService.statusQuery.selectLoading();
  }

  /**
   * Returns the loading state observable for the monitored devices.
   */
  monitoredDevicesLoading$(): Observable<boolean> {
    return AnalyticsPlatformService.monitoredDevicesQuery.selectLoading();
  }

  /**
   * Return an observable for errors generated when retrieving monitored devices.
   */
  monitoredDevicesLoadErrors$(): Observable<RequestErrors> {
    return AnalyticsPlatformService.monitoredDevicesQuery.selectError();
  }

  /**
   * Returns an observable for errors generated from analytics platform config requests.
   */
  errors$(): Observable<RequestErrors> {
    return AnalyticsPlatformService.query.selectError();
  }

  /**
   * Returns an observable for the errors generated from the analytics platform connection check request.
   */
  statusErrors$(): Observable<RequestErrors> {
    return AnalyticsPlatformService.statusQuery.selectError();
  }

  /**
   * Returns the query for the entity store.
   */
  getEntityQuery(): QueryEntity<AnalyticsPlatformMonitoredDevicesState> {
    return AnalyticsPlatformService.monitoredDevicesQuery;
  }

  removeMonitoredDevices(deviceSerials: Array<string>): Observable<any> {
    return this.analyticsApiClient.removeMonitoredDevices(deviceSerials)
        .pipe(
          take(1),
          map((result) => {
            applyTransaction(() => {
              AnalyticsPlatformService.monitoredDevicesStore.remove(deviceSerials);
            });
            return result;
          }),
          catchError((error) => {
            const requestErrors = <RequestErrors> {
              requestType: RequestType.DELETE,
              errorMessage: NxResponseUtil.parseErrorMessage(error)
            };
            throw requestErrors;
            return NEVER;
          })
        );
  }


  getFilteredDevices$(): Observable<Array<AnalyticsPlatformMonitoredDevice>> {
    return super.selectedFilteredItems();
  }

  getFilteredDevicesAsGrid$() {
    return this.getFilteredDevices$()
      .pipe(
        map((dataArray => new GridData(dataArray)))
      );
  }

  getSelectedDevicesIds(): Observable<Array<string>> {
    return this.query.selectActiveId();
  }

  selectFilteredActiveRows(): Observable<string[]> {
    return super.selectActiveId();
  }

  // filters
  setFilter(field: string, searchTerm: string | number | boolean) {
    super.setFilter(field, searchTerm);
  }

  setGlobalFilter(searchTerm: string) {
    super.setGlobalFilter(searchTerm);
  }

  // sorting
  setSortBy(id: string,
            sort: string,
            sortFn?: (colId: string, desc: boolean,
                      valA: AnalyticsPlatformMonitoredDevice, valB: AnalyticsPlatformMonitoredDevice) => number): void {
    super.setSortBy(id, sort, sortFn);
  }

  clearSort(): void {
    super.clearSort();
  }

  resetStores() {
    super.clearFilters();
    AnalyticsPlatformService.store.reset();
    AnalyticsPlatformService.monitoredDevicesStore.reset();
    AnalyticsPlatformService.statusStore.reset();
    AnalyticsPlatformService.importSnmpStatusStore.reset();
  }

  ngOnDestroy(): void {
    this.killTrigger.next();
  }

  setSelectedEntities(selectedDevices: Array<string>) {
    super.selectActiveItemIds(selectedDevices)
      .subscribe((selectedIds: Array<string>) => {
        AnalyticsPlatformService.monitoredDevicesStore.setActive(selectedIds);
      });
  }
}
