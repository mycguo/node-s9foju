import {Injectable} from '@angular/core';
import {ReportTableDataGeneratorService} from '../report-table-config-generator/report-table-data-generator.service';
import {VisualDataGenerator} from '../../containers/dashboard-widget/visual-data-generator';
import ReportResponse from '../../../reporting/models/api/response/report-response';
import ReportResult from '../../../reporting/models/api/response/sub/report-result';
import {FilteredReportTableGeneratorOptionColumn} from './filtered-report-table-generator-option-column';
import {GridColumnFilterConfig} from '../../../grid/models/grid-column-filter-config';
import FilterChange from '../../../grid/components/filters/filter-change';
import {TextFilterParams} from '../../../grid/components/filters/text-filter/text-filter-params';
import {FilteredReportTableDataGeneratorOptions} from './filtered-report-table-data-generator-options';
import {GridColumnFiltersService} from '../../../grid/services/grid-column-filters/grid-column-filters.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {CommonService} from '../../../../utils/common/common.service';
import {DashboardWidgetFilteredTableConfig} from '../../components/dashboard-widget-filtered-table/dashboard-widget-filtered-table-config';
import {FilteredReportCustomGridColumnService} from '../filtered-report-custom-grid-column/filtered-report-custom-grid-column.service';
import {ReportCustomGridColumn} from '../report-custom-grid-column/report-custom-grid-column.service';
import {GridSelectService} from '../../../grid/services/grid-select/grid-select.service';
import {StatusSortService} from '../../../grid/services/status-sort/status-sort.service';

@Injectable({
  providedIn: 'root'
})
export class FilteredReportTableConfigGeneratorService
  implements VisualDataGenerator<
    ReportResponse,
    DashboardWidgetFilteredTableConfig,
    Array<ReportResult>,
    Array<{ [key: string]: string }>,
    FilteredReportTableGeneratorOptionColumn> {
  options: FilteredReportTableDataGeneratorOptions;
  parent: ReportTableDataGeneratorService;

  private filteredReportCustomGridColumnService: FilteredReportCustomGridColumnService;

  constructor(private commonService: CommonService,
              private gridColumnFiltersService: GridColumnFiltersService,
              customGridColumn: ReportCustomGridColumn,
              gridSelectService: GridSelectService,
              statusSortService: StatusSortService
  ) {
    this.filteredReportCustomGridColumnService = new FilteredReportCustomGridColumnService(
      customGridColumn,
      gridColumnFiltersService,
      gridSelectService,
      statusSortService);
    this.parent = new ReportTableDataGeneratorService(this.filteredReportCustomGridColumnService);
  }

  setOptions(options: FilteredReportTableDataGeneratorOptions): void {
    this.options = options;
    this.parent.setOptions(options);
  }

  buildConfig(buildFrom: ReportResponse): DashboardWidgetFilteredTableConfig {
    this.filteredReportCustomGridColumnService.resetGlobalFilterableColumns();
    const tableConfig: DashboardWidgetFilteredTableConfig = this.parent.buildConfig(buildFrom);
    tableConfig.filterableColumns = this.filteredReportCustomGridColumnService.getGlobalFilterableColumns();
    tableConfig.hideGlobalSearch = this.options?.hideGlobalSearch;
    return tableConfig;
  }

  transformData(data: Array<ReportResult>): Array<{ [key: string]: string }> {
    return this.parent.transformData(data);
  }

  buildTextColumnFilter(field: string, filterValue: string): GridColumnFilterConfig<FilterChange, TextFilterParams> {
    return this.gridColumnFiltersService.buildTextColumnFilter(field,
      {filterValue: filterValue});
  }

  generateError(data: Array<ReportResult>): DetailedError {
    return this.parent.generateError(data);
  }
}
