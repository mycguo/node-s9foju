import SortOrder from '../services/live-insight-edge-report-page/sort-order';

export default interface LiveInsightEdgeReportParameters {
  startTimeMillis: number;
  endTimeMillis: number;
  isAnomaliesOnly: boolean;
  flexFilter: string;
  timeSortOrder: SortOrder;
  volumeSortOrder: SortOrder;
  limit?: number; // If none is supplied we will use a default value
}
