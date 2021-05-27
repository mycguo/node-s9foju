import SortOrder from '../../../../live-insight-edge/services/live-insight-edge-report-page/sort-order';

export default interface LiveInsightEdgeReportRequest {
  startTimeMillis: number;
  endTimeMillis: number;
  flexSearch: string;
  order: {
    time: string;
    volume: string;
  };
  limit: number;
  anomaliesOnly: boolean;
}
