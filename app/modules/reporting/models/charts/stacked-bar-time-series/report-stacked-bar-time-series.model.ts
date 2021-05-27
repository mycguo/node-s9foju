import ReportTimeSeriesDataPoint from '../time-series/report-time-series-data-point';
import {ReportStackedBarTimeSeriesConfiguration} from './report-stacked-bar-time-series-configuration';

export default class ReportStackedBarTimeSeries<T> {
  public id: string;
  public displayName: string;
  public points: Array<ReportTimeSeriesDataPoint<T>>;
  public configuration: ReportStackedBarTimeSeriesConfiguration;

  constructor(
    id: string,
    displayName: string,
    points: Array<ReportTimeSeriesDataPoint<T>>,
    configuration: ReportStackedBarTimeSeriesConfiguration
  ) {
    this.id = id;
    this.points = points;
    this.displayName = displayName;
    this.configuration = configuration;
  }

  public hasPoints(): boolean {
    return this.points.length > 0;
  }
}
