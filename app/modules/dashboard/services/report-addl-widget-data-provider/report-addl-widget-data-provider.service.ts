import {Injectable, Optional} from '@angular/core';
import {forkJoin, Observable, throwError} from 'rxjs';
import {VisualDataGenerator} from '../../containers/dashboard-widget/visual-data-generator';
import DetailedError from '../../../shared/components/loading/detailed-error';
import ReportResponse from '../../../reporting/models/api/response/report-response';
import {applyTransaction, EntityState, EntityStore, QueryEntity} from '@datorama/akita';
import {catchError, map, switchMap, take, tap} from 'rxjs/operators';
import {DashboardDataRequest} from '../../containers/dashboard-widget/dashboard-data-request';
import {ReportWidgetDataProviderService} from '../report-widget-data-provider/report-widget-data-provider.service';
import {DashboardDataResponse} from '../../containers/dashboard-widget/dashboard-data-response';
import {ReportService} from '../../../reporting/services/report/report.service';
import {CommonService} from '../../../../utils/common/common.service';
import {DeviceFormatterService} from '../../../reporting/services/formatting/device/device-formatter.service';
import WidgetDataProvider from '../../containers/dashboard-widget/widget-data-provider';
import ReportResponseResult from '../../../reporting/models/api/response/sub/report-response-result';
import ReportResult from '../../../reporting/models/api/response/sub/report-result';
import SummaryData from '../../../reporting/models/api/response/sub/summary/summary-data';
import ReportResponseSummaryField from '../../../reporting/models/api/response/sub/summary/report-response-summary-field';
import InfoElementType from '../../../reporting/models/enums/info-element-type';
import SummaryDataElement from '../../../reporting/models/api/response/sub/summary/summary-data-element';
import DeviceNameInfo from '../../../reporting/models/api/response/device-name-info';
import {SummaryMetaElement} from '../../../reporting/models/api/response/sub/summary/summary-meta-element';
import {ReportResultState} from '../../../reporting/models/api/response/sub/report-result-state';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class ReportAddlWidgetDataProviderService extends WidgetDataProvider {
  public static readonly DEVICE_META_NAME = 'device';

  parent: ReportWidgetDataProviderService;

  constructor(private reportService: ReportService,
              private deviceFormatterService: DeviceFormatterService,
              private commonService: CommonService,
              private logger: Logger,
              @Optional() private readonly reportDataStore: EntityStore<EntityState<DashboardDataResponse>>,
              @Optional() private readonly reportDataQuery: QueryEntity<EntityState<DashboardDataResponse>, DashboardDataResponse>) {
    super();
    if (this.commonService.isNil(reportDataStore)) {
      this.reportDataStore = new EntityStore<EntityState<DashboardDataResponse>>({}, {
        name: ReportWidgetDataProviderService.WIDGET_REPORT_STORE_NAME
      });
    }
    if (this.commonService.isNil(reportDataQuery)) {
      this.reportDataQuery = new QueryEntity<EntityState<DashboardDataResponse>, DashboardDataResponse,
        string>(this.reportDataStore);
    }

    this.parent = new ReportWidgetDataProviderService(
      this.reportService,
      this.commonService,
      this.logger,
      this.reportDataStore,
      this.reportDataQuery);
  }

  requestData(requests: Array<DashboardDataRequest>): Observable<Array<ReportResponse>> {
    return forkJoin(requests.map((request: DashboardDataRequest): Observable<ReportResponse> => {
      this.reportDataStore.upsert(request.requestKey, {isLoading: true, requestError: null});
      let reportResponse: ReportResponse;
      return this.reportService.executeReport(request.reportRequest)
        .pipe(
          take(1),
          switchMap((rr: ReportResponse) => {
            reportResponse = rr;
            return this.populateDeviceNameMapping(reportResponse);
          }),
          tap(() => {
            reportResponse = this.addDeviceData(reportResponse); // add device name info to meta data
            this.reportDataStore.upsert(request.requestKey, {isLoading: false, report: <ReportResponse>reportResponse});
          }),
          map(() => reportResponse),
          catchError((err): Observable<never> => {
            applyTransaction(() => {
              this.reportDataStore.update(request.requestKey, {requestError: err, isLoading: false});
            });
            return throwError(err);
          })
        );
    }));
  }

  getVisualConfig(reportRequestId: string, dataGenerator?: VisualDataGenerator): Observable<any> {
    return this.parent.getVisualConfig(reportRequestId, dataGenerator);
  }

  getData(reportRequestId: string, dataGenerator?: VisualDataGenerator): Observable<any> {
    return this.parent.getData(reportRequestId, dataGenerator);
  }

  getError(reportRequestId: string, dataGenerator?: VisualDataGenerator): Observable<DetailedError> {
    return this.parent.getError(reportRequestId, dataGenerator);
  }

  getIsLoading(reportId: string): Observable<boolean> {
    return this.parent.getIsLoading(reportId);
  }

  clearReport(requestKey: string): void {
    return this.parent.clearReport(requestKey);
  }

  private populateDeviceNameMapping(reportResult: ReportResponse): Observable<Array<DeviceNameInfo>> {
    return this.deviceFormatterService.getDeviceNameInfoMappingFromResponse$(reportResult);
  }

  private addDeviceData(rr: ReportResponse): ReportResponse {
    rr.results = rr.results.map((result: ReportResponseResult) => {
      if (result.state === ReportResultState.SUCCESS) {
        result.results = result.results.map((reportResult: ReportResult) => {
          const deviceSerialId = reportResult.summary.fields
            .find((field: ReportResponseSummaryField) => field.infoElementType === InfoElementType.DEVICE_SERIAL)?.id;

          reportResult.summary.summaryData = reportResult.summary.summaryData.map((summaryData: SummaryData) => {
            let foundDeviceMetaData = false;
            if (summaryData.meta != null) {
              foundDeviceMetaData = !!summaryData.meta.find((meta: SummaryMetaElement) => {
                return meta.field === ReportAddlWidgetDataProviderService.DEVICE_META_NAME;
              });
            }
            if (deviceSerialId != null && !foundDeviceMetaData) {
              const deviceSerial: SummaryDataElement = summaryData.data.find((summaryElement: SummaryDataElement) => {
                return summaryElement.infoElementId === deviceSerialId;
              });
              const deviceInfo: DeviceNameInfo = this.deviceFormatterService.getDeviceName(<string>deviceSerial?.value);
              const deviceMetaData: SummaryMetaElement = {
                field: ReportAddlWidgetDataProviderService.DEVICE_META_NAME,
                value: deviceInfo
              };
              if (summaryData.meta != null) {
                summaryData.meta = [...summaryData.meta, deviceMetaData];
              } else {
                summaryData.meta = [deviceMetaData];
              }
            }
            return summaryData;
          });
          return reportResult;
        });
      }
      return result;
    });
    return rr;
  }

}
