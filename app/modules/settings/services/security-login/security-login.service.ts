import {Injectable, Optional} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CommonService} from '../../../../utils/common/common.service';
import {LoginOptionsState} from './models/login-options-state';
import {applyTransaction, Query, Store} from '@datorama/akita';
import {Observable, throwError} from 'rxjs';
import {LoginOptions} from '../../components/security-login/login-options';
import {catchError, tap} from 'rxjs/operators';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class SecurityLoginService {
  public static readonly AUTHENTICATION_OPTIONS_LOGIN_URL = '/api/nx/authenticationOptions/loginOptions';

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private logger: Logger,
    @Optional() private readonly store: Store<LoginOptionsState>,
    @Optional() private readonly query: Query<LoginOptionsState>
  ) {
    if (commonService.isNil(store)) {
      this.store = new Store<LoginOptionsState>({}, {
        name: 'LoginOptionsStore',
        resettable: true
      });
    }

    if (commonService.isNil(query)) {
      this.query = new Query<LoginOptionsState>(this.store);
    }
  }

  selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  selectError(): Observable<DetailedError> {
    return this.query.selectError();
  }

  selectLoginOptions(): Observable<LoginOptions> {
    return this.query.select((state: LoginOptionsState) => {
      return {
        sessionTimeout: state.sessionTimeout,
        allowedNumberOfLoginAttempts: state.allowedNumberOfLoginAttempts,
        failedPasswordRestrictionPeriod: state.failedPasswordRestrictionPeriod
      };
    });
  }

  resetStore(): void {
    this.store.reset();
  }

  getLoginOption(): Observable<LoginOptions> {
    applyTransaction(() => {
      this.store.setLoading(true);
      this.store.setError(void 0);
    });
    return this.http.get<LoginOptions>(SecurityLoginService.AUTHENTICATION_OPTIONS_LOGIN_URL)
      .pipe(
        tap((options: LoginOptions) => {
          applyTransaction(() => {
            this.store.update(options);
            this.store.setLoading(false);
          });
        }),
        catchError(this.errorHandler$.bind(this))
      );
  }

  setLoginOptions(loginOptions: LoginOptions): Observable<LoginOptions> {
    applyTransaction(() => {
      this.store.setLoading(true);
      this.store.setError(void 0);
    });
    return this.http.post<LoginOptions>(SecurityLoginService.AUTHENTICATION_OPTIONS_LOGIN_URL, loginOptions)
      .pipe(
        tap((options: LoginOptions) => {
          applyTransaction(() => {
            this.store.update(options);
            this.store.setLoading(false);
          });
        }),
        catchError(this.errorHandler$.bind(this))
      );
  }

  /**
   * observable error handler
   * @param err Http Error
   */
  private errorHandler$(err: HttpErrorResponse): Observable<never> {
    applyTransaction(() => {
      this.store.setError(err);
      this.store.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(err);
  }
}
