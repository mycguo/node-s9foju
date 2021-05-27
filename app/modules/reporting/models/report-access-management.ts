import RestrictedReportResponse from './restricted-report-response';

export default interface RestrictedReport extends RestrictedReportResponse {
  _id: string; // generated report id (guid())
}

