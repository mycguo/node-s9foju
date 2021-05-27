import {ReportRequest} from './sub/report-request';
import {ReportSharingConfig} from './sub/report-sharing-config';
import {ReportRequestGlobalParameters} from './sub/report-request-global-parameters';
import {ReportPresentationMode} from './enums/report-presentation-mode';
import {ReportClientTimeParameter} from './sub/report-client-time-parameter';

export default interface QueueReportGroupResponseJobInfo {
  name: string;
  reports: Array<ReportRequest>;
  sharingConfig?: Array<ReportSharingConfig>;
  visibility: string;
  clientTimeParameters?: ReportClientTimeParameter;
  presentationMode?: ReportPresentationMode;
  time?: string;
  status?: string;
  result?: string;
  reportFootNote?: string;
  globalReportParameters?: ReportRequestGlobalParameters;
}
