import { Injectable } from '@angular/core';
import {ReportRequest} from '../../../../reporting/models/api/request/sub/report-request';
import {HttpClient} from '@angular/common/http';
import LiveInsightEdgeReportParameters from '../../../models/live-insight-edge-report-parameters';
import LiveInsightEdgeReportRequest from '../../../../reporting/models/api/request/live-insight-edge-report-request';

@Injectable({
  providedIn: 'root'
})
export class LiveInsightReportDataService {
  static readonly NODE_PROXY_PRE_FIX = '/api/nx';
  static readonly INSIGHT_REPORT_ENDPOINT = `${LiveInsightReportDataService.NODE_PROXY_PRE_FIX}/analytics/insights/reports`;
  static readonly DEFAULT_RESULT_LIMIT = 10;

  constructor(private http: HttpClient) {
  }

  public getTopReports(query: LiveInsightEdgeReportParameters) {
    const apiParams = this.transformInsightEdgeParams(query);
    return this.http.post<{ reports: Array<ReportRequest> }>(LiveInsightReportDataService.INSIGHT_REPORT_ENDPOINT, apiParams);
  }

  private transformInsightEdgeParams(query: LiveInsightEdgeReportParameters): LiveInsightEdgeReportRequest {
    return {
      startTimeMillis: query.startTimeMillis,
      endTimeMillis: query.endTimeMillis,
      flexSearch: query.flexFilter,
      order: {
        time: query.timeSortOrder.toString(),
        volume: query.volumeSortOrder.toString()
      },
      limit: query.limit === void 0 ? LiveInsightReportDataService.DEFAULT_RESULT_LIMIT : query.limit,
      anomaliesOnly: query.isAnomaliesOnly
    };
  }
}
