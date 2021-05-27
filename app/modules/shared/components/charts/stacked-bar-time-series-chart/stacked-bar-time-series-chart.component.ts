import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';
import {SeriesColumnOptions, YAxisOptions} from 'highcharts';
import LiveInsightPointMetaData from '../../../../reporting/models/charts/points/live-insight-point-meta-data';
import {ChartSeriesFactoryService} from '../../../../../services/chart-series-factory/chart-series-factory.service';
import {LiveInsightTimeSeriesPointFactoryService} from '../../../../../services/live-insight-time-series-point-factory/live-insight-time-series-point-factory.service';
import {ChartElementColors} from '../../chart-widget/constants/chart-element-colors.enum';
import ReportStackedBarTimeSeries from '../../../../reporting/models/charts/stacked-bar-time-series/report-stacked-bar-time-series.model';
import ReportStackedBarTimeSeriesChartData from '../../../../reporting/models/charts/stacked-bar-time-series/report-stacked-bar-time-series-chart-data.model';

@Component({
  selector: 'nx-stacked-bar-time-series-chart',
  templateUrl: './stacked-bar-time-series-chart.component.html'
})
export class StackedBarTimeSeriesChartComponent implements OnChanges {

  static readonly TOOLTIP_DATE_FORMAT = '%A, %b %e'; // day precision

  @Input() chartData: ReportStackedBarTimeSeriesChartData;

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      spacing: [5, 10, 0, 10],
    },
    title: {
      text: undefined
    },
    xAxis: {
      type: 'datetime',
      labels: {
        useHTML: true,
        align: 'center',
        autoRotation: false,
        style: {
          color: ChartElementColors.REGENT_GRAY_BASE,
          fontSize: '10px',
          lineHeight: '10px',
          textAlign: 'center'
        },
        formatter: function () {
          const value = Highcharts.dateFormat('%e', this.value);
          if (+value === 1 || this.axis.min === this.value) {
            return `${value}
                    <span style="position:absolute;top:100%;left:50%;transform: translateX(-50%)">
                        ${Highcharts.dateFormat('%b', this.value)}
                    </span>`;
          }
          if (+value % 5 === 0) {
            return value;
          }
        }
      },
      lineColor: ChartElementColors.REGENT_GRAY_BASE,
      tickColor: ChartElementColors.REGENT_GRAY_BASE,
      tickLength: 6,
      tickInterval: 24 * 3600 * 1000,
      minPadding: 0,
      maxPadding: 0,
      startOnTick: true,
      endOnTick: true,
      showFirstLabel: true,
      showLastLabel: true,

    },
    yAxis: {
      title: {
        text: undefined,
        style: {
          color: ChartElementColors.REGENT_GRAY_BASE,
          fontSize: '10px',
          fontWeight: 'bold',
          lineHeight: '12px'
        }
      },
      labels: {
        style: {
          color: ChartElementColors.REGENT_GRAY_BASE,
          fontSize: '10px',
          lineHeight: '12px'
        }
      }
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        minPointLength: 3,
        pointWidth: 13,
        stacking: 'normal',
      }
    },
    tooltip: {
      xDateFormat: StackedBarTimeSeriesChartComponent.TOOLTIP_DATE_FORMAT,
    },
    legend: {
      align: 'left',
      alignColumns: false,
      symbolWidth: 5,
      symbolHeight: 6,
      itemDistance: 16,
      itemMarginBottom: 6,
      itemStyle: {
        color: ChartElementColors.OXFORD_BLUE_BASE,
        fontSize: '10px',
        lineHeight: '12px',
        fontWeight: 'normal',
        transform: 'translateY(2px)'
      },
      x: 45
    },
    exporting: {
      enabled: false
    },
    time: {
      useUTC: false,
    }
  };

  constructor(
    private chartSeriesFactory: ChartSeriesFactoryService,
    private liveInsightTimeSeriesPointFactoryService: LiveInsightTimeSeriesPointFactoryService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.chartData?.currentValue != null && this.chartData.data != null) {
      this.chartOptions.series = this.createChartWidgetData(this.chartData.data);
      let yAxisLabel = this.chartData.yAxis.label;
      // If there units, additional options must be set
      if (this.chartData.yAxis.units) {
        yAxisLabel += ` (${this.chartData.yAxis.units})`;
        this.chartOptions.tooltip = {
          xDateFormat:  StackedBarTimeSeriesChartComponent.TOOLTIP_DATE_FORMAT,
          valueSuffix: ' ' + this.chartData.yAxis.units
        };
      }
      (<YAxisOptions>this.chartOptions.yAxis).title.text = yAxisLabel;
      this.chartOptions = {...this.chartOptions};
    }
  }

  private createChartWidgetData(seriesData: Array<ReportStackedBarTimeSeries<any>>): Array<Highcharts.SeriesOptionsType> {
    return seriesData.map((series) => {
      const seriesOptions: SeriesColumnOptions = {
        type: 'column',
        name: series.displayName,
        color: series.configuration?.color
      };
      return this.chartSeriesFactory.reportStackedBarTimeSeriesToChartSeries<LiveInsightPointMetaData>(series, seriesOptions,
        this.liveInsightTimeSeriesPointFactoryService);
    });
  }

}
