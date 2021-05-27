import ReportId from '../../../../reporting/models/api/response/sub/report-id';
import ReportRequestParameters from '../../../../reporting/models/api/request/sub/report-request-parameters';

export interface DeviceEntityPageReportResponse {
  reportId: ReportId;
  reportName: string;
  reportDescription?: string;
  parameters: ReportRequestParameters;
}
