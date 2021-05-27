import ReportTimeSeriesDataPoint from '../../../../reporting/models/charts/time-series/report-time-series-data-point';
import {ReportInfoValue} from '../../../../reporting/models/report-info';
import {Point} from 'highcharts';
import ReportDrilldownParameters from '../../../../reporting/models/api/request/sub/report-drilldown-parameters';

export abstract class TimeSeriesTooltipProvider {
  abstract generateTooltipHtml(dataPoint: ReportTimeSeriesDataPoint<any>,
                               chartPoint: Point,
                               units: string): string;

  abstract generateDrilldownLink(dataPoint: ReportTimeSeriesDataPoint<any>,
                        drilldownParameters: ReportDrilldownParameters,
                        reportInfoValue: ReportInfoValue): string | null;

  abstract cleanUpLinks();
}
