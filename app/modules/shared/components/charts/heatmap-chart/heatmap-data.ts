import { ColorAxisDataClassesOptions } from 'highcharts';

export interface HeatmapData {
  yAxisCategories: Array<string>;
  binSize: number;
  dataClasses: Array<ColorAxisDataClassesOptions>;
  seriesData: Array<Array<number>>;
}
