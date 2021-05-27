import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HeatmapData } from './heatmap-data';
import HeatmapChartOptions from './heatmap-chart.options';

@Component({
  selector: 'nx-heatmap-chart',
  templateUrl: './heatmap-chart.component.html',
  styleUrls: ['./heatmap-chart.component.less']
})
export class HeatmapChartComponent implements OnChanges {

  @Input() chartData: HeatmapData;

  chartOptions: Highcharts.Options;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.chartData?.currentValue != null) {
      const self = this;
      this.chartOptions = {
        ...HeatmapChartOptions,
        yAxis: {
          ...HeatmapChartOptions.yAxis,
          categories: this.chartData.yAxisCategories
        },
        colorAxis: {
          dataClasses: this.chartData.dataClasses
        },
        series: [{
          type: 'heatmap',
          colsize: this.chartData.binSize,
          data: this.chartData.seriesData,
          tooltip: {
            // useHTML: true,
            pointFormatter: function() {
              console.log('pointFormatter', this);
              return `asdfasd`;
            }
          },
        }],
        tooltip: {
          useHTML: true,
          formatter: function() {
            return `<div>${Highcharts.dateFormat(self.getDateFormat(), this.point.x)}</div>
              <span class="nx-chart-widget-tooltip-point">
                <span class="nx-chart-widget-tooltip-point__icon" style="background-color:${this.color}"></span>
                <span class="nx-chart-widget-tooltip-point__text">
                  ${self.getPointCategoryName(this.point)}: <b>${self.getStateName(this.point)}</b>
                </span>
              </span>`;
          }
        },
      };
    }
  }

  private getPointCategoryName(point): string {
    const axis = point.series.yAxis;
    return axis.categories[point.y];
  }

  private getStateName(point): string {
    return point.series.colorAxis.dataClasses[point.dataClass].name;
  }

  private getDateFormat(): string {
    switch (this.chartData?.binSize) {
      case 60000:
        return '%A, %b %e, %H:%M';
    }
  }
}
