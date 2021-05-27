import {ReportTableDataGeneratorOptions} from '../report-table-config-generator/report-table-data-generator-options';
import {FilteredReportTableGeneratorOptionColumn} from './filtered-report-table-generator-option-column';
import {ReportTableDataStrategy} from '../report-table-config-generator/data-strategies/report-table-data-strategy';

export interface FilteredReportTableDataGeneratorOptions<R = ReportTableDataStrategy>
  extends ReportTableDataGeneratorOptions<FilteredReportTableGeneratorOptionColumn, R> {
  hideGlobalSearch?: boolean;
  sortable?: boolean; // all sortable
  filterable?: boolean;
}
