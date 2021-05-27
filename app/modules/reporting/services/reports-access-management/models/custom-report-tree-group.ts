import ReportId from '../../../models/api/response/sub/report-id';

export interface CustomReportTreeGroup {
  groupName: string;
  reportIds: Array<ReportId>;
}
