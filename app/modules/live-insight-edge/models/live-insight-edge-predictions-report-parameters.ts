export default interface LiveInsightEdgePredictionsReportParameters {
  startTimeMillis: number;
  endTimeMillis: number;
  flexFilter: string;
  limit?: number; // If none is supplied we will use a default value
}
