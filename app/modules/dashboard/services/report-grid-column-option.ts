import ReportResponseSummaryField from '../../reporting/models/api/response/sub/summary/report-response-summary-field';
import {ReportTableDataGeneratorOptionsColumn} from './report-table-config-generator/report-table-data-generator-options-column';
import GridColumn from '../../grid/models/grid-column.model';
import {ReportTableDataGeneratorOptions} from './report-table-config-generator/report-table-data-generator-options';

export abstract class ReportGridColumnOption<T extends ReportTableDataGeneratorOptions<ReportTableDataGeneratorOptionsColumn>> {
  abstract getGridColumnByInfoElementType(field: ReportResponseSummaryField): ReportTableDataGeneratorOptionsColumn;
  abstract buildColumn(prop: string, label: string, customGridColumnOption: ReportTableDataGeneratorOptionsColumn, options: T): GridColumn;
}
