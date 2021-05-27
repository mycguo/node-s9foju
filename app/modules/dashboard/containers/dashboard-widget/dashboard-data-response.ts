import ReportResponse from '../../../reporting/models/api/response/report-response';
import ReportResultError from '../../../reporting/models/api/response/sub/report-result-error';
import {HttpErrorResponse} from '@angular/common/http';

export interface DashboardDataResponse {

  id: string;
  report: ReportResponse;
  isLoading: boolean;
  requestError: HttpErrorResponse;
}
