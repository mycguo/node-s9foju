import ReportResultAdditionalError from './report-result-additional-error';

export default interface ReportResultError {
  statusCode: number;
  message: string;
  userMessage: string;
  href: string;
  additionalErrors: Array<ReportResultAdditionalError>;
}
