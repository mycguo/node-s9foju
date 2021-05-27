import ReportRequestParameters from './report-request-parameters';

export default interface OidReportParameters extends ReportRequestParameters {
  deviceSerial: string;
  customOidConfig: string;
}
