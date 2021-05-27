import {ReportTableDataRowField} from './report-table-data-row-field';

export interface ReportTableDataApplicationRow {
  [ReportTableDataRowField.APPLICATION_NAME]: string;
  [ReportTableDataRowField.APP_GROUP]: string;
}
