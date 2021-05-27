import {Inject, Injectable, Optional, SkipSelf} from '@angular/core';
import {VisualDataGenerator} from '../../../dashboard/containers/dashboard-widget/visual-data-generator';
import {ReportTableDataGeneratorService} from '../../../dashboard/services/report-table-config-generator/report-table-data-generator.service';
import {CommonService} from '../../../../utils/common/common.service';
import {PageInterlinkService} from '../../../../services/page-interlink/page-interlink.service';
import {FlexFilterProvider, FlexFilterProviderToken} from '../../../../services/page-filter/flex-filter-provider.model';
import LaFilterSupportEnums from '../../../../../../../project_typings/enums/laFilterSupportEnums';
import ReportResult from '../../../reporting/models/api/response/sub/report-result';
import ReportResponse from '../../../reporting/models/api/response/report-response';
import {DashboardWidgetTableConfig} from '../../../dashboard/components/dashboard-widget-table/dashboard-widget-table-config';
import {LinkCellRendererComponent} from '../../../grid/components/cell-renders/link-cell-renderer/link-cell-renderer.component';
import {GridTheme} from '../../../grid/components/grid/themes/grid-theme.enum';
import GridColumn from '../../../grid/models/grid-column.model';
import {DatetimeCellRendererComponent} from '../../../grid/components/cell-renders/datetime-cell-renderer/datetime-cell-renderer.component';
import * as moment from 'moment-timezone';
import {FilterExpressionsService} from '../../../../services/filter-expressions/filter-expressions.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {InsightType} from './insight-type';
import {ReportResultMetadataType} from '../../../reporting/models/api/response/enums/report-result-metadata-type';
import ReportResultInsightKeyMetadata from '../../../reporting/models/api/response/sub/metadata/report-result-insight-key-metadata';
import ReportTableDataRow from '../../../dashboard/services/report-table-config-generator/report-table-data-row';
import {InsightSummaryWidgetOptions} from './insight-summary-widget-options';
import {LinkCellValue} from '../../../grid/components/cell-renders/link-cell-renderer/link-cell-value';
import {ReportTableDeviceDataAdapterService} from '../../../dashboard/services/report-table-device-data-adapter/report-table-device-data-adapter.service';
import ReportTableDataDeviceRow from '../../../dashboard/services/report-table-config-generator/report-table-data-device-row';
import {ReportTableDataRowField} from '../../../dashboard/services/report-table-config-generator/report-table-data-row-field';
import {FilterExpression} from '../../../../services/page-filter/filter-expression.model';
import {RowDataGeneratorService} from '../row-data-generator/row-data-generator.service';
import {ReportTableDataApplicationRow} from '../../../dashboard/services/report-table-config-generator/report-table-data-application-row';
import {ReportCustomGridColumn} from '../../../dashboard/services/report-custom-grid-column/report-custom-grid-column.service';

@Injectable({
  providedIn: 'any'
})
export class InsightsSummaryWidgetDataGeneratorService implements VisualDataGenerator
  <ReportResponse, DashboardWidgetTableConfig, Array<ReportResult>, Array<ReportTableDataRow>, InsightSummaryWidgetOptions> {

  parent: ReportTableDataGeneratorService<InsightSummaryWidgetOptions>;

  constructor(
    private commonService: CommonService,
    private pageInterlinkService: PageInterlinkService,
    private filterExpressionsService: FilterExpressionsService,
    private reportTableDeviceDataAdapter: ReportTableDeviceDataAdapterService,
    private reportDataGenerator: RowDataGeneratorService,
    private customGridColumn: ReportCustomGridColumn,
    @Optional() @SkipSelf() @Inject(FlexFilterProviderToken) private filterStateProvider: FlexFilterProvider
  ) {
    this.parent = new ReportTableDataGeneratorService(customGridColumn);
  }

  buildConfig(buildFrom: ReportResponse): DashboardWidgetTableConfig {
    const tableConfig = this.parent.buildConfig(buildFrom);
    const updatedColumns = [
      new GridColumn({ name: 'Insights', prop: 'insight_name', cellRenderComponent: LinkCellRendererComponent}),
    ];
    // update column cell renderers here
    for (const column of tableConfig.columns as Array<GridColumn>) {
      if ('max_timestamp' === column.prop) {
        const timeZone = moment.tz(moment.tz.guess()).format('z') ?? null;
        column.maxWidth = 140;
        column.name = this.commonService.isNil(timeZone) ?
          'Last Detection' :
          `Last Detection (${timeZone})`;
        column.cellRenderComponent = DatetimeCellRendererComponent;
        updatedColumns.push(column);
      }
      if ('anomaly_count' === column.prop) {
        column.maxWidth = 110;
        updatedColumns.push(column);
      }
    }
    tableConfig.columns = updatedColumns;
    tableConfig.theme = GridTheme.LIGHTWEIGHT;
    tableConfig.noRowsDivider = true;
    return tableConfig;
  }

  setOptions(options: InsightSummaryWidgetOptions): void {
    this.parent.setOptions(options);
  }

  transformData(data: Array<ReportResult>): Array<ReportTableDataRow> {
    try {
      const rowData = this.parent.transformData(data, true);
      return rowData.map((row) => {
        row.insight_name = this.buildInsightLink(row);
        return row;
      });
    } catch (err) {
      throw err;
    }
  }

  buildInsightLink(row: ReportTableDataRow): LinkCellValue {
    const insightType = this.getInsightType(row);

    let linkCell: LinkCellValue = {
      text: 'Unknown',
      link: null
    };

    switch (insightType) {
      case InsightType.APPLICATION:
        linkCell = this.reportDataGenerator.createFilterableLink(
          row,
          this.buildApplicationLinkText.bind(this),
          this.buildApplicationFiltersFromSelf(row)
        );
        break;

      case InsightType.BANDWIDTH_SERVICE_PROVIDER:
        linkCell = this.reportDataGenerator.createFilterableLink(
          row,
          this.buildBandwidthServiceProviderLinkText.bind(this),
          this.buildBandwidthServiceProviderFiltersFromSelf(row)
        );
        break;

      case InsightType.BANDWIDTH_INTERFACE:
        linkCell = this.reportDataGenerator.createFilterableLink(
          row,
          this.buildBandwidthInterfaceLinkText.bind(this),
          this.buildBandwidthInterfaceLinkFilterFromSelf(row)
        );
        break;

      case InsightType.QOS_CLASS_SERVICE_PROVIDER:
        linkCell = this.reportDataGenerator.createFilterableLink(
          row,
          this.buildQosClassServiceProviderLinkText.bind(this),
          this.buildQosClassServiceProviderFiltersFromSelf(row)
        );
        break;

      case InsightType.QOS_CLASS_INTERFACE:
        linkCell = this.reportDataGenerator.createFilterableLink(
          row,
          this.buildQosClassInterfaceLinkText.bind(this),
          this.buildQosClassInterfaceLinkFilterFromSelf(row)
        );
        break;
      default:
        break;
    }

    return linkCell;
  }

  buildApplicationLinkText(row: ReportTableDataRow): string {
    const applicationLabel = this.reportTableDeviceDataAdapter.buildApplicationLabel(
      row as ReportTableDataApplicationRow);
    return `Application ${applicationLabel} showing anomalies at ` +
        `${row[ReportTableDataRowField.SITE_NAME]}`;
  }

  buildApplicationFiltersFromSelf(row: ReportTableDataRow): Array<FilterExpression> {
    return [
      { key: LaFilterSupportEnums.SITE,
        values: [row[ReportTableDataRowField.SITE_NAME]] },
      { key: LaFilterSupportEnums.APPLICATION,
        values: [row[ReportTableDataRowField.APPLICATION_NAME]] }
    ];
  }

  buildBandwidthServiceProviderLinkText(row: ReportTableDataRow): string {
    const serviceProvider = row?.[ReportTableDataRowField.SERVICE_PROVIDER] ?? 'unknown';
    const site = row?.[ReportTableDataRowField.SITE_NAME] ?? 'unknown';
    return `The ${serviceProvider} interface is showing anomalies at the site ${site}`;
  }

  buildBandwidthServiceProviderFiltersFromSelf(row: ReportTableDataRow): Array<FilterExpression> {
    return [
      {
        key: LaFilterSupportEnums.SITE,
        values: [row[ReportTableDataRowField.SITE_NAME]]
      },
      {
        key: LaFilterSupportEnums.SP,
        values: [row[ReportTableDataRowField.SERVICE_PROVIDER]]
      }
    ];
  }


  buildBandwidthInterfaceLinkText(row: ReportTableDataRow): string {
    const deviceRow = ReportTableDataDeviceRow.fromReportTableDataRow(row);
    const deviceText = this.reportTableDeviceDataAdapter.getDeviceLabel(
      this.parent.options?.useSystemName ?? false,
        deviceRow);
    const interfaceText = row?.[ReportTableDataRowField.INTERFACE_NAME] ?? 'unknown';
    const site = row?.[ReportTableDataRowField.SITE_NAME] ?? 'unknown';
    return `The ${deviceText} \u2192 ${interfaceText} interface is showing anomalies at the site ${site}`;
  }

  buildBandwidthInterfaceLinkFilterFromSelf(row: ReportTableDataRow): Array<FilterExpression> {
    return [
      {
        key: LaFilterSupportEnums.SITE,
        values: [row[ReportTableDataRowField.SITE_NAME]]
      },
      {
        key: LaFilterSupportEnums.INTERFACE,
        values: [row[ReportTableDataRowField.INTERFACE_NAME]]
      },
      {
        key: LaFilterSupportEnums.DEVICE,
        values: [row[ReportTableDataRowField.SYSTEM_NAME]]
      },
    ];
  }

  buildQosClassServiceProviderLinkText(row: ReportTableDataRow): string {
    const serviceProvider = row?.[ReportTableDataRowField.SERVICE_PROVIDER] ?? 'unknown';
    const site = row?.[ReportTableDataRowField.SITE_NAME] ?? 'unknown';
    const qosClass = row?.[ReportTableDataRowField.QOS_CLASS] ?? 'unknown';
    return `The ${qosClass} class on the ${serviceProvider} interface is showing anomalies at the site ${site}`;
  }

  buildQosClassServiceProviderFiltersFromSelf(row: ReportTableDataRow): Array<FilterExpression> {
    return [
      {
        key: LaFilterSupportEnums.SITE,
        values: [row[ReportTableDataRowField.SITE_NAME]]
      },
      {
        key: LaFilterSupportEnums.SP,
        values: [row[ReportTableDataRowField.SERVICE_PROVIDER]]
      },
      {
        key: LaFilterSupportEnums.QOS_CLASS,
        values: [row[ReportTableDataRowField.QOS_CLASS]]
      }

    ];
  }

  buildQosClassInterfaceLinkText(row: ReportTableDataRow): string {
    const deviceRow = ReportTableDataDeviceRow.fromReportTableDataRow(row);
    const deviceText = this.reportTableDeviceDataAdapter.getDeviceLabel(
      this.parent.options?.useSystemName ?? false,
      deviceRow);
    const interfaceText = row?.[ReportTableDataRowField.INTERFACE_NAME] ?? 'unknown';
    const site = row?.[ReportTableDataRowField.SITE_NAME] ?? 'unknown';
    const qosClass = row?.[ReportTableDataRowField.QOS_CLASS] ?? 'unknown';
    return `The ${qosClass} class on ${deviceText} \u2192 ${interfaceText} interface is showing anomalies at the site ${site}`;
  }

  buildQosClassInterfaceLinkFilterFromSelf(row: ReportTableDataRow): Array<FilterExpression> {
    return [
      {
        key: LaFilterSupportEnums.SITE,
        values: [row[ReportTableDataRowField.SITE_NAME]]
      },
      {
        key: LaFilterSupportEnums.INTERFACE,
        values: [row[ReportTableDataRowField.INTERFACE_NAME]]
      },
      {
        key: LaFilterSupportEnums.DEVICE,
        values: [row[ReportTableDataRowField.SYSTEM_NAME]]
      },
      {
        key: LaFilterSupportEnums.QOS_CLASS,
        values: [row[ReportTableDataRowField.QOS_CLASS]]
      },
    ];
  }

  getInsightType(row: ReportTableDataRow): InsightType {
    const metadata = row?.metaData;
    if (metadata == null) {
      return InsightType.UNKNOWN;
    }
    for (const meta of metadata) {
      if (meta.field === ReportResultMetadataType.INSIGHT_KEY) {
        const value = meta.value as ReportResultInsightKeyMetadata;
        return value.key;
      }
    }
    return InsightType.UNKNOWN;
  }

  generateError(data: Array<ReportResult>): DetailedError {
    return this.parent.generateError(data);
  }
}
