import {Component, EventEmitter, Input, OnChanges, OnInit, Optional, Output, SimpleChanges, SkipSelf} from '@angular/core';
import {ChartSeriesFactoryService} from '../../../../../services/chart-series-factory/chart-series-factory.service';
import * as Highcharts from 'highcharts';
import {SeriesAreaOptions, SeriesLineOptions, XAxisOptions, YAxisOptions} from 'highcharts';
import ReportTimeSeriesChartData from '../../../../reporting/models/charts/time-series/report-time-series-chart-data.model';
import ReportTimeSeries from '../../../../reporting/models/charts/time-series/report-time-series.model';
import LiveInsightPointMetaData from '../../../../reporting/models/charts/points/live-insight-point-meta-data';
import {LiveInsightTimeSeriesPointFactoryService} from '../../../../../services/live-insight-time-series-point-factory/live-insight-time-series-point-factory.service';
import {TimeSeriesTooltipProvider} from './time-series-tooltip-provider';
import {ReportHiddenSeries} from '../../../../live-insight-edge/services/live-insight-edge-report-state/report-hidden-series';
import {CommonService} from '../../../../../utils/common/common.service';
import {ChartElementColors} from '../../chart-widget/constants/chart-element-colors.enum';
import {ReportTimeSeriesType} from '../../../../reporting/models/charts/time-series/report-time-series-type';

/***
 * The time series component provides ability to chart time series series data.
 * Series data can be provided in the form of:
 *  * dashed series
 *  * solid node series
 */
@Component({
  selector: 'nx-time-series-chart',
  templateUrl: './time-series-chart.component.html',
  styleUrls: ['./time-series-chart.component.less']
})
export class TimeSeriesChartComponent implements OnInit, OnChanges {

  /** Associates the chart with data store id */
  @Input() dataId: string | number;

  @Input() timeSeriesData: ReportTimeSeriesChartData;

  @Input() hiddenSeries: ReportHiddenSeries;

  @Output() chartInstance = new EventEmitter<Highcharts.Chart>();

  @Output() chartRender = new EventEmitter<Event>();

  chartOptions: Highcharts.Options = {
    chart: {
      reflow: true,
      spacing: [5, 10, 0, 10],
      zoomType: 'x'
    },
    title: {
      text: undefined
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%e %b',
        month: '%b \'%y',
      },
      // maybe base this dynamically on time min and max?
      // tickInterval: 3600 * 1000 * 24 * 30,
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
        // TODO: display date in two rows and add tickPositioner Fn
        // formatter: function () {
        //   const value = Highcharts.dateFormat('%e', this.value);
        //   if (+value === 1 || this.axis.min === this.value) {
        //     return `${value}
        //             <span style="position:absolute;top:100%;left:50%;transform: translateX(-50%)">
        //                 ${Highcharts.dateFormat('%b', this.value)}
        //             </span>`;
        //   }
        //   if (+value % 2 === 0) {
        //     return value;
        //   }
        //   return value;
        // }
      },
      minPadding: 0,
      maxPadding: 0,
      showFirstLabel: true,
      showLastLabel: true,
      lineColor: '#7D889B',
      tickColor: '#7D889B',
      tickLength: 6,
      crosshair: {
        snap: true
      }
    },
    tooltip: {
      padding: 0,
      stickOnContact: true,
      useHTML: true,
      style: {
        pointerEvents: 'auto'
      }
    },
    yAxis: {
      minPadding: 0,
      title: {
        text: 'NaN',
        style: {
          color: '#7D889B',
          fontSize: '10px',
          fontWeight: 'bold',
          lineHeight: '12px'
        }
      }
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    time: {
      useUTC: false
    },
    plotOptions: {
      series: {
        turboThreshold: 0
      },
      line: {
        lineWidth: 2,
        marker: {
          enabled: true,
          symbol: 'circle',
          lineWidth: 0,
          radius: 2,
          states: {
            hover: {
              radiusPlus: 0
            }
          }
        }
      }
    },
  };

  constructor(
    private chartSeriesFactory: ChartSeriesFactoryService,
    private liveInsightTimeSeriesPointFactoryService: LiveInsightTimeSeriesPointFactoryService,
    private commonService: CommonService,
    @Optional() @SkipSelf() private timeSeriesTooltipProvider: TimeSeriesTooltipProvider
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.timeSeriesData?.currentValue != null && this.timeSeriesData.data != null) {
      const chartWidgetData = this.createChartWidgetData(
        <Array<ReportTimeSeries<any>>> this.timeSeriesData.data);
      let yAxisLabel = this.timeSeriesData.yAxis.label;
      // If there units, additional options must be set
      if (this.timeSeriesData.yAxis.units) {
        yAxisLabel += ` (${this.timeSeriesData.yAxis.units})`;
        this.chartOptions.tooltip = {
          ... this.chartOptions.tooltip,
          xDateFormat: '%A, %b %e, %H:%M:%S', // second precision
          valueSuffix: ' ' + this.timeSeriesData.yAxis.units
        };
      }
      (<YAxisOptions>this.chartOptions.yAxis).title.text = yAxisLabel;

      // add vertical line to chart e.g.: current date line
      if (this.timeSeriesData.xAxis.plotLines) {
          (<XAxisOptions>this.chartOptions.xAxis).plotLines = this.timeSeriesData.xAxis.plotLines;
      }

      this.chartOptions.series = chartWidgetData;
    }
    // detect changes for hidden series.. if changed update chartoptions..
    if (changes.hiddenSeries?.currentValue != null) {
      const updatedChartOptions = Object.assign({}, this.chartOptions);
      for (const series of updatedChartOptions.series) {
        series.visible = !this.hiddenSeries[series.id];
      }
      this.chartOptions = updatedChartOptions;
    }
  }


  private createChartWidgetData(timeSeriesData: Array<ReportTimeSeries<any>>): Array<Highcharts.SeriesOptionsType> {
    const tooltipService = this.timeSeriesTooltipProvider;
    const componentSelf = this;
    return timeSeriesData.map((series) => {
      // create area series type for 80% threshold series
      if (series.type === ReportTimeSeriesType.LOWER_THRESHOLD) {
        const seriesAreaOptions: SeriesAreaOptions = {
          type: 'area',
          name: series.displayName,
          id: series.id,
          custom: {
            isFilterable: !!series.configuration?.isFilterable
          }
        };
        return this.chartSeriesFactory.reportTimeSeriesToAreaChartSeries<LiveInsightPointMetaData>(
          series,
          seriesAreaOptions,
          this.liveInsightTimeSeriesPointFactoryService
        );
      }
      const seriesOptions: SeriesLineOptions = {
        type: 'line',
        name: series.displayName,
        id: series.id,
        custom: {
          isFilterable: !!series.configuration?.isFilterable
        },
        tooltip: {
          pointFormatter: function() {
            const seriesPoint = series.points[this.index];
            const units = componentSelf.timeSeriesData?.yAxis?.units;
            if (tooltipService != null) {
              const pointFormat = tooltipService.generateTooltipHtml(seriesPoint, this, units);
              if (pointFormat != null) {
                return pointFormat;
              }
            }
            // default point format
            return `
                  <span class="nx-chart-widget-tooltip-point">
                    <span class="nx-chart-widget-tooltip-point__icon" style="background-color:${this.color}"></span>
                    <span class="nx-chart-widget-tooltip-point__text">${this.series.name}: <b>${this.y} ${units}</b></span>
                  </span>
                `;

          }
        }
      };
      return this.chartSeriesFactory.reportTimeSeriesToChartSeries<LiveInsightPointMetaData>(series, seriesOptions,
        this.liveInsightTimeSeriesPointFactoryService);
    });
  }


}
