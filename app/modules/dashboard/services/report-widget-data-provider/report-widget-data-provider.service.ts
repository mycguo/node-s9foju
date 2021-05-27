import {Injectable, Optional} from '@angular/core';
import WidgetDataProvider from '../../containers/dashboard-widget/widget-data-provider';
import {forkJoin, Observable, of} from 'rxjs';
import {applyTransaction, EntityState, EntityStore, QueryEntity} from '@datorama/akita';
import {CommonService} from '../../../../utils/common/common.service';
import {catchError, filter, map, take, tap} from 'rxjs/operators';
import {VisualDataGenerator} from '../../containers/dashboard-widget/visual-data-generator';
import {DashboardDataRequest} from '../../containers/dashboard-widget/dashboard-data-request';
import {DashboardDataResponse} from '../../containers/dashboard-widget/dashboard-data-response';
import DetailedError from '../../../shared/components/loading/detailed-error';
import ReportResult from '../../../reporting/models/api/response/sub/report-result';
import ReportResponse from '../../../reporting/models/api/response/report-response';
import {ReportService} from '../../../reporting/services/report/report.service';
import {ReportResultState} from '../../../reporting/models/api/response/sub/report-result-state';
import ReportResponseError from '../../../reporting/services/report/report-response-error';
import {QueueReportGroupRequest} from '../../../reporting/models/api/request/queue-report-group-request';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class ReportWidgetDataProviderService<D = any, C = any> extends WidgetDataProvider<ReportResponse, QueueReportGroupRequest, D, C> {

  static readonly WIDGET_REPORT_STORE_NAME = 'reportWidgetResponses';

  constructor(
    private reportService: ReportService,
    private commonService: CommonService,
    private logger: Logger,
    @Optional() private readonly reportDataStore: EntityStore<EntityState<DashboardDataResponse>>,
    @Optional() private readonly reportDataQuery: QueryEntity<EntityState<DashboardDataResponse>, DashboardDataResponse>
  ) {
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
  }

  /**
   * Requests data for the widget
   * Returned array's data is not meant to be used by consumer. Consumer should pull data from store
   */
  requestData(requests: Array<DashboardDataRequest>): Observable<Array<ReportResponse>> {
    return forkJoin(requests.map((request: DashboardDataRequest) => {
      this.reportDataStore.upsert(request.requestKey, {isLoading: true, requestError: null});
      return this.reportService.executeReport(request.reportRequest)
        .pipe(
          take(1),
          tap((reportResult) => {
            const reportResultErrors = this.getReportResultErrors(reportResult);
            if (reportResultErrors != null) {
              // The format of this error simulates an failed request error
              throw new ReportResponseError({clientMessage: reportResultErrors});
            }
            this.reportDataStore.upsert(request.requestKey,
              {isLoading: false, report: <ReportResponse>reportResult});
          }),
          catchError((err) => {
            applyTransaction(() => {
              this.reportDataStore.update(request.requestKey, {requestError: err, isLoading: false});
            });
            return of(void 0);
          })
        );
    }));
  }

  private getReportResultErrors(reportResult: ReportResponse): string | null {
    // Check for errors in any result. If the state is "FAILED" for any results throw error.
    let concatErrorString = null;
    for (const result of reportResult.results) {
      if (result.state === ReportResultState.FAILED) {
        concatErrorString = concatErrorString ?? '';
        for (const innerResult of result.results) {
          if (innerResult.state === ReportResultState.FAILED) {
            concatErrorString += innerResult?.error?.userMessage;
          }
        }
      }
    }
    return concatErrorString === null ? null :
      concatErrorString === '' ? 'Unknown Error' : concatErrorString;
  }

  getVisualConfig(reportRequestId: string, dataGenerator?: VisualDataGenerator): Observable<C> {
    return this.reportDataQuery.selectEntity(reportRequestId)
      .pipe(
        map((entity) => {
          if (entity == null || entity.isLoading) {
            return null;
          }
          return dataGenerator != null && entity.report != null ? dataGenerator.buildConfig(entity.report) : {};
        }),
        filter((entity) => entity != null)
      );
  }

  getData(requestKey: string, dataGenerator?: VisualDataGenerator): Observable<D> {
    return this.reportDataQuery.selectEntity(requestKey)
      .pipe(
        map((entity) => {
            if (entity == null || entity.isLoading) {
              return null;
            }
            const resultData = !this.commonService.isNil(entity?.report?.results) ?
              entity.report?.results?.[0]?.results : null;
            try {
              return dataGenerator != null && resultData != null ? dataGenerator.transformData(resultData) : resultData;
            } catch (err) {
              this.logger.warn('error reported for ', requestKey, err);
              return null;
            }
          },
        ),
        filter((entity) => entity != null)
      );
  }

  getError(requestKey: string, dataGenerator?: VisualDataGenerator): Observable<DetailedError> {
    return this.reportDataQuery.selectEntity(requestKey, entity => {
      let error: DetailedError;
      if (!this.commonService.isNil(entity.requestError)) {
        error = <DetailedError>{
          title: '',
          message: entity.requestError?.error?.error?.clientMessage
        };
      } else if (!this.isResultDataValid(entity)) {
        error = <DetailedError>{
          title: 'No Data',
        };
      } else {
        const resultData = this.getResultData(entity);
        error = dataGenerator != null && resultData != null ? dataGenerator.generateError(resultData) : null;
      }
      return error;
    });
  }

  getIsLoading(requestKey: string): Observable<boolean> {
    return this.reportDataQuery.selectEntity(requestKey, (entity) => entity.isLoading);
  }

  clearReport(requestKey: string): void {
    this.reportDataStore.remove(requestKey);
  }

  private isResultDataValid(entity: DashboardDataResponse): boolean {
    return entity.report?.results?.[0]?.state === ReportResultState.SUCCESS;
  }

  private getResultData(entity: DashboardDataResponse): Array<ReportResult> {
    return !this.commonService.isNil(entity.report?.results) ?
      entity.report?.results?.[0]?.results : null;
  }

}
