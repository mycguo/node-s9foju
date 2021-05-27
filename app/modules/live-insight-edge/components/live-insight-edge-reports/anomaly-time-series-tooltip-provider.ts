import {TimeSeriesTooltipProvider} from '../../../shared/components/charts/time-series-chart/time-series-tooltip-provider';
import ReportTimeSeriesDataPoint from '../../../reporting/models/charts/time-series/report-time-series-data-point';
import {LiveInsightEdgeReportDrilldownService} from '../../services/live-insight-edge-report-drilldown/live-insight-edge-report-drilldown.service';
import {ReportInfoValue} from '../../../reporting/models/report-info';
import {LiveInsightAnomalyReportType} from '../../services/live-insight-edge-report-page/reports-services/live-insight-anomaly-report-type';
import ReportCategoryParameter from '../../../reporting/models/api/parameter-enums/report-category-parameter';
import {AnalyticsReportId} from '../../services/live-insight-edge-report-page/reports-services/analytics-report-id';
import {Point} from 'highcharts';
import ReportDrilldownParameters from '../../../reporting/models/api/request/sub/report-drilldown-parameters';

export default class AnomalyTimeSeriesTooltipProvider extends TimeSeriesTooltipProvider {
  constructor(
    private liveInsightEdgeReportDrilldownService: LiveInsightEdgeReportDrilldownService,
    public controllerKey: string,
  ) {
    super();
  }

  generateTooltipHtml(dataPoint: ReportTimeSeriesDataPoint<any>, chartPoint: Point, units: string): string {
    if (dataPoint?.meta?.isAnomaly != null && dataPoint?.meta?.isAnomaly) {
      return `
              <span class="nx-chart-widget-tooltip-point">
                <span class="nx-chart-widget-tooltip-point__icon" style="background-color:${chartPoint.color}"></span>
                <span class="nx-chart-widget-tooltip-point__text"> Anomaly: <b>${chartPoint.y} ${units}</b></span>
              </span>
              <br/>
              <span class="nx-chart-widget-tooltip-drill-down">
                  Details <a
                      class="nx-link la-fontello la-fontello_drill-down"
                      href="${dataPoint.drilldownUrl}" target="_blank"></a></span>
            `;
    }
    return null;
  }

  generateDrilldownLink(dataPoint: ReportTimeSeriesDataPoint<any>,
                        drilldownParameters: ReportDrilldownParameters,
                        reportInfoValue: ReportInfoValue): string | null {
    if (reportInfoValue == null) {
      return null;
    }
    let drilldownLink: string;
    const reportType = this.findReportType(reportInfoValue);
    switch (reportType) {
      case LiveInsightAnomalyReportType.INTERFACE_UTILIZATION:
        drilldownLink = this.generateLinkForInterfaceUtilization(dataPoint, drilldownParameters);
        break;
      case LiveInsightAnomalyReportType.APPLICATION_UTILIZATION:
        drilldownLink = this.generateLinkForApplicationUtilization(dataPoint, drilldownParameters);
        break;
      case LiveInsightAnomalyReportType.APPLICATION_PERFORMANCE:
        drilldownLink = this.generateLinkForApplicationPerformance(dataPoint, drilldownParameters);
        break;
      case LiveInsightAnomalyReportType.SNMP_CLASS_BANDWIDTH_ANOMALIES:
        drilldownLink = this.generateLinkForQosClassBandwidth(dataPoint, drilldownParameters);
        break;
      default:
        drilldownLink = null;
        break;
    }
    return drilldownLink;
  }

  generateLinkForInterfaceUtilization(dataPoint: ReportTimeSeriesDataPoint<any>,
                                      drilldownParameters: ReportDrilldownParameters): string {
    return this.liveInsightEdgeReportDrilldownService.buildInterfaceUtilizationDrilldownLink(
      drilldownParameters?.deviceSerial,
      drilldownParameters?.direction,
      drilldownParameters?.interface,
      dataPoint.time,
      drilldownParameters?.reportGroupName,
      this.controllerKey
    );
  }

  generateLinkForApplicationUtilization(dataPoint: ReportTimeSeriesDataPoint<any>,
                                      drilldownParameters: ReportDrilldownParameters): string {
    return this.liveInsightEdgeReportDrilldownService.buildApplicationUtilizationDrilldownLink(
      drilldownParameters?.deviceSerial,
      drilldownParameters?.direction,
      drilldownParameters?.flexSearch,
      dataPoint.time,
      drilldownParameters?.reportGroupName,
      this.controllerKey
    );
  }

  generateLinkForApplicationPerformance(dataPoint: ReportTimeSeriesDataPoint<any>,
                                        drilldownParameters: ReportDrilldownParameters): string {
    return this.liveInsightEdgeReportDrilldownService.buildApplicationPerformanceDrilldownLink(
      drilldownParameters?.deviceSerial,
      drilldownParameters?.direction,
      drilldownParameters?.flexSearch,
      dataPoint.time,
      drilldownParameters?.reportGroupName,
      this.controllerKey
    );
  }

  generateLinkForQosClassBandwidth(dataPoint: ReportTimeSeriesDataPoint<any>,
                                        drilldownParameters: ReportDrilldownParameters): string {
    return this.liveInsightEdgeReportDrilldownService.buildQosClassBandwidthDrilldownLink(
      drilldownParameters?.deviceSerial,
      drilldownParameters?.interface,
      drilldownParameters?.direction,
      dataPoint.time,
      drilldownParameters?.reportGroupName,
      this.controllerKey
    );
  }

  cleanUpLinks() {
    this.liveInsightEdgeReportDrilldownService.clearControllerLinks(this.controllerKey);
  }

  findReportType(reportInfoValue: ReportInfoValue): LiveInsightAnomalyReportType {
    // currently only handling report category of analytics
    if (ReportCategoryParameter.ANALYTICS !== reportInfoValue.reportCategory) {
      return null;
    }
    let liveInsightReportType: LiveInsightAnomalyReportType;
    switch (reportInfoValue.id) {
      case AnalyticsReportId.APPLICATION_PERFORMANCE:
        liveInsightReportType = LiveInsightAnomalyReportType.APPLICATION_PERFORMANCE;
        break;
      case AnalyticsReportId.APPLICATION_UTILIZATION:
        liveInsightReportType = LiveInsightAnomalyReportType.APPLICATION_UTILIZATION;
        break;
      case AnalyticsReportId.INTERFACE_UTILIZATION:
        liveInsightReportType = LiveInsightAnomalyReportType.INTERFACE_UTILIZATION;
        break;
      case AnalyticsReportId.SNMP_CLASS_BANDWIDTH_ANOMALIES:
        liveInsightReportType = LiveInsightAnomalyReportType.SNMP_CLASS_BANDWIDTH_ANOMALIES;
        break;
      default:
        liveInsightReportType = LiveInsightAnomalyReportType.UNKNOWN;
        break;
    }
    return liveInsightReportType;
  }
}
