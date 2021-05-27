import {Injectable, Optional} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {ReportHistory} from './models/report-history.interface';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ReportHistoryValidation} from './models/report-history-validation.interface';
import {catchError, tap} from 'rxjs/operators';
import {applyTransaction, Query, Store} from '@datorama/akita';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {CommonService} from '../../../../utils/common/common.service';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class ReportHistoryService {
  static readonly DEFAULT_REPORT_HISTORY_SETTINGS: ReportHistory = {
    sharedDays: 30,
    scheduledDays: 365,
    adhocDays: 7
  };

  readonly reportHistoryEndpoint = '/api/nx/reports/results/store/config/retention';

  constructor(private http: HttpClient,
              private commonService: CommonService,
              private logger: Logger,
              @Optional() private readonly store: Store<ReportHistory>,
              @Optional() private readonly query: Query<ReportHistory>) {
    if (this.commonService.isNil(store)) {
      this.store = new Store<ReportHistory>({
          sharedDays: 50,
          scheduledDays: 50,
          adhocDays: 50
        },
        {name: 'report-history'});
    }
    if (this.commonService.isNil(query)) {
      this.query = new Query<ReportHistory>(this.store);
    }
  }

  selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  selectError(): Observable<DetailedError> {
    return this.query.selectError();
  }

  selectReportHistory(): Observable<ReportHistory> {
    return this.query.select();
  }

  getReportHistory(): Observable<ReportHistory> {
    this.store.setLoading(true);
    return this.http.get<ReportHistory>(this.reportHistoryEndpoint).pipe(
      tap((reportHistory: ReportHistory) => {
        applyTransaction(() => {
          this.store.setError(void 0);
          this.store.update(reportHistory);
          this.store.setLoading(false);
        });
      }),
      catchError(this._historyErrorHandler.bind(this))
    );
  }

  /**
   * Update report history and update store
   * @param reportHistory ReportHistory
   */
  updateReportHistory(reportHistory: ReportHistory): Observable<ReportHistory> {
    this.store.setLoading(true);
    return this.http.put<ReportHistory>(this.reportHistoryEndpoint, reportHistory).pipe(
      tap((updatedReportHistory: ReportHistory) => {
        applyTransaction(() => {
          this.store.setError(void 0);
          this.store.update(updatedReportHistory);
          this.store.setLoading(false);
        });
      }),
      catchError((err) => {
        // return error
        this.store.setLoading(false);
        return throwError(err);
      })
    );
  }

  /**
   * Gets Report History  validation
   */
  getReportHistoryValidation(): Observable<ReportHistoryValidation> {
    return this.http.get<ReportHistoryValidation>(`${this.reportHistoryEndpoint}/ranges`);
  }

  /**
   * Handles report-history errors
   * @param err HttpErrorResponse
   */
  private _historyErrorHandler(err: HttpErrorResponse): Observable<never> {
    applyTransaction(() => {
      this.store.setError(err);
      this.store.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(err);
  }
}
