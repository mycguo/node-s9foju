import {Observable} from 'rxjs';
import ReportResponse from '../../../reporting/models/api/response/report-response';
import {VisualDataGenerator} from './visual-data-generator';
import {DashboardDataRequest} from './dashboard-data-request';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {QueueReportGroupRequest} from '../../../reporting/models/api/request/queue-report-group-request';

abstract class WidgetDataProvider <T = ReportResponse, R = QueueReportGroupRequest, D = any, B = any, C = any, O = any> {
  data: Observable<T>;

  abstract requestData(requests: Array<DashboardDataRequest<R>>): Observable<Array<T>>;
  abstract getData(requestKey: string, dataGenerator?: VisualDataGenerator<B, C, T, D, O>): Observable<D>;
  abstract getVisualConfig(requestKey: string, dataGenerator?: VisualDataGenerator<B, C, T, D, O>): Observable<C>;
  abstract getIsLoading(requestKey: string): Observable<boolean>;
  abstract getError(requestKey: string, dataGenerator?: VisualDataGenerator<B, C, T, D, O>): Observable<DetailedError>;
  abstract clearReport(requestKey: string): void;
}

export default WidgetDataProvider;
