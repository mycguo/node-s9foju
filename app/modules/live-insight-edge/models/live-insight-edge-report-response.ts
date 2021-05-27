import {ID} from '@datorama/akita';
import {ReportRequest} from '../../reporting/models/api/request/sub/report-request';
import ReportTimeSeriesChartData from '../../reporting/models/charts/time-series/report-time-series-chart-data.model';
import KeyValueMetadata from '../../reporting/models/metadata/key-value-metadata.model';

interface LiveInsightEdgeReportResponse extends ReportRequest {
  id: ID;
  data?: ReportTimeSeriesChartData;
  keyStatistics?: Array<KeyValueMetadata>;
}

export default LiveInsightEdgeReportResponse;
