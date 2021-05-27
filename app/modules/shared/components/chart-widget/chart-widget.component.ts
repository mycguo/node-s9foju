import {Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, Output} from '@angular/core';
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import Pattern from 'highcharts/modules/pattern-fill';
import Heatmap from 'highcharts/modules/heatmap';
import {ChartEventsOptions} from 'highcharts';
import {CHART_SERIES_COLORS} from './constants/chart-series-colors.const';

Exporting(Highcharts);
Pattern(Highcharts);
Heatmap(Highcharts);

// default options for all charts
Highcharts.setOptions({
  chart: {
    style: {
      fontFamily: `'Roboto', sans-serif`,
    }
  },
  colors: CHART_SERIES_COLORS,
  credits: {
    enabled: false
  }
});

@Component({
  selector: 'nx-chart-widget',
  template: '',
  styles: [':host {display: block; width: 100%; height: 100%;}']
})
export class ChartWidgetComponent implements OnDestroy {
  private Highcharts: typeof Highcharts = Highcharts;
  private chart: Highcharts.Chart;

  // Initialize chart and set initial chart options
  // Run outside Angular zone, as it hardly affects application performance due to multiple eventListeners inside Highcharts
  @Input() set options(options: Highcharts.Options) {
    this._zone.runOutsideAngular(() => {
      this.updateOrCreateChart(options);
    });
  }

  // Helper method to add new series to existing chart
  // Note that this method should never be used when adding data synchronously at chart render time, as it adds expense to
  // the calculations and rendering. When adding data at the same time as the chart is initialized, add the series as a
  // configuration option instead.
  @Input() set addSeries(series: Highcharts.SeriesOptionsType[]) {
    this._zone.runOutsideAngular(() => {
      this.addChartSeries(series);
    });
  }

  // Helper method to update existing series of a chart
  @Input() set updateSeries(series: Highcharts.SeriesOptionsType[]) {
    this._zone.runOutsideAngular(() => {
      if (series && this.chart && this.chart.options) {
        this.updateOrCreateChart(Object.assign(this.chart.options, {series: series}));
      }
    });
  }

  // Returns created chart instance
  @Output() chartInstance = new EventEmitter<Highcharts.Chart>();

  @Output() chartRender = new EventEmitter<Event>();

  constructor(
    private el: ElementRef,
    private _zone: NgZone
  ) {
  }

  updateOrCreateChart(options: Highcharts.Options): void {
    if (options === void 0) {
      return;
    }
    if (this.chart && this.chart.update) {
      this.chart.update(options, true, true);
    } else {
      const chartEventOptions = Object.assign({}, options.chart.events, <ChartEventsOptions> {
        render: (event) => {
          this.chartRender.emit(event);
        }
      });
      options.chart.events = chartEventOptions;
      this.chart = (this.Highcharts as any)['chart'](
        this.el.nativeElement,
        options
      );

      // Emit chart instance on init chart
      this.chartInstance.emit(this.chart);
    }
  }

  addChartSeries(series: Highcharts.SeriesOptionsType[]): void {
    if (series && series.length > 0 && this.chart && this.chart.addSeries) {
      series.forEach(serie => this.chart.addSeries(serie));
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

}
