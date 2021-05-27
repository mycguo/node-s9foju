import {Injectable, Optional} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {combineLatest, forkJoin, iif, Observable, of, throwError} from 'rxjs';
import {applyTransaction, EntityStore, QueryEntity} from '@datorama/akita';
import {catchError, finalize, map, tap} from 'rxjs/operators';
import {CourierResponse} from './models/courier-response';
import {Courier} from './models/courier';
import {EmailCourier} from './models/email-courier';
import {CourierTypes} from './enums/courier-types.enum';
import {EmailCourierConfigResponse} from './models/email-courier-config-response';
import {ServiceNowCourierConfigResponse} from './models/service-now-courier-config-response';
import {ServiceNowCourier} from './models/service-now-courier';
import {SnmpTrapCourier} from './models/snmp-trap-courier';
import {SnmpTrapCourierConfigResponse} from './models/snmp-trap-courier-config-response';
import {SyslogCourier} from './models/syslog-courier';
import {CouriersState} from './models/courier-state';
import {WebUiCourier} from './models/web-ui-courier';
import {CommonService} from '../../../../utils/common/common.service';
import {AlertSharing} from './models/alert-sharing';
import {WebUiAlertsService} from '../web-ui-alerts/web-ui-alerts.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {WebUiAlert} from '../web-ui-alerts/models/web-ui-alert';
import {CourierScopes} from './enums/courier-scopes.enum';
import {ClientErrorHandler} from '../../../../utils/client-error-handler/client-error-handler';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class CouriersService {
  static readonly COURIERS_URL = '/api/nx/alerting/couriers';
  static readonly INITIAL_STATE = {};
  static readonly STORE_NAME = 'couriers';

  constructor(private http: HttpClient,
              private logger: Logger,
              private commonService: CommonService,
              private webUiAlertsService: WebUiAlertsService,
              @Optional() private readonly store: EntityStore<CouriersState>,
              @Optional() private readonly query: QueryEntity<CouriersState>) {
    if (commonService.isNil(store)) {
      this.store = new EntityStore(CouriersService.INITIAL_STATE, {
        name: CouriersService.STORE_NAME,
        resettable: true
      });
    }

    if (commonService.isNil(query)) {
      this.query = new QueryEntity<CouriersState>(this.store);
    }
  }

  reset(): void {
    this.store.reset();
  }

  selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  selectError(): Observable<DetailedError> {
    return this.query.selectError();
  }

  selectCouriers(): Observable<Array<Courier>> {
    return this.query.selectAll()
      .pipe(
        map((couriers: Array<CourierResponse>) => {
          return couriers.map((courier: CourierResponse) => {
            return this.buildCourier(courier);
          });
        })
      );
  }

  selectIsSnmpTrapConfigured(): Observable<boolean> {
    return combineLatest([
        this.query.selectAll({
          filterBy: ((courier: CourierResponse) => courier.type === CourierTypes.SNMP_TRAP)
        }),
        this.query.selectError()
      ]
    ).pipe(
      map(([couriers, error]: [Array<CourierResponse>, DetailedError]) => {
        if (couriers.length > 0) {
          const snmpCourier: SnmpTrapCourier = <SnmpTrapCourier>this.buildCourier(couriers[0]); // should only be one from filter
          return error == null && snmpCourier.recipients.length > 0;
        } else {
          return false;
        }
      })
    );
  }

  isCouriersSetup(): boolean {
    return this.query.getAll().length > 0;
  }

  getCouriers(): Observable<Array<Courier>> {
    applyTransaction(() => {
      this.store.setLoading(true);
      this.store.setError(void 0);
    });
    return this.http.get<{ meta: Object, couriers: Array<CourierResponse> }>(CouriersService.COURIERS_URL)
      .pipe(
        tap((resp: { meta: Object, couriers: Array<CourierResponse> }) => {
          this.store.set(resp.couriers);
        }),
        map((resp: { meta: Object, couriers: Array<CourierResponse> }) => {
          return resp.couriers.map((respCourier: CourierResponse) => this.buildCourier(respCourier));
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          const detailedError = ClientErrorHandler.buildDetailedError(err);
          this.store.setError<DetailedError>(detailedError);
          this.logger.error(err.message);
          return throwError(err);
        }),
        finalize(() => this.store.setLoading(false))
      );
  }

  /**
   * Updates couriers
   * @param sharing - AlertSharing
   * @param alertId - alert id
   * @param useDefaultSharingConfig - should be calculated by useDefaultSharingConfig and rank !== DEFAULT_RANK
   * @param defaultWebUiEnabled - used to copy default alert in hierarchical alerts for webUi alerts
   *        (should be removed after refactor of backend)
   */
  update(sharing: AlertSharing, alertId: string, useDefaultSharingConfig = false, defaultWebUiEnabled = false): Observable<AlertSharing> {
    if (useDefaultSharingConfig) {
      sharing.webUi.enabled = defaultWebUiEnabled;
      sharing.email.enabled = false;
      sharing.serviceNow.enabled = false;
      sharing.snmpTrap.enabled = false;
      sharing.syslog.enabled = false;
    }
    this.store.setLoading(true);
    return forkJoin([
      this.webUiAlertsService.updateWebUiAlert(alertId, sharing.webUi.enabled),
      this.buildCourierUpdateRequest(sharing.email),
      this.buildCourierUpdateRequest(sharing.serviceNow)
    ]).pipe(
      tap(() => this.store.setLoading(false)),
      map(([webUi, email, serviceNow]: [WebUiAlert, EmailCourier, ServiceNowCourier]) => {
        return {
          email: email,
          serviceNow: serviceNow,
          snmpTrap: sharing.snmpTrap,
          syslog: sharing.syslog,
          webUi: new WebUiCourier({
            id: webUi._id,
            scope: CourierScopes.SCOPED,
            enabled: webUi.enableWebUINotifications
          })
        } as AlertSharing;
      }),
      catchError((err: HttpErrorResponse) => {
        this.logger.error(err.message);
        this.store.setLoading(false);
        return throwError(err);
      }),
      finalize(() => this.store.setLoading(false))
    );
  }

  private buildCourierUpdateRequest(courier: Courier): Observable<Courier> {
    if (courier.shouldDelete()) {
      if (courier.id == null) {
        return of(courier);
      } else {
        return this.http.delete<CourierResponse>(`${CouriersService.COURIERS_URL}/${courier.id}`).pipe(
          tap(() => {
            this.store.remove(courier.id);
          }),
          map(() => void 0),
          catchError((err: HttpErrorResponse) => {
            this.logger.error(err.message);
            return of(courier); // swallow error on delete
          })
        );
      }
    } else {
      return iif(() => courier.id === void 0,
        this.http.post<CourierResponse>(CouriersService.COURIERS_URL, courier.buildUpdateRequest()),
        this.http.put<CourierResponse>(`${CouriersService.COURIERS_URL}/${courier.id}`, courier.buildUpdateRequest())
      ).pipe(
        tap((courierResp: CourierResponse) => this.store.upsert(courierResp.id, {...courierResp})),
        map((courierResp: CourierResponse) => {
          return this.buildCourier(courierResp);
        }),
        catchError((err: HttpErrorResponse) => {
          this.logger.error(err.message);
          return throwError(err);
        })
      );
    }
  }

  private buildCourier(respCourier: CourierResponse): Courier {
    switch (respCourier.type) {
      case CourierTypes.PAGER_DUTY_EMAIL:
        const emailConfig = <EmailCourierConfigResponse>respCourier.config;
        const emailRecipients = (emailConfig !== void 0) ? emailConfig.recipients : [];
        return new EmailCourier({
          id: respCourier.id,
          scope: respCourier.scope,
          enabled: respCourier.enabled,
          recipients: emailRecipients
        });
      case CourierTypes.SERVICE_NOW:
        const snConfig = <ServiceNowCourierConfigResponse>respCourier.config;
        const fieldOptions = (snConfig !== void 0) ? snConfig.fieldOptions : [];
        return new ServiceNowCourier({
          id: respCourier.id,
          scope: respCourier.scope,
          enabled: respCourier.enabled,
          fieldOptions: fieldOptions
        });
      case CourierTypes.SNMP_TRAP:
        const stConfig = <SnmpTrapCourierConfigResponse>respCourier.config;
        const stRecipients = (stConfig !== void 0) ? stConfig.recipients : [];
        return new SnmpTrapCourier({
          id: respCourier.id,
          scope: respCourier.scope,
          enabled: respCourier.enabled,
          recipients: stRecipients
        });
      case CourierTypes.SYSLOG:
        return new SyslogCourier({id: respCourier.id, scope: respCourier.scope, enabled: respCourier.enabled});
      case CourierTypes.WEB_UI: // NOTE: until [LD-26099] look at web-ui-alerts.service
        return new WebUiCourier({id: respCourier.id, scope: respCourier.scope, enabled: respCourier.enabled});
      default:
        return void 0;
    }
  }
}
