import {Injectable, Optional} from '@angular/core';
import {forkJoin, Observable, throwError} from 'rxjs';
import {WebUiAlert} from './models/web-ui-alert';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, finalize, map, tap} from 'rxjs/operators';
import {applyTransaction, EntityStore, QueryEntity} from '@datorama/akita';
import {WebUiAlertsState} from './models/web-ui-alert-state';
import {CommonService} from '../../../../utils/common/common.service';
import {Logger} from '../../../logger/logger';

/**
 * This should eventually not be needed
 * https://liveaction.atlassian.net/browse/LD-26099
 */
@Injectable({
  providedIn: 'root'
})
export class WebUiAlertsService {
  static readonly WEB_UI_NOTIFICATIONS_URL = '/api/la-alert-webui-notification-settings';
  static readonly INITIAL_STATE = {};
  static readonly STORE_NAME = 'web-ui-alerts';

  constructor(private http: HttpClient,
              private logger: Logger,
              private commonService: CommonService,
              @Optional() private readonly store: EntityStore<WebUiAlertsState>,
              @Optional() private readonly query: QueryEntity<WebUiAlertsState>) {
    if (commonService.isNil(store)) {
      this.store = new EntityStore(WebUiAlertsService.INITIAL_STATE, {
        name: WebUiAlertsService.STORE_NAME,
        idKey: '_id',
        resettable: true
      });
    }

    if (commonService.isNil(query)) {
      this.query = new QueryEntity<WebUiAlertsState>(this.store);
    }
  }

  reset(): void {
    this.store.reset();
  }

  selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  selectError(): Observable<Error> {
    return this.query.selectError();
  }

  selectWebUiAlerts(): Observable<Array<WebUiAlert>> {
    return this.query.selectAll();
  }

  getWebUiAlerts(): Observable<Array<WebUiAlert>> {
    applyTransaction(() => {
      this.store.setError(void 0);
      this.store.setLoading(true);
    });
    return this.http.get<Array<WebUiAlert>>(WebUiAlertsService.WEB_UI_NOTIFICATIONS_URL)
      .pipe(
        tap((webUiAlerts: Array<WebUiAlert>) => {
          applyTransaction(() => {
            this.store.set(webUiAlerts);
            this.store.setLoading(false);
          });
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          applyTransaction(() => {
            this.store.setError(err);
            this.store.setLoading(false);
          });
          this.logger.error(err.message);
          return throwError(err);
        }),
        finalize(() => this.store.setLoading(false))
      );
  }

  createWebUiAlerts(alertId: string): Observable<any> {
    this.store.setLoading(true);
    return this.http.post<WebUiAlert>(WebUiAlertsService.WEB_UI_NOTIFICATIONS_URL, {alertId})
      .pipe(
        tap((webUiAlert: WebUiAlert) => {
          applyTransaction(() => {
            this.store.add(webUiAlert);
            this.store.setLoading(false);
          });
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          this.store.setLoading(false);
          this.logger.error(err.message);
          return throwError(err);
        }),
        finalize(() => this.store.setLoading(false))
      );
  }

  updateWebUiAlerts(alertIds: Array<string>, enabled: boolean): Observable<Array<WebUiAlert>> {
    this.store.setLoading(true);
    const batchObservables: Array<Observable<WebUiAlert>> = [];
    alertIds.forEach((alertId: string) => {
      batchObservables.push(this.updateWebUiAlert(alertId, enabled));
    });
    return forkJoin(batchObservables)
      .pipe(
        tap((uiAlerts: Array<WebUiAlert>) => {
          this.store.setLoading(false);
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          this.store.setLoading(false);
          return throwError(err);
        }),
        finalize(() => this.store.setLoading(false))
      );
  }

  updateWebUiAlert(alertId: string, enabled: boolean): Observable<WebUiAlert> {
    return this.http.put<WebUiAlert>(WebUiAlertsService.WEB_UI_NOTIFICATIONS_URL, {
      alertId: alertId,
      enableWebUINotifications: enabled
    })
      .pipe(
        tap((webUiAlert: WebUiAlert) => {
          this.store.update(webUiAlert._id, webUiAlert);
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          this.logger.error(err.message);
          return throwError(err);
        })
      );
  }
}
