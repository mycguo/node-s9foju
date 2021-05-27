import InsightChartHeaderInfo from '../../../../reporting/models/charts/headers/insight-chart-header-info';
import ReportTimeSeriesChartData from '../../../../reporting/models/charts/time-series/report-time-series-chart-data.model';
import {ReportMetaData} from '../../../../reporting/models/charts/metadata/report-meta-data';
import {ID} from '@datorama/akita';

export class LiveInsightEdgeReportChartObject {
  /**
   * @param id is a UUID
   * @param header - Report header information
   * @param chart - Will only exist if report has finished executing
   * @param metadata - Will only exist if report has finished executing
   * @param error - Error string
   * @param isLoading - True if data is loading
   */
  constructor(
    public id: ID,
    public header: InsightChartHeaderInfo,
    public chart?: ReportTimeSeriesChartData,
    public metadata?: Array<ReportMetaData>,
    public error?: string,
    public isLoading?: boolean,
  ) {
    this.isLoading = true;
  }
}
