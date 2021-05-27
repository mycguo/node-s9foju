import ReportTableDataRow from '../report-table-data-row';

export abstract class ReportTableDataStrategy {
  abstract modifyRow(flatRow: ReportTableDataRow): ReportTableDataRow;
}
