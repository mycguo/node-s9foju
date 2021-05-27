import { Injectable } from '@angular/core';
import {VisualDataGenerator} from '../../containers/dashboard-widget/visual-data-generator';
import ReportResponse from '../../../reporting/models/api/response/report-response';
import ReportResult from '../../../reporting/models/api/response/sub/report-result';
import ReportTimeSeriesChartData from '../../../reporting/models/charts/time-series/report-time-series-chart-data.model';
import ReportTimeSeriesDataPoint from '../../../reporting/models/charts/time-series/report-time-series-data-point';
import ReportStackedBarTimeSeries from '../../../reporting/models/charts/stacked-bar-time-series/report-stacked-bar-time-series.model';
import ReportAxisModel from '../../../reporting/models/charts/report-axis.model';
import {parse} from 'date-fns';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {ReportResultState} from '../../../reporting/models/api/response/sub/report-result-state';

@Injectable({
  providedIn: 'root'
})
export class ReportStackedBarDataGeneratorService implements VisualDataGenerator {

  static readonly SITE_NAME = 'site_name';

  // Not currently used for this widget, but a placeholder to hold options.
  option: any;

  constructor() { }

  buildConfig(buildFrom: ReportResponse): any {
    return {};
  }

  setOptions(options: any): void {
    this.option = options;
  }

  transformData(data: Array<ReportResult>): ReportTimeSeriesChartData {

    if (data == null || data.length === 0 || data?.[0].timeSeries?.seriesData == null) {
      return null;
    }

    if (data[0].timeSeries.seriesData.length === 0) {
      return new ReportTimeSeriesChartData({ data: [], xAxis: null, yAxis: null });
    }

    const firstReport = data[0];
    const nameKey = firstReport.reportKeys.find(
      (key) =>  key.name === ReportStackedBarDataGeneratorService.SITE_NAME);

    const firstTimeSeries = firstReport.timeSeries;
    const fieldLabel = firstTimeSeries.field.label;
    const seriesList = firstTimeSeries.seriesData.map((series) => {
      const points = series.data.map((dataPoint) => {
        const parsedDate = parse(dataPoint[0].toString());
        const dateInMilli = parsedDate.getTime();
        return <ReportTimeSeriesDataPoint<any>> {
          time: dateInMilli,
          value: dataPoint[1],
          meta: null
        };
      });
      // resolve infoElement for series name
      const siteNameField = series.key.find((key) => key.infoElementId === nameKey.fieldId);
      const siteName = siteNameField.value;
      return new ReportStackedBarTimeSeries(
        siteName != null ? siteName.toString() : 'Other',
        siteName != null ? siteName.toString() : 'Other',
        points,
        null
      );
    });
    return new ReportTimeSeriesChartData(
      {
        data: seriesList,
        xAxis: <ReportAxisModel> { label: null },
        yAxis: <ReportAxisModel> { label: fieldLabel }
      }
    );
  }

  generateError(data: any): DetailedError {
    const firstResult = data[0];
    if (firstResult == null) {
      return <DetailedError> {
        message: 'Result data can not be fond in the response.'
      };
    }
    if (firstResult.state === ReportResultState.FAILED) {
      return firstResult.error;
    }
    return null;
  }
}
