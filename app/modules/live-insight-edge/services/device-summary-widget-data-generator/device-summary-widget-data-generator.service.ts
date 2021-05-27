import {Inject, Injectable, Optional, SkipSelf} from '@angular/core';
import {ReportTableDataGeneratorService} from '../../../dashboard/services/report-table-config-generator/report-table-data-generator.service';
import {VisualDataGenerator} from '../../../dashboard/containers/dashboard-widget/visual-data-generator';
import {DashboardWidgetTableConfig} from '../../../dashboard/components/dashboard-widget-table/dashboard-widget-table-config';
import ReportResponse from '../../../reporting/models/api/response/report-response';
import ReportResult from '../../../reporting/models/api/response/sub/report-result';
import {LinkCellRendererComponent} from '../../../grid/components/cell-renders/link-cell-renderer/link-cell-renderer.component';
import {GridTheme} from '../../../grid/components/grid/themes/grid-theme.enum';
import {PageInterlinkService} from '../../../../services/page-interlink/page-interlink.service';
import LaFilterSupportEnums from '../../../../../../../project_typings/enums/laFilterSupportEnums';
import {FlexFilterProvider, FlexFilterProviderToken} from '../../../../services/page-filter/flex-filter-provider.model';
import {FilterExpressionsService} from '../../../../services/filter-expressions/filter-expressions.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {RowDataGeneratorService} from '../row-data-generator/row-data-generator.service';
import {DeviceSummaryWidgetOptions} from './device-summary-widget-options';
import {ReportTableDeviceDataAdapterService} from '../../../dashboard/services/report-table-device-data-adapter/report-table-device-data-adapter.service';
import ReportTableDataDeviceRow from '../../../dashboard/services/report-table-config-generator/report-table-data-device-row';
import {ReportTableDataRowField} from '../../../dashboard/services/report-table-config-generator/report-table-data-row-field';
import {FilterExpression} from '../../../../services/page-filter/filter-expression.model';
import {ReportCustomGridColumn} from '../../../dashboard/services/report-custom-grid-column/report-custom-grid-column.service';
import GridColumn from '../../../grid/models/grid-column.model';

@Injectable({
  providedIn: 'any'
})
export class DeviceSummaryWidgetDataGeneratorService implements VisualDataGenerator
  <ReportResponse, DashboardWidgetTableConfig, Array<ReportResult>, Array<{ [key: string]: any }>, DeviceSummaryWidgetOptions> {

  static readonly DEVICE_SERIAL = 'device_serial';
  static readonly DEVICE_FIELD_NAME = 'device';

  parent: ReportTableDataGeneratorService<DeviceSummaryWidgetOptions>;

  constructor(
    private pageInterlinkService: PageInterlinkService,
    private filterExpressionsService: FilterExpressionsService,
    private rowDataGeneratorService: RowDataGeneratorService,
    private reportTableDeviceDataAdapter: ReportTableDeviceDataAdapterService,
    private customGridColumn: ReportCustomGridColumn,
    @Optional() @SkipSelf() @Inject(FlexFilterProviderToken) private filterStateProvider: FlexFilterProvider
  ) {
    this.parent = new ReportTableDataGeneratorService(customGridColumn);
  }

  buildConfig(buildFrom: ReportResponse): DashboardWidgetTableConfig {
    const tableConfig = this.parent.buildConfig(buildFrom);
    // update column cell renderers here
    const updatedColumns = tableConfig.columns.map((column: GridColumn, index) => {
      if (DeviceSummaryWidgetDataGeneratorService.DEVICE_SERIAL === column.prop) {
        // this renames the column from device_serial to device and uses metadata to populate
        column.prop = DeviceSummaryWidgetDataGeneratorService.DEVICE_FIELD_NAME;
        column.cellRenderComponent = LinkCellRendererComponent;
      }
      return column;
    });
    tableConfig.columns = updatedColumns;
    tableConfig.theme = GridTheme.LIGHTWEIGHT;
    return tableConfig;
  }

  transformData(data: Array<ReportResult>): Array<{ [key: string]: any }> {
    try {
      const rowData = this.parent.transformData(data, true);
      const resolveKeyTitle = (row: {[key: string]: any}) => {
        return this.reportTableDeviceDataAdapter.getDeviceLabel(this.parent.options.useSystemName,
          row as ReportTableDataDeviceRow);
      };
      return rowData.map((row) => {
        const filterFromSelf: Array<FilterExpression> = [{
          key: LaFilterSupportEnums.DEVICE,
          values: [row[ReportTableDataRowField.SYSTEM_NAME]]
        }];
        const updatedRow = this.rowDataGeneratorService.createFilterableLink(row,
          resolveKeyTitle,
          filterFromSelf);
        row[DeviceSummaryWidgetDataGeneratorService.DEVICE_FIELD_NAME] = updatedRow;
        return row;
      });
    } catch (err) {
      throw err;
    }
  }

  setOptions(options: DeviceSummaryWidgetOptions): void {
    this.parent.setOptions(options);
  }

  generateError(data: Array<ReportResult>): DetailedError {
    return this.parent.generateError(data);
  }
}
