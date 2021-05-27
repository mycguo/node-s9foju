import ReportTimeSeriesDataPoint from './report-time-series-data-point';
import ReportTimeSeriesConfiguration from './report-time-series-configuration';
import {ReportTimeSeriesType} from './report-time-series-type';

export default class ReportTimeSeries<T> {
  public id: string;
  public displayName: string;
  public type: ReportTimeSeriesType;
  public points: Array<ReportTimeSeriesDataPoint<T>>;
  public configuration: ReportTimeSeriesConfiguration;

  constructor(id: string, displayName: string, type: ReportTimeSeriesType, points: Array<ReportTimeSeriesDataPoint<T>>,
              configuration: ReportTimeSeriesConfiguration
  ) {
    this.id = id;
    this.type = type;
    this.points = points;
    this.displayName = displayName;
    this.configuration = configuration;
  }

  public findLargestValue(): number {
    const numbers: Array<number> = this.points.map(point => point.value);
    return Math.max(...numbers);
  }

  public hasPoints(): boolean {
    return this.points.length > 0;
  }
}
