import {PointOptionsObject} from 'highcharts';
import ReportTimeSeriesDataPoint from '../../modules/reporting/models/charts/time-series/report-time-series-data-point';

export interface ChartPointFactory<T> {
  createChartPoint(point: ReportTimeSeriesDataPoint<T>): PointOptionsObject | [number, number];
}
