import IReportBody from '../../../../../../../../project_typings/api/reportTemplate/IReportBody';

export interface ReportsManagementResponse extends IReportBody {
  id: string;
  owner: string;
  resultUrl: string;
  scheduleConfig: unknown;
  visibility: string;
}
