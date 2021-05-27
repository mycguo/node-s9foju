import ReportResult from '../../../reporting/models/api/response/sub/report-result';
import ReportResponse from '../../../reporting/models/api/response/report-response';

export interface ReportWidgetData {
  id: string;
  /** This maps to the report key which should be in your report data store. */
  reportDataId: string;
  isLoading: boolean;
  reportData: Array<ReportResult>;
  reportResponse: ReportResponse;
}
