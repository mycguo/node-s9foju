import {ReportPointStyle} from '../../../../reporting/models/charts/time-series/report-point-style.enum';

export interface SeriesLegend {
  key: string | number;
  color: string; // should be compatible css color code
  label: string;
  isHidden?: boolean;
  filterable?: boolean;
  symbolType: ReportPointStyle;
}
