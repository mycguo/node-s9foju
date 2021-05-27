import {Injectable, Optional} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CommonService} from '../../utils/common/common.service';
import {applyTransaction, Query, Store} from '@datorama/akita';
import {Observable, throwError} from 'rxjs';
import DetailedError from '../../modules/shared/components/loading/detailed-error';
import {catchError, tap} from 'rxjs/operators';
import {EmailConfiguration} from './email-configuration';
import {EmailConfigurationState} from './email-configuration-state';
import {Logger} from '../../modules/logger/logger';

@Injectable({
  providedIn: 'root'
})
export class EmailConfigurationService {
  static readonly EMAIL_CONFIG_URL = 'api/nx/appMailer/settings';
  static readonly STORE_NAME = 'syslog';

  static readonly INITIAL_STATE: EmailConfigurationState = {
    loading: false,
    hasQueried: false,
    appMailerConfig: void 0
  };

  constructor(private http: HttpClient,
              private logger: Logger,
              private commonService: CommonService,
              @Optional() private readonly store: Store<EmailConfigurationState>,
              @Optional() private readonly query: Query<EmailConfigurationState>
  ) {
    if (commonService.isNil(store)) {
      this.store = new Store(EmailConfigurationService.INITIAL_STATE, {
        name: EmailConfigurationService.STORE_NAME,
        resettable: true
      });
    }

    if (commonService.isNil(query)) {
      this.query = new Query<EmailConfigurationState>(this.store);
    }
  }

  selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  selectError(): Observable<DetailedError> {
    return this.query.selectError();
  }

  selectIsConfigured(): Observable<boolean> {
    return this.query.select((state: EmailConfigurationState) => {
      return state.error == null && state?.appMailerConfig != null;
    });
  }

  selectEmailConfiguration(): Observable<EmailConfigurationState> {
    return this.query.select();
  }

  isConfigurationKnown(): boolean {
    return this.query.getValue()?.hasQueried === true;
  }

  getEmailConfiguration(): Observable<EmailConfiguration> {
    return this.http.get<EmailConfiguration>(EmailConfigurationService.EMAIL_CONFIG_URL)
      .pipe(
        tap((resp: EmailConfiguration) => {
          applyTransaction(() => {
            this.store.update(resp);
            this.store.setLoading(false);
          });
        }),
        catchError(this.errorHandler.bind(this))
      );
  }

  private errorHandler(err: HttpErrorResponse): Observable<never> {
    applyTransaction(() => {
      this.store.setError<DetailedError>(Object.assign({title: void 0}, err));
      this.store.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(err);
  }
}
