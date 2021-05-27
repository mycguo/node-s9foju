import {Injectable} from '@angular/core';
import {SeriesLegend} from '../../../shared/components/charts/horizontal-legend/series-legend';
import {ReportHiddenSeries} from '../../services/live-insight-edge-report-state/report-hidden-series';
import {SeriesLineOptions} from 'highcharts';
import {ChartElementColors} from '../../../shared/components/chart-widget/constants/chart-element-colors.enum';
import {ReportPointStyle} from '../../../reporting/models/charts/time-series/report-point-style.enum';

@Injectable({
  providedIn: 'any',
  useFactory: (): never => {
    throw new Error('LiveInsightEdgeReportsPresenterService can not be injected directly.');
  },
})
export class LiveInsightEdgeReportsPresenterService {

  constructor() { }

  /***
   * Return a ReportHiddenSeries object reflecting the toggled state of the legend clicked.
   * @param legendClicked Series in legend clicked
   * @param existingSeries Existing ReportHiddenSeries
   * @return Updated ReportHiddenSeries
   */
  buildHiddenSeriesObject(legendClicked: SeriesLegend, existingSeries: ReportHiddenSeries)
      : ReportHiddenSeries {
    if (legendClicked == null) {
      return existingSeries;
    }
    const updatedSeries = { ...(existingSeries ?? {}) };
    if (existingSeries?.[legendClicked.key] != null) {
      updatedSeries[legendClicked.key] = !updatedSeries[legendClicked.key];
    } else {
      updatedSeries[legendClicked.key] = true;
    }
    return updatedSeries;
  }

  /**
   * Updates a SeriesLegend from a given ReportHiddenSeries.
   * @param hiddenSeries ReportHiddenSeries to update the current legend.
   * @param currentLegend SeriesLegend to update.
   * @return Updated series legend.
   */
  buildUpdatedSeriesLegend(hiddenSeries: ReportHiddenSeries, currentLegend: Array<SeriesLegend>): Array<SeriesLegend> {
    if (currentLegend == null) {
      return currentLegend;
    }
    const legend: Array<SeriesLegend> = currentLegend.map((series) => {
      return {...series, isHidden: hiddenSeries[series.key]};
    });
    return legend;
  }

  /**
   * Builds a series legend for a chart based on the existing chart series and a ReportHiddenSeries.
   * @param chart Chart containing the series to build the Legend.
   * @param hiddenSeries The ReportHiddenSeries.
   * @return SeriesLegend array.
   */
  buildSeriesLegendForChart(chart: Highcharts.Chart, hiddenSeries: ReportHiddenSeries): Array<SeriesLegend> {
    if (chart?.series != null && chart.series?.length > 0) {
      const updatedSeriesLegends = new Array<SeriesLegend>();
      // add anomaly legend
      updatedSeriesLegends.push(<SeriesLegend>{
        key: 'anomaly',
        color: ChartElementColors.RED_ORANGE_BASE,
        label: 'Anomaly',
        symbolType: ReportPointStyle.CIRCLE
      });
      for (const series of chart.series) {
        const seriesColor = series['color'];
        const seriesName = series['name'];
        const seriesKey = series['userOptions']?.['id'];
        const filterable = !!series['userOptions']?.['custom']?.['isFilterable'];
        // get custom pointStyle or try to find pointStyle from dashStyle of chart series
        const symbolType = series.userOptions?.custom?.pointStyle ||
          Object.values(ReportPointStyle)
            .find(key => key === (<SeriesLineOptions>series.options).dashStyle) ||
          ReportPointStyle.CIRCLE;
        updatedSeriesLegends.push(<SeriesLegend>{
          key: seriesKey,
          color: seriesColor,
          label: seriesName,
          symbolType: symbolType,
          filterable,
          isHidden: hiddenSeries?.[seriesKey]
        });
      }
      return updatedSeriesLegends;
    }
    return null;
  }
}
