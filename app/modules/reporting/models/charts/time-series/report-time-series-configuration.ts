import ReportLineStyle from './report-line-style';
import {ReportPointStyle} from './report-point-style.enum';

export default interface ReportTimeSeriesConfiguration {
  lineStyle: ReportLineStyle;

  /** True indicates that the visibility of this series is toggleable. */
  isFilterable?: boolean;

  /** Chart points/markers style */
  pointStyle?: ReportPointStyle;

  /** Threshold for 80% threshold series */
  threshold?: string|number;
}
