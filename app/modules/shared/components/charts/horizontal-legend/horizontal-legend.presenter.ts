import {SeriesLegend} from './series-legend';
import {ReportPointStyle} from '../../../../reporting/models/charts/time-series/report-point-style.enum';

export default class HorizontalLegendPresenter {

  readonly hiddenOpacity = .3;

  /**
   * Generates custom styles used for series legend.
   * @param seriesList SeriesLegend list
   */
  updateStyleMap(seriesList: Array<SeriesLegend>): Record<string, any> {
    const updatedStyleMap: Record<string, any> = {};
    if (seriesList == null) {
      return updatedStyleMap;
    }
    for (const series of seriesList) {
      if (typeof series.key === 'string' || typeof series.key === 'number') {
        switch (series.symbolType) {
          case ReportPointStyle.DONUT:
          case ReportPointStyle.SOLID:
          case ReportPointStyle.PATTERN:
            updatedStyleMap[series.key] = {
              borderColor: series.color,
              opacity: series.isHidden ? this.hiddenOpacity : 1
            };
            break;
          case ReportPointStyle.CIRCLE:
          case ReportPointStyle.DASH:
            updatedStyleMap[series.key] = {
              backgroundColor: series.color,
              opacity: series.isHidden ? this.hiddenOpacity : 1
            };
            break;
        }
      }
    }
    return updatedStyleMap;
  }
}
