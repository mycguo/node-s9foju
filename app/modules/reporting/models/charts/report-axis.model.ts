import {AxisPlotLinesOptions} from 'highcharts';

export default interface ReportAxisModel {
  label: string;
  units?: string;
  plotLines?: AxisPlotLinesOptions[];
}
