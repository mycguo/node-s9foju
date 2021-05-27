import {TestBed} from '@angular/core/testing';
import {LiveInsightEdgeReportsPresenterService} from './live-insight-edge-reports-presenter.service';
import {SeriesLegend} from '../../../shared/components/charts/horizontal-legend/series-legend';
import {Series, SeriesLineOptions} from 'highcharts';
import {ReportPointStyle} from '../../../reporting/models/charts/time-series/report-point-style.enum';


describe('LiveInsightEdgeReportsView.PresenterService', () => {
  let service: LiveInsightEdgeReportsPresenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should not be available for direct injection', () => {
    expect(() => {
      service = TestBed.inject(LiveInsightEdgeReportsPresenterService);
    }).toThrow();
  });

  it('should build a hidden series object', () => {
    const presenter = new LiveInsightEdgeReportsPresenterService();
    let legendClicked = null;
    const hiddenSeries = presenter.buildHiddenSeriesObject(legendClicked, null);
    expect(hiddenSeries).toBeNull();
    legendClicked = {
      key: 0,
      color: '#333',
      label: 'Test',
      symbolType: ReportPointStyle.DASH,
    } as SeriesLegend;
    const validHiddenSeries = presenter.buildHiddenSeriesObject(legendClicked, {});
    expect(validHiddenSeries[0]).toBeTruthy();
  });

  it('should update a current series legend from a ReportHiddenSeries object', () => {
    const presenter = new LiveInsightEdgeReportsPresenterService();
    const hiddenSeries = null;
    const updatedSeriesLegend = presenter.buildUpdatedSeriesLegend(hiddenSeries, []);
    expect(updatedSeriesLegend).toEqual([]);
    const validHiddenSeries = {'theKey': true};
    const currentLegend = [
      {
        key: 'theKey',
        color: '#333',
        label: 'Test',
        symbolType: ReportPointStyle.DASH,
      } as SeriesLegend
    ];
    const validSeriesLegend = presenter.buildUpdatedSeriesLegend(validHiddenSeries, currentLegend);
    const keySeriesLegendHidden = validSeriesLegend[0].isHidden;
    expect(keySeriesLegendHidden).toBe(true);
  });

  it('should build a Legend based on existing chart series and ReportHiddenSeries', () => {
    const presenter = new LiveInsightEdgeReportsPresenterService();
    const chart = {
      series: null
    } as Highcharts.Chart;
    const invalidChartLegend = presenter.buildSeriesLegendForChart(chart, {});
    expect(invalidChartLegend).toBeNull();
    const chartSeries = {
      name: 'name',
      options: {
        dashStyle: 'Dash'
      } as SeriesLineOptions,
      userOptions: {
        type: 'line',
        id: 'theKey',
        custom: {
          isFilterable: true
        }
      } as SeriesLineOptions
    } as Series;
    chartSeries['color'] = 'blue';
    chart.series = [
      chartSeries
    ];
    const seriesLegend = presenter.buildSeriesLegendForChart(chart, {});
    expect(seriesLegend?.[1]).toEqual({
      key: 'theKey',
      color: 'blue',
      label: 'name',
      filterable: true,
      isHidden: void 0,
      symbolType: ReportPointStyle.DASH,
    });
  });
});
