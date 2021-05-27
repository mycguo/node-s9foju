import {Injectable, OnDestroy, Optional} from '@angular/core';
import {applyTransaction, Query, Store} from '@datorama/akita';
import {EMPTY, Observable} from 'rxjs';
import LiveInsightEdgeReportPageState from './live-insight-edge-report-page.state';
import SortOrder from './sort-order';
import {CommonService} from '../../../../utils/common/common.service';
import {AnalyticsPlatformRestClientService} from '../../../../services/analytics-platform-rest-client/analytics-platform-rest-client.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {catchError, take} from 'rxjs/operators';
import {AnalyticsPlatformConnection} from '../../../../services/analytics-platform/connection/analytics-platform-connection';
import {LiveInsightEdgeConnectionStatusModel} from '../../../../services/analytics-platform/connection/live-insight-edge-connection-status-model';
import {LiveInsightEdgeConnectionStatusService} from '../../../../services/analytics-platform/connection/live-insight-edge-connection-status-service';
import {LaNoDataMessage} from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';
import {StatusIndicatorValues} from '../../../shared/components/status-indicator/enums/status-indicator-values.enum';
import {UserPreferencesStoreService} from '../../../../store/user-preferences/user-preferences-store.service';
import {UserPreferencesQueryService} from '../../../../store/user-preferences/user-preferences-query.service';
import {DevicesService} from '../../../settings/services/devices/devices.service';
import ILaDevicePreferences from '../../../../../../../project_typings/api/laDeviceDiscovery/ILaDevicePreferences';

/**
 * State service for the live insight edge page  report view state.
 */
@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class LiveInsightEdgeReportPageService implements OnDestroy {

  static readonly INITIAL_STATE = <LiveInsightEdgeReportPageState>{
    isAnomaliesOnly: true,
    flexFilterString: '',
    timeSortOrder: SortOrder.DESCENDING,
    volumeSortOrder: SortOrder.DESCENDING,
    connectionStatus: {status: StatusIndicatorValues.UNKNOWN, message: ''},
    liveNaConnectionError: null,
    liveNaConnectionCustomErrorMessage: null
  };

  static readonly STORE_NAME = 'liveInsightEdgeReportPage';

  constructor(
    private commonService: CommonService,
    private analyticsApiClient: AnalyticsPlatformRestClientService,
    private liveInsightEdgeConnectionStatusService: LiveInsightEdgeConnectionStatusService,
    private userPreferencesStore: UserPreferencesStoreService,
    private userPreferencesQuery: UserPreferencesQueryService,
    private devicesService: DevicesService,
    @Optional() private readonly store: Store<LiveInsightEdgeReportPageState>,
    @Optional() private readonly query: Query<LiveInsightEdgeReportPageState>
  ) {
    if (this.commonService.isNil(store)) {
      this.store = new Store<LiveInsightEdgeReportPageState>(LiveInsightEdgeReportPageService.INITIAL_STATE, {
        name: LiveInsightEdgeReportPageService.STORE_NAME,
        resettable: true
      });
    }
    if (this.commonService.isNil(query)) {
      this.query = new Query<LiveInsightEdgeReportPageState>(this.store);
    }
    this.store.setLoading(true);
    this.devicesService.getDevicesPreferences()
      .pipe(
        take(1),
      ).subscribe(
      (devicePreference: ILaDevicePreferences) => {
        this.userPreferencesStore.update({
          useDeviceSystemName: devicePreference.useDeviceName
        });
      }
    );
  }

  setPageState(pageState: Partial<LiveInsightEdgeReportPageState>) {
    this.store.update(pageState);
  }

  selectPageState(): Observable<LiveInsightEdgeReportPageState> {
    return this.query.select();
  }

  selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  selectConnectionStatus(): Observable<LiveInsightEdgeConnectionStatusModel> {
    return this.query.select('connectionStatus');
  }

  selectConnectionError(): Observable<Error> {
    return this.query.select('liveNaConnectionError');
  }

  selectConnectionCustomErrorMessage(): Observable<LaNoDataMessage> {
    return this.query.select('liveNaConnectionCustomErrorMessage');
  }

  resetPageState(): void {
    this.store.update(LiveInsightEdgeReportPageService.INITIAL_STATE);
  }

  checkConnection(): void {
    this.store.setLoading(true);
    this.analyticsApiClient.getConnectionStatus()
      .pipe(
        untilDestroyed(this),
        catchError((err) => {
          applyTransaction(() => {
            this.store.setLoading(false);
            this.store.update({
              liveNaConnectionError: new Error(err.message),
              liveNaConnectionCustomErrorMessage: new LaNoDataMessage('An error occurred', err.message, 'la-no-data-message__icon-warning')
            });
          });
          return EMPTY;
        })
      )
      .subscribe((response: AnalyticsPlatformConnection) => {
        // If the configuration is valid and connection is also valid, set connection and state to valid
        const connectionStatusModel = this.liveInsightEdgeConnectionStatusService.getConnectionStatusModel(response);
        if (connectionStatusModel.status === StatusIndicatorValues.CONNECTED) {
          applyTransaction(() => {
            this.store.setLoading(false);
            this.store.update({
              connectionStatus: connectionStatusModel,
              liveNaConnectionError: null,
              liveNaConnectionCustomErrorMessage: null
            });
          });
        } else {
          applyTransaction(() => {
            this.store.setLoading(false);
            this.store.update({
              connectionStatus: connectionStatusModel,
              liveNaConnectionError: new Error(connectionStatusModel.message ?? 'Error'),
              liveNaConnectionCustomErrorMessage:
                this.liveInsightEdgeConnectionStatusService.getConnectionStatusMessage(connectionStatusModel)
            });
          });
        }

      });
  }


  ngOnDestroy(): void {
    this.store.reset();
  }
}
