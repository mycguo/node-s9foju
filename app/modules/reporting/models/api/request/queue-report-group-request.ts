import {ReportRequestTimeZone} from './sub/report-request-time-zone';
import {ReportSharingConfig} from './sub/report-sharing-config';
import {ReportRequestGlobalParameters} from './sub/report-request-global-parameters';
import {ReportPresentationMode} from './enums/report-presentation-mode';
import {ReportLogoParameter} from './sub/report-logo-parameter';
import {ReportClientTimeParameter} from './sub/report-client-time-parameter';
import {ReportRequest} from './sub/report-request';
import {ReportPriority} from './enums/report-priority';
import {ReportClassification} from './sub/report-classification';


export interface QueueReportGroupRequest {
  name: string;
  reports: Array<ReportRequest>;
  sharingConfig?: Array<ReportSharingConfig>;
  timeZone?: ReportRequestTimeZone;
  globalReportParameters?: ReportRequestGlobalParameters;
  reportFootNote?: string;
  presentationMode?: ReportPresentationMode;
  clientTimeParameters?: ReportClientTimeParameter;
  logo?: ReportLogoParameter;
  resultsUrl?: string;
  priority: ReportPriority;
  classification: ReportClassification;
}
