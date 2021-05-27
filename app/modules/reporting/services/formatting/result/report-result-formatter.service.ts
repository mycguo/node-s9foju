import {Injectable} from '@angular/core';
import ReportTimeSeriesChartData from '../../../models/charts/time-series/report-time-series-chart-data.model';
import {forkJoin, Observable} from 'rxjs';
import {DeviceFormatterService} from '../device/device-formatter.service';
import {map} from 'rxjs/operators';
import DeviceNameInfo from '../../../models/api/response/device-name-info';
import ReportResult from '../../../models/api/response/sub/report-result';
import ReportTimeSeries from '../../../models/charts/time-series/report-time-series.model';
import LiveInsightPointMetaData from '../../../models/charts/points/live-insight-point-meta-data';
import ReportLineStyle from '../../../models/charts/time-series/report-line-style';
import {ReportTimeSeriesType} from '../../../models/charts/time-series/report-time-series-type';
import ReportResponseSeries from '../../../models/api/response/sub/report-response-series';
import ReportResultSupplementalSeries from '../../../models/api/response/sub/report-result-supplemental-series';
import ReportTimeSeriesDataPoint from '../../../models/charts/time-series/report-time-series-data-point';
import {v4 as uuidv4} from 'uuid';
import {UnitFormatterService} from '../common/unit-formatter.service';
import SummaryDataElement from '../../../models/api/response/sub/summary/summary-data-element';
import ReportKey from '../../../models/api/response/sub/report-key';
import {ReportResultMetadataType} from '../../../models/api/response/enums/report-result-metadata-type';
import ReportResultGenericMetadata from '../../../models/api/response/sub/metadata/report-result-generic-metadata';
import ReportResultMetadata from '../../../models/api/response/sub/metadata/report-result-metadata';
import {ReportMetaData} from '../../../models/charts/metadata/report-meta-data';
import ReportResultNumericMetadata from '../../../models/api/response/sub/metadata/report-result-numeric-metadata';
import ReportResultInterfaceCapacityMetadata from '../../../models/api/response/sub/metadata/report-result-interface-capacity-metadata';
import ReportResultSiteMetadata from '../../../models/api/response/sub/metadata/report-result-site-metadata';
import ReportResultTimeMetadata from '../../../models/api/response/sub/metadata/report-result-time-metadata';
import ReportResultSecurityAnalysisMetadata from '../../../models/api/response/sub/metadata/report-result-security-analysis-metadata';
import {format} from 'date-fns';
import ConversionRate from '../../../../../../../../client/nxComponents/services/laUnitFormatter/ConversionRate';
import ReportResponse from '../../../models/api/response/report-response';
import SupplementalSeriesType from '../../../models/api/response/enums/supplemental-series-type';
import ReportResultDeviceMetadata from '../../../models/api/response/sub/metadata/report-result-device-metadata';
import {TimeHelpersService} from '../../../../../utils/time-helpers/time-helpers.service';


@Injectable({
  providedIn: 'root'
})
/**
 * Format report results returned from API into data structures that can be utilized by client components such as charts
 * and tables
 */
export class ReportResultFormatterService {

  constructor(protected deviceFormatterService: DeviceFormatterService,
              protected unitFormatterService: UnitFormatterService,
              private timeHelperService: TimeHelpersService) {
  }

  /**
   * Format a report result into an object that represents a time series chart.
   * This function will resolve data that requires lookup (such as device serial) into the appropriate display format
   * The difference between this function and the formatAsTimeSeries function is that the device serial store does not have to be populated.
   */
  public formatAsTimeSeries$(result: ReportResult): Observable<ReportTimeSeriesChartData> {
    const formattingObservables = {
      deviceSerialToName: this.deviceFormatterService.getDeviceNameInfoForSingleReport$(result)
    };

    return forkJoin(formattingObservables)
      .pipe(
        map(completedFormattingObservables => {
          return this.createTimeSeriesChartData(result, completedFormattingObservables);
        })
      );
  }

  /**
   * Format a report result into an object that represents a time series chart.
   * This function will resolve data that requires lookup (such as device serial) into the appropriate display format
   * IMPORTANT: Lookup's such as device serial require the deviceFormatterService to have been run externally prior to calling this function
   */
  public formatAsTimeSeries(result: ReportResult, reportGroupName?: string): ReportTimeSeriesChartData {
    return this.createTimeSeriesChartData(result);
  }

  /**
   * Get key/value pairs representing a single report results meta data
   */
  public getReportPresentableMetaData(result: ReportResult): Array<ReportMetaData> {
    const formattedMetadata = [];
    result.metadata?.forEach((metadata) => {
      switch (metadata.field) {
        case ReportResultMetadataType.GENERIC:
          const genericMetadata = <ReportResultMetadata<ReportResultGenericMetadata>>metadata;
          formattedMetadata.push(new ReportMetaData(genericMetadata.value.field, genericMetadata.value.value));
          break;
        case ReportResultMetadataType.NUMERIC:
          const numericMetadata = <ReportResultMetadata<ReportResultNumericMetadata>>metadata;
          const numericDisplayValue = this.createNumericDisplayValue(numericMetadata.value.value, numericMetadata.value.units);
          formattedMetadata.push(new ReportMetaData(numericMetadata.value.label, numericDisplayValue));
          break;
        case ReportResultMetadataType.INTERFACE_CAPACITY:
          const interfaceCapacityMetadata = <ReportResultMetadata<ReportResultInterfaceCapacityMetadata>>metadata;
          const units = interfaceCapacityMetadata.value.units;
          const inputCapacity = interfaceCapacityMetadata.value.inputCapacity;
          const outputCapacity = interfaceCapacityMetadata.value.outputCapacity;
          const inputCapacityDisplayValue = this.createNumericDisplayValue(inputCapacity, units, 'Not Configured');
          const outputCapacityDisplayValue = this.createNumericDisplayValue(outputCapacity, units, 'Not Configured');
          // API does not return a field name for input/output capacity.  We must hard code it
          formattedMetadata.push(new ReportMetaData('Input Capacity', inputCapacityDisplayValue));
          formattedMetadata.push(new ReportMetaData('Output Capacity', outputCapacityDisplayValue));
          break;
        case ReportResultMetadataType.SITE:
          const siteMetadata = <ReportResultMetadata<ReportResultSiteMetadata>>metadata;
          formattedMetadata.push(new ReportMetaData('Site', siteMetadata.value.name));
          break;
        case ReportResultMetadataType.MOMENT:
          const timeCapacityMetadata = <ReportResultMetadata<ReportResultTimeMetadata>>metadata;
          let formattedDate = '-';
          if (timeCapacityMetadata?.value?.epochMillis != null) {
            formattedDate = format(new Date(timeCapacityMetadata.value.epochMillis), this.timeHelperService.reportFormatString());
          }
          formattedMetadata.push(new ReportMetaData(timeCapacityMetadata.value.label, formattedDate));
          break;
        case ReportResultMetadataType.SECURITY_ANALYSIS:
          const securityAnalysisMetadata = <ReportResultMetadata<ReportResultSecurityAnalysisMetadata>>metadata;
          if (securityAnalysisMetadata.value.hasMoreData) {
            const displayString = 'Too many flows were found so the results are limited. ' +
              'Please adjust the filters to retrieve all results for the desired time range.';
            formattedMetadata.push(new ReportMetaData('Truncated Results', displayString));
          }
          break;
        case ReportResultMetadataType.DEVICE:
          const deviceMetadata = <ReportResultMetadata<ReportResultDeviceMetadata>>metadata;
          // TODO incorporate user preferences
          formattedMetadata.push(new ReportMetaData('Device', deviceMetadata.value.hostName));
          break;
        case ReportResultMetadataType.TIME_ZONE:
        // Fall through
        case ReportResultMetadataType.DASHBOARD:
        // Fall through
        default:
        // Do nothing
      }
    });

    return formattedMetadata;
  }

  /**
   * Determine if the report group has no data.
   * A group has no data if it has no top level results or if there are no chart level results since nothing can be shown in this case
   */
  public isNoDataResponse(result: ReportResponse): boolean {
    return result?.results === void 0 || result.results.length <= 0 ||
      result?.results[0].results === void 0 || result?.results[0].results.length <= 0;
  }

  /**
   * Determine if an individual report within report group has no data
   * A report is considered to have no data if there are no series, total series, additional series, or summary data (table).
   */
  public isNoDataResult(result: ReportResult): boolean {
    let hasData = false;
    hasData = hasData || result.timeSeries?.totalData !== void 0 && result.timeSeries.totalData.length > 0;
    hasData = hasData || result.timeSeries?.additionalData !== void 0 && result.timeSeries.additionalData.length > 0;
    hasData = hasData || result.timeSeries?.seriesData !== void 0 && result.timeSeries.seriesData.length > 0;
    hasData = hasData || result.summary?.summaryData !== void 0 && result.summary.summaryData.length > 0;
    return !hasData;
  }

  /**
   * Determine if the individual report has an error
   */
  public isErrorResult(result: ReportResult): boolean {
    return result.error !== void 0;
  }

  /**
   * Gets the error message for a result.  If there is no error, return an empty string.
   * The user message is always the best thing to show, if we cant show that try the standard message
   */
  public getErrorMessage(result: ReportResult): string {
    return result.error?.userMessage || result.error?.message || '';
  }

  /**
   * Given a number and units, format it appropriately to the highest like unit possible.
   * An example is that 2000 bytes will be formatted to 2 KB
   * @param numberToFormat - the number that needs to be formatted
   * @param units - the current unit that is represented by numberToFormat
   * @param noDataMessage - what to show when there is no data
   */
  protected createNumericDisplayValue(numberToFormat: number, units: string, noDataMessage?: string): string {
    if (numberToFormat === null || numberToFormat === void 0) {
      return noDataMessage;
    }
    const conversionDetails = this.unitFormatterService.determineConversionRate(units, numberToFormat);
    let displayValue = conversionDetails.getScaledValue(numberToFormat, 3).toString();
    if (conversionDetails.units) {
      displayValue += ' ' + conversionDetails.units;
    }
    return displayValue;
  }

  /**
   * Parse the flex search the value of a given key.  Will only return the first match.
   * @param key the flex search key to look for
   */
  protected parseFlexSearch(key: string, flexSearch: string): string {
    const keyIndex = flexSearch.indexOf(key);
    const startIndex = keyIndex + key.length;
    return flexSearch.substring(startIndex, flexSearch.length);
  }


  /**
   * Parse a report result and create report time series chart data
   */
  private createTimeSeriesChartData(result: ReportResult,
                              formattingObservables?: { deviceSerialToName: Array<DeviceNameInfo> }): ReportTimeSeriesChartData {

    const data: Array<ReportTimeSeries<any>> = [];
    data.push(...this.createStandardSeries(result.timeSeries.seriesData, result.reportKeys));
    data.push(this.createTotalSeries(result.timeSeries.totalData));
    data.push(...this.createAdditionalSeries(result.timeSeries.additionalData));

    const unit = result.timeSeries.field.units;
    const yAxisLabel = result.yAxisLabel;
    const xAxisLabel = '';

    const largestValue = Math.max(...data.map(series => series.findLargestValue()));
    const unitConverter = this.unitFormatterService.determineConversionRate(unit, largestValue);
    data.map(series => this.convertPoints(series, unitConverter));
    const yAxis = {label: yAxisLabel, units: unitConverter.units};
    const xAxis = {label: xAxisLabel, units: unitConverter.units};
    return new ReportTimeSeriesChartData({data: data, xAxis: xAxis, yAxis: yAxis});
  }

  /**
   * Transform all points for the series based on a conversion rate
   * @param unitConverter - the conversion rate that should be used
   */
  protected convertPoints(data: ReportTimeSeries<any>, unitConverter: ConversionRate) {
    data.points.forEach(point => {
      if (point.value !== null) {
        return point.value = unitConverter.getScaledValue(point.value);
      }
    });
  }

  /**
   * Create the standard series.  This type represents most points.  This is the standard case for most data
   * @param standardSeries - The array of points that represent the series.  Contains a key and array of data values.
   * @param reportKeys - The list of report keys that make this series unique
   */
  protected createStandardSeries(standardSeries: Array<ReportResponseSeries>, reportKeys: Array<ReportKey>): Array<ReportTimeSeries<any>> {
    const reportSeries = [];
    standardSeries?.forEach((seriesData, index) => {
      const seriesName = this.createNameFromKeys(seriesData.key);
      const points = this.createPoints(seriesData.data);
      if (points.length > 0) {
        reportSeries.push(new ReportTimeSeries<LiveInsightPointMetaData>(uuidv4(), seriesName,
          ReportTimeSeriesType.STANDARD, points, {lineStyle: ReportLineStyle.SOLID}));
      }
    });
    return reportSeries;
  }

  /**
   * Each result can have at most one total series.  The display name is not provided in the data so we hard code one.
   */
  protected createTotalSeries(totalData: Array<Array<string | number>>): ReportTimeSeries<any> {
    const points = this.createPoints(totalData);
    return new ReportTimeSeries<LiveInsightPointMetaData>(uuidv4(), 'Total',
      ReportTimeSeriesType.TOTAL, points, {lineStyle: ReportLineStyle.DASH});
  }

  /**
   * Additional series that need to be converted into points.
   * There are no names for each of these series so we define it ourselves.
   */
  protected createAdditionalSeries(additionalSeries: Array<ReportResultSupplementalSeries>):
    Array<ReportTimeSeries<LiveInsightPointMetaData>> {
    const reportSeries = [];
    additionalSeries?.forEach((seriesData, index) => {
      if (seriesData.type !== void 0) {
        switch (seriesData.type.toUpperCase()) {
          case SupplementalSeriesType.ANOMALIES.toString():
            let points = this.createPoints(seriesData.data, {isAnomaly: true});
            if (points.length > 0) {
              reportSeries.push(new ReportTimeSeries<LiveInsightPointMetaData>(uuidv4(), 'Anomaly',
                ReportTimeSeriesType.ANOMALY, points, {lineStyle: ReportLineStyle.SOLID}));
            }
            break;
          case SupplementalSeriesType.THRESHOLD.toString():
            points = this.createPoints(seriesData.data);
            if (points.length > 0) {
              reportSeries.push(new ReportTimeSeries<LiveInsightPointMetaData>(uuidv4(), 'Threshold',
                ReportTimeSeriesType.THRESHOLD, points,
                {lineStyle: ReportLineStyle.DASH, isFilterable: true}));
            }
            break;
        }
      }
    });
    return reportSeries;
  }

  /**
   * Create a point from an array of [iso time string, value]
   * @param metaData - Any meta data that should be injected into this point
   */
  protected createPoint(reportPointData: Array<string | number>, metaData?: LiveInsightPointMetaData): ReportTimeSeriesDataPoint<any> {
    return {
      time: new Date(reportPointData[0]).getTime(),
      value: <number>reportPointData[1],
      meta: metaData
    };
  }

  /**
   * Create points from an array of [iso time string, value]
   * @param metaData - Any meta data that should be injected into this point
   */
  protected createPoints(data: Array<Array<string | number>>, metaData?: LiveInsightPointMetaData): Array<ReportTimeSeriesDataPoint<any>> {
    const points = [];
    data?.forEach(pointData => {
      const point = this.createPoint(pointData, metaData);
      points.push(point);
    });
    return points;
  }

  /**
   * Creates a name from the report keys.  Should format all keys appropriately (e.g. device serials mapped to device name)
   * // TODO format values
   * which will give parity with the data
   */
  protected createNameFromKeys(keys: Array<SummaryDataElement>): string {
    let seriesName = '';
    keys?.forEach((key) => {
      if (seriesName.length > 0) {
        seriesName += '/';
      }
      seriesName += key.value;
    });
    return seriesName;
  }
}
