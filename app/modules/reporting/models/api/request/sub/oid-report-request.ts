import {ReportRequest} from './report-request';
import OidReportParameters from './oid-report-parameters';

export interface OidReportRequest extends ReportRequest {
  parameters: OidReportParameters;
}
