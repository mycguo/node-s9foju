import { moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import * as Highcharts from 'highcharts';
import { ChartWidgetComponent } from './chart-widget.component';
import { OnInit, Component } from '@angular/core';
import { subDays, startOfDay } from 'date-fns';

const chartOptions: Highcharts.Options = {
  chart: {
    spacing: [5, 10, 0, 10],
    zoomType: 'x',
  },
  title: {
    text: undefined,
  },
  xAxis: {
    type: 'datetime',
    dateTimeLabelFormats: {
      day: '%e',
    },
    tickInterval: 3600 * 1000 * 24,
    minPadding: 0,
    maxPadding: 0,
    lineColor: '#7D889B',
    tickColor: '#7D889B',
    tickLength: 6,
    crosshair: {
      snap: true,
    },
  },

  yAxis: {
    title: {
      text: 'Number of issues',
      style: {
        color: '#7D889B',
        fontSize: '10px',
        fontWeight: 'bold',
        lineHeight: '12px',
      },
    },
  },
  legend: {
    enabled: false,
  },
  exporting: {
    enabled: false,
  },
  time: {
    useUTC: false,
  },
  plotOptions: {
    line: {
      lineWidth: 2,
      marker: {
        enabled: true,
        symbol: 'circle',
        lineWidth: 0,
        radius: 3,
        states: {
          hover: {
            radiusPlus: 0,
          },
        },
      },
    },
  },
  // series: [
  //   {
  //     id: 'total',
  //     name: 'Total',
  //     zIndex: 1,
  //     lineWidth: 1,
  //     dashStyle: 'Dash',
  //     linkedTo: 'peaks',
  //     type: 'line',
  //     className: 'total-series',
  //     enableMouseTracking: false,
  //     color: '#000',
  //     marker: {
  //       enabled: false
  //     },
  //     data: [
  //       [1577397600000, 21.0],
  //       [1577829600000, 18.7],
  //       [1578261600000, 21.1],
  //       [1578693600000, 21.2],
  //       [1579125600000, 21.8],
  //       [1579557600000, 22.8],
  //       [1579903200000, 15.7]
  //     ]
  //   },
  //   {
  //     id: 'peaks',
  //     name: 'Peaks',
  //     type: 'line',
  //     zIndex: 2,
  //     lineWidth: 2,
  //     color: '#3A97C8',
  //     marker: {
  //       enabled: true,
  //       symbol: 'circle',
  //       lineWidth: 0,
  //       radius: 3,
  //       states: {
  //         hover: {
  //           radiusPlus: 0
  //         }
  //       }
  //     },
  //     data: [
  //       [1577397600000, 11.5],
  //       [1577829600000, 12.1],
  //       {
  //         x: 1578261600000,
  //         y: 38.8,
  //         color: '#FF0000',
  //         marker: {
  //           lineColor: '#fff',
  //           lineWidth: 2,
  //           radius: 4,
  //           states: {
  //             hover: {
  //               radius: 6
  //             }
  //           }
  //         }
  //       },
  //       [1578693600000, 23.8],
  //       [1579125600000, 11.4],
  //       {
  //         x: 1579557600000,
  //         y: 28.8,
  //         color: '#FF0000',
  //         marker: {
  //           lineColor: '#fff',
  //           lineWidth: 2,
  //           radius: 4,
  //           states: {
  //             hover: {
  //               radius: 6
  //             }
  //           }
  //         }
  //       },
  //       [1579903200000, 8.3]
  //     ]
  //   }
  // ]
};

@Component({
  selector: 'nx-chart-widget-stories',
  template: ` <nx-chart-widget
      [options]="chartOptions"
      [addSeries]="newSeries"
      [updateSeries]="updatedSeries"
      (chartInstance)="chartCallback($event)"
    >
    </nx-chart-widget>
    <br /><br />
    <div class="control-panel">
      <select [(ngModel)]="seriesType">
        <option value="line" selected>Line</option>
        <option value="bar">Bar</option>
      </select>
      <button (click)="addSeries()">Add Series</button>
      <button (click)="updateSeries()">Update Series</button>
    </div>
    <br />
    <hr />
    <br />
    <nx-chart-widget [options]="chartOptions2" [addSeries]="newSeries2">
    </nx-chart-widget>
    <br /><br />
    <div class="control-panel">
      <input type="number" [(ngModel)]="numPoints" />
      <button (click)="addSeries2()">Add Series</button>
    </div>`,
  styles: [
    ':host {display: block; width: 930px; height: 160px; overflow: visible;}',
    '.control-panel * {margin-right: 10px;}',
  ],
})
// @ts-ignore
class ChartWidgetStories implements OnInit {
  chart: Highcharts.Chart;
  chartOptions: Highcharts.Options;
  chartOptions2: Highcharts.Options;
  newSeries: Highcharts.SeriesOptionsType[];
  newSeries2: Highcharts.SeriesOptionsType[];
  updatedSeries: Highcharts.SeriesOptionsType[];

  seriesType: any = 'line';
  numPoints = 30;

  ngOnInit(): void {
    this.chartOptions = chartOptions;

    this.chartOptions2 = Object.assign({}, chartOptions, {
      xAxis: { type: 'area' },
      series: [],
    });
    this.addSeries2();
  }

  chartCallback(chart: Highcharts.Chart): void {
    action('Chart')(chart);
    this.chart = chart;
  }

  addSeries() {
    const serie1 = this.createSeries({
      id: 'total',
      name: 'Total',
      zIndex: 1,
      lineWidth: 1,
      dashStyle: 'Dash',
      linkedTo: 'peaks',
      type: 'line',
      className: 'total-series',
      enableMouseTracking: false,
      color: '#000',
      marker: {
        enabled: false,
      },
    });
    const serie2 = this.createSeries({
      zIndex: 2,
      lineWidth: 2,
      marker: {
        enabled: true,
        symbol: 'circle',
        lineWidth: 0,
        radius: 3,
        states: {
          hover: {
            radiusPlus: 0,
          },
        },
      },
    });
    this.newSeries = [serie1, serie2];
  }

  addSeries2() {
    const series = [];
    for (let index = 0; index < this.numPoints; index++) {
      series.push(this.getRandomData(index, false));
    }
    this.newSeries2 = [
      {
        type: 'area',
        stacking: 'normal',
        marker: {
          enabled: false,
        },
        data: series,
      },
    ];
  }

  updateSeries() {
    const series = [];
    const totalLine = {
      id: 'total',
      name: 'Total',
      zIndex: 1,
      lineWidth: 1,
      dashStyle: 'Dash',
      linkedTo: 'peaks',
      type: 'line',
      className: 'total-series',
      enableMouseTracking: false,
      color: '#000',
      marker: {
        enabled: false,
      },
    };

    series.push(this.createSeries(totalLine));

    for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
      series.push(this.createSeries());
    }
    this.chart.showLoading();
    setTimeout(() => {
      this.updatedSeries = series;
      this.chart.hideLoading();
    }, 1000);
  }

  getDateRange() {
    const numDays = 30;
    const today = startOfDay('2020-01-25').getTime();
    const range = [today];
    for (let index = 0; index < numDays; index++) {
      range.unshift(subDays(today, index).getTime());
    }
    return range;
  }

  getRandomData(x, marker = true) {
    const rand = Math.floor(Math.random() * 100);
    if (Math.random() < 0.1 && marker) {
      return {
        x: x,
        y: rand,
        color: '#FF0000',
        marker: {
          lineColor: '#fff',
          lineWidth: 2,
          radius: 4,
          states: {
            hover: {
              radius: 6,
            },
          },
        },
      };
    }
    return [x, rand];
  }

  createSeries(seriesOptions = {}) {
    const series = this.getDateRange().map((serie) =>
      this.getRandomData(serie)
    );
    return Object.assign({}, seriesOptions, {
      type: this.seriesType,
      data: series,
    });
  }
}

export default {
  title: 'Shared/Chart Widget',
  decorators: [moduleMetadata({ declarations: [ChartWidgetComponent] })],
};

export const Default = () => ({
  props: {},
  component: ChartWidgetStories,
});

Default.story = {
  name: 'default',
};
