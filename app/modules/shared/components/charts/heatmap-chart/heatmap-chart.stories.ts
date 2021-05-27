import { moduleMetadata } from '@storybook/angular';
import { HeatmapChartComponent } from './heatmap-chart.component';
import { HeatmapData } from './heatmap-data';
import { ChartWidgetComponent } from '../../chart-widget/chart-widget.component';

const DATA_CLASSES = [
  { from: 1, to: 1, name: 'offEnvOther', color: '#5EA6C9' },
  { from: 2, to: 2, name: 'on', color: '#AE7BC6' },
  { from: 3, to: 3, name: 'offAdmin', color: '#8DCE8D' },
  { from: 4, to: 4, name: 'offDenied', color: '#94A5AD' },
  { from: 5, to: 5, name: 'offEnvPower', color: '#E3C891' },
  { from: 6, to: 6, name: 'offEnvTemp', color: '#E19289' },
  { from: 7, to: 7, name: 'offEnvFan', color: '#3F84A6' },
  { from: 8, to: 8, name: 'failed', color: '#804B9B' },
  { from: 9, to: 9, name: 'onButFanFail', color: '#53AC53' },
  { from: 10, to: 10, name: 'offCooling', color: '#687D87' },
  { from: 11, to: 11, name: 'offConnectorRating', color: '#C69F53' },
  { from: 12, to: 12, name: 'onButInlinePowerFail', color: '#C65F53' },
];

const generateSeries = (): Array<Array<number>> => {
  const data = [];
  for (let i = 0; i < 15; i++) {
    const date = new Date(2020, 1, 20, 12, i).getTime();
    data.push([date, 0, Math.floor(Math.random() * 12) + 1]);
    data.push([date, 1, Math.floor(Math.random() * 12) + 1]);
    data.push([date, 2, Math.floor(Math.random() * 12) + 1]);
  }
  return data;
};

const CHART_DATA: HeatmapData = {
  binSize: 60 * 1000, // minute
  dataClasses: DATA_CLASSES,
  yAxisCategories: ['Power Supply.22', 'Power Supply.470', 'Power Supply.471'],
  seriesData: generateSeries(),
};

export default {
  title: 'Shared/Charts/Heatmap',

  decorators: [
    moduleMetadata({
      declarations: [HeatmapChartComponent, ChartWidgetComponent],
    }),
  ],
};

export const Default = () => ({
  template: `<nx-heatmap-chart style="display: block; height: 181px" [chartData]="chartData"></nx-heatmap-chart>`,
  props: {
    chartData: CHART_DATA,
  },
});

Default.story = {
  name: 'default',
};
