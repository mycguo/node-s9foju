import {Injectable, Optional} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CommonService} from '../../../../utils/common/common.service';
import {applyTransaction, Query, Store} from '@datorama/akita';
import {PasswordOptionsState} from './models/password-options-state';
import {forkJoin, Observable, throwError} from 'rxjs';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {PasswordOptions} from '../../components/security-password/interfaces/password-options';
import {catchError, map} from 'rxjs/operators';
import {PasswordPolicy} from '../../components/security-password/interfaces/password-policy';
import {PasswordRestrictions} from '../../components/security-password/interfaces/password-restrictions';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class SecurityPasswordService {
  public static readonly AUTHENTICATION_OPTIONS_PASSWORD_POLICY_URL = '/api/nx/authenticationOptions/passwordPolicy';
  public static readonly AUTHENTICATION_OPTIONS_PASSWORD_RESTRICTION_URL = '/api/nx/authenticationOptions/passwordRestriction';

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private logger: Logger,
    @Optional() private readonly store: Store<PasswordOptionsState>,
    @Optional() private readonly query: Query<PasswordOptionsState>
  ) {
    if (commonService.isNil(store)) {
      this.store = new Store<PasswordOptionsState>({}, {
        name: 'PasswordOptionsStore',
        resettable: true
      });
    }

    if (commonService.isNil(query)) {
      this.query = new Query<PasswordOptionsState>(this.store);
    }
  }

  selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  selectError(): Observable<DetailedError> {
    return this.query.selectError();
  }

  selectPasswordOptions(): Observable<PasswordOptions> {
    return this.query.select((state: PasswordOptionsState) => {
      return {
        minimumRequiredLength: state.minimumRequiredLength,
        requiredUpperCase: state.requiredUpperCase,
        requiredLowerCase: state.requiredLowerCase,
        requiredNumeric: state.requiredNumeric,
        requiredNonAlphaNumeric: state.requiredNonAlphaNumeric,
        passwordLifetime: state.passwordLifetime,
        passwordChangeRestrictionPeriod: state.passwordChangeRestrictionPeriod,
        maxStoredPreviousPasswords: state.maxStoredPreviousPasswords,
      };
    });
  }

  resetStore(): void {
    this.store.reset();
  }

  getPasswordOptions(): Observable<PasswordOptions> {
    applyTransaction(() => {
      this.store.setLoading(true);
      this.store.setError(void 0);
    });

    const passwordPolicy = this.http.get<PasswordPolicy>(SecurityPasswordService.AUTHENTICATION_OPTIONS_PASSWORD_POLICY_URL);
    const passwordRestrictions = this.http.get<PasswordRestrictions>(
      SecurityPasswordService.AUTHENTICATION_OPTIONS_PASSWORD_RESTRICTION_URL
    );

    return forkJoin([passwordPolicy, passwordRestrictions])
      .pipe(
        map((options) => {
          const passwordOptions: PasswordOptions = Object.assign({}, options[0], options[1]);
          applyTransaction(() => {
            this.store.update(passwordOptions);
            this.store.setLoading(false);
          });
          return passwordOptions;
        }),
        catchError(this.errorHandler$.bind(this))
      );
  }

  setPasswordOptions(passwordOptions: PasswordOptions): Observable<PasswordOptions> {
    applyTransaction(() => {
      this.store.setLoading(true);
      this.store.setError(void 0);
    });

    const {passwordPolicy, passwordRestrictions} = this.getPasswordOptionsProps(passwordOptions);
    const passwordPolicyRequest = this.http.post<PasswordPolicy>(
    SecurityPasswordService.AUTHENTICATION_OPTIONS_PASSWORD_POLICY_URL, passwordPolicy
    );
    const passwordRestrictionsRequest = this.http.post<PasswordRestrictions>(
      SecurityPasswordService.AUTHENTICATION_OPTIONS_PASSWORD_RESTRICTION_URL, passwordRestrictions
    );

    return forkJoin([passwordPolicyRequest, passwordRestrictionsRequest])
      .pipe(
        map((options) => {
          const passwordOptionsResult: PasswordOptions = Object.assign({}, options[0], options[1]);
          applyTransaction(() => {
            this.store.update(passwordOptionsResult);
            this.store.setLoading(false);
          });
          return passwordOptionsResult;
        }),
        catchError(this.errorHandler$.bind(this))
      );
  }

  private getPasswordOptionsProps(passwordOptions: PasswordOptions):
    {passwordPolicy: PasswordPolicy, passwordRestrictions: PasswordRestrictions} {
    const passwordPolicy: PasswordPolicy = (
      ({
         passwordLifetime,
         passwordChangeRestrictionPeriod,
         maxStoredPreviousPasswords
       }) =>
        ({
          passwordLifetime,
          passwordChangeRestrictionPeriod,
          maxStoredPreviousPasswords
        })
    )(passwordOptions);
    const passwordRestrictions: PasswordRestrictions = (
      ({
         minimumRequiredLength,
         requiredUpperCase,
         requiredLowerCase,
         requiredNumeric,
         requiredNonAlphaNumeric
       }) =>
        ({
          minimumRequiredLength,
          requiredUpperCase,
          requiredLowerCase,
          requiredNumeric,
          requiredNonAlphaNumeric
        })
    )(passwordOptions);
    return {passwordPolicy, passwordRestrictions};
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
