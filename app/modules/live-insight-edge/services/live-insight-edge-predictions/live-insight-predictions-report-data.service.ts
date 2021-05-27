import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ReportRequest} from '../../../reporting/models/api/request/sub/report-request';
import LiveInsightEdgePredictionsReportRequest from '../../../reporting/models/api/request/live-insight-edge-predictions-report-request';
import LiveInsightEdgePredictionsReportParameters from '../../models/live-insight-edge-predictions-report-parameters';

@Injectable({
  providedIn: 'root'
})
export class LiveInsightPredictionsReportDataService {
  static readonly INSIGHT_PREDICTIONS_REPORT_ENDPOINT = '/api/nx/analytics/predictions/reports';
  static readonly DEFAULT_RESULT_LIMIT = 10;

  constructor(
    private http: HttpClient
  ) { }

  public getTopReports(query: LiveInsightEdgePredictionsReportParameters) {
    const apiParams = this.transformInsightEdgeParams(query);
    return this.http.post<{ reports: Array<ReportRequest> }>(
      LiveInsightPredictionsReportDataService.INSIGHT_PREDICTIONS_REPORT_ENDPOINT, apiParams);
  }

  private transformInsightEdgeParams(query: LiveInsightEdgePredictionsReportParameters): LiveInsightEdgePredictionsReportRequest {
    return {
      startTimeMillis: query.startTimeMillis,
      endTimeMillis: query.endTimeMillis,
      flexSearch: query.flexFilter,
      limit: query.limit === void 0 ? LiveInsightPredictionsReportDataService.DEFAULT_RESULT_LIMIT : query.limit,
    };
  }
}
