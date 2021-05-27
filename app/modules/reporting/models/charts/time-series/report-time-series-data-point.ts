export default interface ReportTimeSeriesDataPoint <T> {
  time: number;
  value: number;
  meta: T;
  drilldownUrl?: string;
}
