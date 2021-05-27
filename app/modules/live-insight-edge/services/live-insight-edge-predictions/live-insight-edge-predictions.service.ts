import {Injectable, OnDestroy, Optional} from '@angular/core';
import {ResettableService} from '../../../../services/resettable-service';
import {HttpErrorResponse} from '@angular/common/http';
import LaErrorResponse from '../live-insight-edge-report-page/reports-services/la-error-response';
import {forkJoin, Observable, of, throwError} from 'rxjs';
import {applyTransaction, EntityState, EntityStore, guid, ID, QueryEntity} from '@datorama/akita';
import {LiveInsightEdgeReportChartObject} from '../live-insight-edge-report-page/reports-services/live-insight-edge-report-chart-object';
import {CommonService} from '../../../../utils/common/common.service';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {ReportRequest} from '../../../reporting/models/api/request/sub/report-request';
import LiveInsightEdgeReportResponse from '../../models/live-insight-edge-report-response';
import InsightChartHeaderInfo from '../../../reporting/models/charts/headers/insight-chart-header-info';
import {DeviceFormatterService} from '../../../reporting/services/formatting/device/device-formatter.service';
import {QueueReportGroupRequest} from '../../../reporting/models/api/request/queue-report-group-request';
import {ReportPriority} from '../../../reporting/models/api/request/enums/report-priority';
import ReportClassificationSource from '../../../reporting/models/api/request/enums/report-classification-source';
import ReportClassificationContext from '../../../reporting/models/api/request/enums/report-classification-context';
import ReportResponse from '../../../reporting/models/api/response/report-response';
import {ReportMetaData} from '../../../reporting/models/charts/metadata/report-meta-data';
import ReportTimeSeriesChartData from '../../../reporting/models/charts/time-series/report-time-series-chart-data.model';
import {ReportService} from '../../../reporting/services/report/report.service';


import LiveInsightEdgePredictionsResultFormatterService from '../live-insight-edge-predictions-result-formatter/live-insight-edge-predictions-result-formatter.service';
import {LiveInsightPredictionsReportDataService} from './live-insight-predictions-report-data.service';
import LiveInsightEdgePredictionsReportParameters from '../../models/live-insight-edge-predictions-report-parameters';
import ReportResult from '../../../reporting/models/api/response/sub/report-result';
import {ApiError} from '../../../../utils/api-error';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class LiveInsightEdgePredictionsService implements ResettableService, OnDestroy {
  static readonly STORE_NAME = 'insightPredictions';

  constructor(
    private commonService: CommonService,
    private logger: Logger,
    private deviceFormatterService: DeviceFormatterService,
    private reportService: ReportService,

    private liveInsightReportDataService: LiveInsightPredictionsReportDataService,
    private insightResultFormatService: LiveInsightEdgePredictionsResultFormatterService,

    @Optional() private readonly store: EntityStore<EntityState<LiveInsightEdgeReportChartObject>>,
    @Optional() private readonly query: QueryEntity<EntityState<LiveInsightEdgeReportChartObject>>
  ) {
    if (this.commonService.isNil(store)) {
      this.store = new EntityStore<EntityState<LiveInsightEdgeReportChartObject>>(void 0,
        {name: LiveInsightEdgePredictionsService.STORE_NAME, resettable: true});
    }
    if (this.commonService.isNil(query)) {
      this.query = new QueryEntity<EntityState<LiveInsightEdgeReportChartObject>>(this.store);
    }
  }

  /**
   * Get the list of insight reports
   */
  public getReports(query: LiveInsightEdgePredictionsReportParameters): Observable<Array<LiveInsightEdgeReportChartObject>> {
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
   * Reset all stores.  Be careful when this is called since onDestroy of one component (on page destroy)
   * can be called after onInit of another page,  thereby possibly destroying the state that page set
   */
  public resetStores(): void {
    this.store.reset();
  }

  /**
   * Transform the response into objects that can be put in the store and store them
   * @param insightReportRequests - the HTTP response objects
   */
  private setStoreData(insightReportRequests: Array<LiveInsightEdgeReportResponse>): void {
    const storeData = insightReportRequests.map((insightReportRequest: LiveInsightEdgeReportResponse) => {
      return new LiveInsightEdgeReportChartObject(insightReportRequest.id, void 0);
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
          metadata = this.getPredictionMetaData(reportResult);
          chart = this.insightResultFormatService.formatAsTimeSeries(reportResult);
          errorMessage = void 0;
        }

        return new LiveInsightEdgeReportChartObject(id, header, chart, metadata, errorMessage);
      }
    } catch (err) {
      return new LiveInsightEdgeReportChartObject(id, header, void 0, void 0, err.message);
    }
  }

  /**
   * Parses the meta data from report and returns the correct data.
   */
  private getPredictionMetaData(reportResult: ReportResult): Array<ReportMetaData> {
    const allMetaData = this.insightResultFormatService.getReportPresentableMetaData(reportResult);
    // We remove "site" and "service provider" which are parsed for the title but should not be in the legend
    const filteredMetaData = allMetaData.filter(metaData => metaData.field !== 'Site' && metaData.field !== 'Service Provider');
    return filteredMetaData;
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
    const id = insightReportResponse.id;
    let header: InsightChartHeaderInfo;
    return this.reportService.executeReport(reportRequest)
      .pipe(
        tap((reportResponse: ReportResponse) => {
          header = this.insightResultFormatService.getInsightChartHeaderInfo(insightReportResponse, reportResponse);
        }),
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
      name: report.reportName,
      reports: [report],
      priority: ReportPriority.P2,
      classification: {
        source: ReportClassificationSource.OPERATIONS_DASHBOARD,
        context: ReportClassificationContext.REPORT
      }
    };
  }

  /**
   * Handles run time and HTTP errors.  We need to silently consume them due to the forkJoin operator which will kill
   * all other observables if one fails.
   * @param id - The id of the entity that is having an error
   * @param err - the actual error
   */
  private handleReportRequestError(id: ID, err: HttpErrorResponse): Observable<LiveInsightEdgeReportChartObject> {
    const errorMessage = this.getErrorMessage(err?.error);
    return of(err)
      .pipe(
        map(() => {
          const entity = this.query.getEntity(id);
          const updatedEntity = {...entity, isLoading: false, error: errorMessage};
          return updatedEntity;
        }),
        tap((update: LiveInsightEdgeReportChartObject) => {
          this.logger.error(errorMessage);
          this.store.replace(id, update);
        })
      );
  }

  /**
   * error handler
   * @param err Http Error
   */
  private errorHandler(err: ApiError | LaErrorResponse): Observable<never> {
    const errorMessage = this.getErrorMessage(err);
    applyTransaction(() => {
      this.store.setError(errorMessage);
      this.store.set([]);
      this.store.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(err);
  }

  private getErrorMessage(err: ApiError | LaErrorResponse): string {
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
    return errorMessage;
  }

  ngOnDestroy(): void {
    this.store.reset();
  }
}
