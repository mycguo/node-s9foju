import {Injectable, OnDestroy, Optional} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {forkJoin, Observable, of, throwError} from 'rxjs';
import {applyTransaction, EntityState, EntityStore, guid, ID, QueryEntity} from '@datorama/akita';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import LiveInsightEdgeReportResponse from '../../../models/live-insight-edge-report-response';
import LiveInsightEdgeReportParameters from '../../../models/live-insight-edge-report-parameters';
import {ReportRequest} from '../../../../reporting/models/api/request/sub/report-request';
import ReportResponse from '../../../../reporting/models/api/response/report-response';
import {QueueReportGroupRequest} from '../../../../reporting/models/api/request/queue-report-group-request';
import {ReportPriority} from '../../../../reporting/models/api/request/enums/report-priority';
import ReportClassificationSource from '../../../../reporting/models/api/request/enums/report-classification-source';
import ReportClassificationContext from '../../../../reporting/models/api/request/enums/report-classification-context';
import {LiveInsightEdgeReportPageService} from '../live-insight-edge-report-page.service';
import LiveInsightEdgeReportResultFormatterService from '../../live-insight-edge-report-result-formatter/live-insight-edge-report-result-formatter.service';
import {DeviceFormatterService} from '../../../../reporting/services/formatting/device/device-formatter.service';
import {LiveInsightEdgeReportChartObject} from './live-insight-edge-report-chart-object';
import InsightChartHeaderInfo from '../../../../reporting/models/charts/headers/insight-chart-header-info';
import {ReportMetaData} from '../../../../reporting/models/charts/metadata/report-meta-data';
import ReportTimeSeriesChartData from '../../../../reporting/models/charts/time-series/report-time-series-chart-data.model';
import {ReportService} from '../../../../reporting/services/report/report.service';
import {LiveInsightReportDataService} from './live-insight-report-data.service';
import LaErrorResponse from './la-error-response';
import {CommonService} from '../../../../../utils/common/common.service';
import {ResettableService} from '../../../../../services/resettable-service';
import {ApiError} from '../../../../../utils/api-error';
import {Logger} from '../../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
/**
 * This service is meant to be the source of truth for the Live Insight Edge Report Page.  All data that is required for the page
 * is requested from this service.  Formatting of the data is pulled into a separate service LiveInsightEdgeReportResultFormatterService
 */
export class LiveInsightReportService implements ResettableService, OnDestroy {
  static readonly STORE_NAME = 'insightReports';

  constructor(private http: HttpClient,
              private commonService: CommonService,
              private insightReportPageService: LiveInsightEdgeReportPageService,
              private insightResultFormatService: LiveInsightEdgeReportResultFormatterService,
              private deviceFormatterService: DeviceFormatterService,
              // private liveInsightReportDataService: LiveInsightReportMockDataService,
              // private reportService: LiveInsightReportMockDataService,
              private reportService: ReportService,
              private liveInsightReportDataService: LiveInsightReportDataService,
              private logger: Logger,
              @Optional() private readonly store: EntityStore<EntityState<LiveInsightEdgeReportChartObject>>,
              @Optional() private readonly query: QueryEntity<EntityState<LiveInsightEdgeReportChartObject>>) {
    if (this.commonService.isNil(store)) {
      this.store = new EntityStore<EntityState<LiveInsightEdgeReportChartObject>>(void 0,
        {name: LiveInsightReportService.STORE_NAME, resettable: true});
    }
    if (this.commonService.isNil(query)) {
      this.query = new QueryEntity<EntityState<LiveInsightEdgeReportChartObject>>(this.store);
    }
  }

  /**
   * Reset all stores.  Be careful when this is called since onDestroy of one component (on page destroy)
   * can be called after onInit of another page,  thereby possibly destroying the state that page set
   */
  public resetStores(): void {
    this.store.reset();
  }

  /**
   * Get the list of insight reports
   */
  public getReports(query: LiveInsightEdgeReportParameters): Observable<Array<LiveInsightEdgeReportChartObject>> {
    applyTransaction(() => {
      this.store.setError(null);
      this.store.setLoading(true);
    });
    return this.liveInsightReportDataService.getTopReports(query)
      .pipe(
        map((data: { reports: Array<ReportRequest> }) => this.convertAllData(data.reports)),
        switchMap((insightReportRequests: Array<LiveInsightEdgeReportResponse>) => this.lookupDeviceSerials(insightReportRequests)),
        tap(((insightReportRequests: Array<LiveInsightEdgeReportResponse>) => this.setStoreData(insightReportRequests))),
        switchMap((insightReportRequests: Array<LiveInsightEdgeReportResponse>) => this.executeAllReports(insightReportRequests)),
        tap((reports: Array<LiveInsightEdgeReportChartObject>) => {
          applyTransaction(() => {
           this.store.setError(null);
           this.store.setLoading(false);
          });
        }),
        catchError(this.errorHandler.bind(this))
      );
  }

  public getReportValue(reportId: string): LiveInsightEdgeReportChartObject {
    return this.query.getEntity(reportId);
  }

  /**
   * Transform the response into objects that can be put in the store and store them
   * @param insightReportRequests - the HTTP response objects
   */
  private setStoreData(insightReportRequests: Array<LiveInsightEdgeReportResponse>): void {
    const storeData = insightReportRequests.map((insightReportRequest: LiveInsightEdgeReportResponse) => {
      const header: InsightChartHeaderInfo = this.insightResultFormatService.getInsightChartHeaderInfo(insightReportRequest);
      return new LiveInsightEdgeReportChartObject(insightReportRequest.id, header);
    });
   this.store.set(storeData);
  }

  /**
   * This function is an optimization.  We lookup all device info up front since we know these are the complete list of devices.
   * It avoid us having to look up device info for each report result
   */
  private lookupDeviceSerials(insightReportResponse: Array<LiveInsightEdgeReportResponse>):
    Observable<Array<LiveInsightEdgeReportResponse>> {
    const serials = this.insightResultFormatService.getDeviceSerialsFromInsightReports(insightReportResponse);
    return this.deviceFormatterService.getDeviceNameInfoMapping(serials)
      .pipe(
        map(_ => insightReportResponse)
      );
  }

  /**
   * Convert the API response to a list of entities that can be stored in our akita store
   */
  private convertAllData(requests: Array<ReportRequest>): Array<LiveInsightEdgeReportResponse> {
    return requests.map(this.convertRequestPOJOToStoreModel);
  }

  /**
   * Convert the API response POJO to what will be used in the store.  All objects in the store must have a unique 'id'
   */
  private convertRequestPOJOToStoreModel(request: ReportRequest): LiveInsightEdgeReportResponse {
    return {
      ...request,
      id: guid()
    };
  }

  private createLiveInsightChartObject(id: ID, result: ReportResponse, header: InsightChartHeaderInfo):
    LiveInsightEdgeReportChartObject {
    try {
      // Is there any data in the response?
      if (this.insightResultFormatService.isNoDataResponse(result)) {
        return new LiveInsightEdgeReportChartObject(id, header, void 0, void 0, void 0);
      } else {
        // We always only care about 1 chart for each insight chart object.  We can ignore anything but the first.
        const reportResults = result?.results[0]?.results;
        if (reportResults.length <= 0) {
          throw new Error('No Data');
        }
        const reportResult = reportResults[0];
        let metadata: Array<ReportMetaData>;
        let chart: ReportTimeSeriesChartData;
        let errorMessage: string;

        // Check the result to see if there is an error or no data
        if (this.insightResultFormatService.isErrorResult(reportResult)) {
          metadata = void 0;
          chart = void 0;
          errorMessage = this.insightResultFormatService.getErrorMessage(reportResult);
        } else if (this.insightResultFormatService.isNoDataResult(reportResult)) {
          metadata = void 0;
          chart = void 0;
          errorMessage = void 0;
        } else {
          metadata = this.insightResultFormatService.getReportPresentableMetaData(reportResult);
          chart = this.insightResultFormatService.formatAsTimeSeries(result?.results?.[0], header?.reportName);
          errorMessage = void 0;
        }

        return new LiveInsightEdgeReportChartObject(id, header, chart, metadata, errorMessage, void 0);
      }
    } catch (err) {
      return new LiveInsightEdgeReportChartObject(id, header, void 0, void 0, err.message);
    }
  }

  /**
   * Execute a report for each of the insight responses.  These reports should run in parallel and continue to run even if
   * one of them fails or errors.
   * @param insightReportResponses - Insight report responses which define the reports that need to be executed
   */
  private executeAllReports(insightReportResponses: Array<LiveInsightEdgeReportResponse>):
    Observable<Array<LiveInsightEdgeReportChartObject>> {
    const reportObservables: Array<Observable<LiveInsightEdgeReportChartObject>> = [];
    insightReportResponses?.forEach((insightReportResponse) => {
        const reportRequest = this.createReportGroupRequest(insightReportResponse);
        reportObservables.push(this.executeAndUpdateStore(reportRequest, insightReportResponse));
      }
    );
    return forkJoin(reportObservables);
  }

  /**
   * Run a report and store it's result in the store.  Unsubscribing from the resulting observable will cancel the running report.
   * @param reportRequest - A report group request that can be consumed directly by the report queue api
   * @param insightReportResponse - The insight response which was used to derive a report request
   */
  private executeAndUpdateStore(reportRequest: QueueReportGroupRequest, insightReportResponse: LiveInsightEdgeReportResponse):
    Observable<LiveInsightEdgeReportChartObject> {
    const header: InsightChartHeaderInfo = this.insightResultFormatService.getInsightChartHeaderInfo(insightReportResponse);
    const id = insightReportResponse.id;
    return this.reportService.executeReport(reportRequest)
      .pipe(
        map(reportResponse => this.createLiveInsightChartObject(id, reportResponse, header)),
        tap((update: LiveInsightEdgeReportChartObject) => {
          update.isLoading = false;
         this.store.replace(id, update);
        }),
        catchError((err) => this.handleReportRequestError(id, err))
      );
  }

  /**
   * Helper method to create a report request that can be consumed by the reporting API.
   * @param reportResponse - The insight response that represents a single report and should be converted to a format
   * that can be consumed the by report queuing API
   */
  private createReportGroupRequest(reportResponse: LiveInsightEdgeReportResponse): QueueReportGroupRequest {
    const report: ReportRequest = {
      reportId: reportResponse.reportId,
      parameters: reportResponse.parameters
    };

    return {
      name: reportResponse.reportName,
      reports: [report],
      priority: ReportPriority.P2,
      classification: {
        source: ReportClassificationSource.OPERATIONS_DASHBOARD,
        context: ReportClassificationContext.REPORT
      }
    };
  }

  /**
   * An observable which will stream all entities within the store
   */
  public selectReports(): Observable<LiveInsightEdgeReportChartObject[]> {
    return this.query.selectAll();
  }

  /**
   * An observable used to determine if any of the insight reports are still running
   */
  public selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  /**
   * An observable which will return an error if we are unable to retrieve any insights
   */
  public selectError(): Observable<string> {
    return this.query.selectError();
  }

  /**
   * Reset the error in the store
   */
  public resetErrorStore(): void {
   this.store.setError(void 0);
  }

  /**
   * Handles run time and HTTP errors.  We need to silently consume them due to the forkJoin operator which will kill
   * all other observables if one fails.
   * @param id - The id of the entity that is having an error
   * @param err - the actual error
   */
  private handleReportRequestError(id: ID, err: HttpErrorResponse): Observable<LiveInsightEdgeReportChartObject> {
    return of(err)
      .pipe(
        map((error: Error) => {
          const entity = this.query.getEntity(id);
          const updatedEntity = { ...entity, isLoading: false, error: error.message };
          return updatedEntity;
        }),
        tap((update: LiveInsightEdgeReportChartObject) => {
          this.logger.error(err.message);
         this.store.replace(id, update);
        })
      );
  }

  /**
   * error handler
   * @param err Http Error
   */
  private errorHandler(err: ApiError | LaErrorResponse): Observable<never> {
    let errorMessage = err?.message;
    if ((err as LaErrorResponse).error) {
      if (err.error.userMessage !== void 0) {
        errorMessage = err.error.userMessage;
      } else if (err.error.clientMessage !== void 0) {
        errorMessage = err.error.clientMessage;
      } else {
        errorMessage = err.error.message;
      }
    }
    applyTransaction(() => {
       this.store.setError(errorMessage);
     this.store.set([]);
     this.store.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(err);
  }

  ngOnDestroy(): void {
    this.store.reset();
  }
}
