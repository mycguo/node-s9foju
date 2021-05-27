import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {DashboardWidgetTableComponent} from '../../../dashboard/components/dashboard-widget-table/dashboard-widget-table.component';
import {DeviceSummaryWidgetDataGeneratorService} from '../../services/device-summary-widget-data-generator/device-summary-widget-data-generator.service';
import {ReportTableDataGeneratorOptions} from '../../../dashboard/services/report-table-config-generator/report-table-data-generator-options';
import {ApplicationsSummaryWidgetDataGeneratorService} from '../../services/applications-summary-widget-data-generator/applications-summary-widget-data-generator.service';
import {SiteSummaryWidgetDataGeneratorService} from '../../services/site-summary-widget-data-generator/site-summary-widget-data-generator.service';
import {DashboardWidgetConfig} from '../../../dashboard/components/dashboard-widget/dashboard-widget-config';
import {LiveInsightEdgeSummaryReportIds} from '../../services/live-insight-edge-summary-page/live-insight-edge-summary-report-ids.enum';
import {InsightsSummaryWidgetDataGeneratorService} from '../../services/insights-summary-widget-data-generator/insights-summary-widget-data-generator.service';
import {DashboardWidgetStackedBarComponent} from '../../../dashboard/components/dashboard-widget-stacked-bar/dashboard-widget-stacked-bar.component';
import {ReportStackedBarDataGeneratorService} from '../../../dashboard/services/report-stacked-bar-data-generator/report-stacked-bar-data-generator.service';
import {DashboardWidgetMapComponent} from '../../../dashboard/components/dashboard-widget-map/dashboard-widget-map.component';
import {LiveInsightEdgeSiteMapDataGeneratorService} from '../../services/live-insight-edge-site-map-data-generator/live-insight-edge-site-map-data-generator.service';
import {LaNoDataMessage} from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';
import {LiveInsightEdgeSummaryViewPreferences} from './live-insight-edge-summary-view-preferences';
import {DeviceSummaryWidgetOptions} from '../../services/device-summary-widget-data-generator/device-summary-widget-options';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {ReportTableDataGeneratorOptionsColumn} from '../../../dashboard/services/report-table-config-generator/report-table-data-generator-options-column';
import LaFilterSupportEnums from '../../../../../../../project_typings/enums/laFilterSupportEnums';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {LiveInsightEdgeFilterForm} from '../../services/live-insight-edge-filter/live-insight-edge-filter-form';

@UntilDestroy()
@Component({
  selector: 'nx-live-insight-edge-summary',
  templateUrl: './live-insight-edge-summary.component.html',
  styleUrls: ['./live-insight-edge-summary.component.less']
})
export class LiveInsightEdgeSummaryComponent implements OnInit, OnChanges, OnDestroy {

  static readonly FLEX_SEARCH_KEY = 'flexSearch';

  @Input() widgetTimeLabel: string;
  @Input() liveNaConnectionError: DetailedError;
  @Input() isLiveNaConnectionChecked = false;
  @Input() liveNaErrorModel: LaNoDataMessage;
  @Input() viewPreferences: LiveInsightEdgeSummaryViewPreferences;

  @Output() filterUpdate = new EventEmitter<LiveInsightEdgeFilterForm>();

  widgetConfigMap: {[key: string]: DashboardWidgetConfig};
  filterOptions: LaFilterSupportEnums[];
  filterFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.filterFormGroup = this.fb.group({
      [LiveInsightEdgeSummaryComponent.FLEX_SEARCH_KEY]: {}
    });

    this.filterFormGroup.valueChanges
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((formValue: LiveInsightEdgeFilterForm) => {
        this.filterUpdate.emit(formValue);
      });
  }

  ngOnInit(): void {
    this.widgetConfigMap = this.generateWidgetConfigMap();
    if (this.viewPreferences != null) {
      this.widgetConfigMap.devices.visualGeneratorOptions.useSystemName = this.viewPreferences.useDeviceSystemName;
    }
    this.filterOptions = [
      LaFilterSupportEnums.SITE,
      LaFilterSupportEnums.DEVICE,
      LaFilterSupportEnums.TAG,
      LaFilterSupportEnums.REGION,
      LaFilterSupportEnums.APPLICATION,
      LaFilterSupportEnums.APPLICATION_GROUP,
      LaFilterSupportEnums.INTERFACE,
      LaFilterSupportEnums.SP,
      LaFilterSupportEnums.QOS_CLASS
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.viewPreferences?.currentValue != null && this.widgetConfigMap?.devices != null) {
      this.widgetConfigMap.devices.visualGeneratorOptions = <DeviceSummaryWidgetOptions> {
        ...this.widgetConfigMap.devices.visualGeneratorOptions,
        useSystemName: this.viewPreferences.useDeviceSystemName
      };

      this.widgetConfigMap.insights.visualGeneratorOptions = <DeviceSummaryWidgetOptions> {
        ...this.widgetConfigMap.insights.visualGeneratorOptions,
        useSystemName: this.viewPreferences.useDeviceSystemName
      };

    }
  }



  private generateWidgetConfigMap(): {[key: string]: DashboardWidgetConfig} {
    return {
      devices: <DashboardWidgetConfig> {
        id: 'livena-summary-device',
        dataKey: LiveInsightEdgeSummaryReportIds.deviceSummary,
        headerTitle: 'Devices',
        headerSubtitle: 'by Anomalies',
        timeLabel: this.widgetTimeLabel,
        visualComponent: DashboardWidgetTableComponent,
        visualDataGenerator: DeviceSummaryWidgetDataGeneratorService,
        visualGeneratorOptions: <DeviceSummaryWidgetOptions>
          {
            useSystemName: false,
            columns: {
              'anomaly_count': { rightAligned: true }
            }
          }
      },
      applications: <DashboardWidgetConfig> {
        id: 'livena-summary-application',
        dataKey: LiveInsightEdgeSummaryReportIds.applicationSummary,
        headerTitle: 'Applications',
        headerSubtitle: 'by Anomalies',
        timeLabel: this.widgetTimeLabel,
        visualComponent: DashboardWidgetTableComponent,
        visualDataGenerator: ApplicationsSummaryWidgetDataGeneratorService,
        visualGeneratorOptions: <ReportTableDataGeneratorOptions<ReportTableDataGeneratorOptionsColumn>> {
          columns: {
            'anomaly_count': {
              rightAligned: true
            }
          }
        }
      },
      sites: <DashboardWidgetConfig> {
        id: 'livena-summary-site',
        dataKey: LiveInsightEdgeSummaryReportIds.siteSummary,
        headerTitle: 'Sites',
        headerSubtitle: 'by Anomalies',
        timeLabel: this.widgetTimeLabel,
        visualComponent: DashboardWidgetTableComponent,
        visualDataGenerator: SiteSummaryWidgetDataGeneratorService,
        visualGeneratorOptions: <ReportTableDataGeneratorOptions<ReportTableDataGeneratorOptionsColumn>> {
          columns: {
            'anomaly_count': {
              rightAligned: true
            }
          }
        }
      },
      sitesTimeSeries: <DashboardWidgetConfig> {
        id: 'livena-summary-site-time-series',
        dataKey: LiveInsightEdgeSummaryReportIds.siteTimeSeriesSummary,
        headerTitle: 'Total Sites Anomalies Over Time',
        headerSubtitle: null,
        timeLabel: this.widgetTimeLabel,
        visualComponent: DashboardWidgetTableComponent,
        visualDataGenerator: SiteSummaryWidgetDataGeneratorService,
        visualGeneratorOptions: <ReportTableDataGeneratorOptions<ReportTableDataGeneratorOptionsColumn>> {
          columns: {
            'anomaly_count': {
              rightAligned: true
            }
          }
        }
      },
      insights: <DashboardWidgetConfig> {
        id: 'livena-summary-insight-application',
        dataKey: LiveInsightEdgeSummaryReportIds.insightApplicationSummary,
        headerTitle: 'Insights',
        headerSubtitle: 'by Recent Detection',
        timeLabel: this.widgetTimeLabel,
        visualComponent: DashboardWidgetTableComponent,
        visualDataGenerator: InsightsSummaryWidgetDataGeneratorService,
        visualGeneratorOptions: <ReportTableDataGeneratorOptions<ReportTableDataGeneratorOptionsColumn>> {
          columns: {
            'anomaly_count': {
              rightAligned: true
            }
          }
        },
      },
      siteTimeSeries: <DashboardWidgetConfig> {
        id: 'livena-summary-site-time-series',
        dataKey: LiveInsightEdgeSummaryReportIds.siteTimeSeriesSummary,
        headerTitle: 'Total Sites Anomalies Over Time',
        headerSubtitle: null,
        timeLabel: this.widgetTimeLabel,
        visualComponent: DashboardWidgetStackedBarComponent,
        visualDataGenerator: ReportStackedBarDataGeneratorService,
        visualGeneratorOptions: null,
      },
      siteMap: <DashboardWidgetConfig> {
        id: 'livena-summary-site-map',
        dataKey: LiveInsightEdgeSummaryReportIds.siteSummary,
        headerTitle: 'Sites',
        headerSubtitle: 'by Recent Detection',
        timeLabel: this.widgetTimeLabel,
        visualComponent: DashboardWidgetMapComponent,
        visualDataGenerator: LiveInsightEdgeSiteMapDataGeneratorService,
      },
    };
  }

  get staticFlexSearchKey(): string {
    return LiveInsightEdgeSummaryComponent.FLEX_SEARCH_KEY;
  }

  ngOnDestroy(): void {
  }

}
