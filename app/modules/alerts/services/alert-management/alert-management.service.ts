import {Injectable} from '@angular/core';
import {AkitaFilter} from 'akita-filters-plugin/lib/akita-filters-store';
import {searchFilter, searchFilterIn} from 'akita-filters-plugin';
import {AlertIdentifierResponse} from '../alert-identifiers/models/alert-identifier-response';
import {Courier} from '../couriers/models/courier';
import {WebUiAlert} from '../web-ui-alerts/models/web-ui-alert';
import {WebUiCourier} from '../couriers/models/web-ui-courier';
import {CourierScopes} from '../couriers/enums/courier-scopes.enum';
import {CommonService} from '../../../../utils/common/common.service';
import {EMPTY, forkJoin, Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {WebUiAlertsService} from '../web-ui-alerts/web-ui-alerts.service';
import {AlertSharing} from '../couriers/models/alert-sharing';
import {EmailCourier} from '../couriers/models/email-courier';
import {ServiceNowCourier} from '../couriers/models/service-now-courier';
import {SnmpTrapCourier} from '../couriers/models/snmp-trap-courier';
import {SyslogCourier} from '../couriers/models/syslog-courier';
import {CourierTypes} from '../couriers/enums/courier-types.enum';

@Injectable({
  providedIn: 'root'
})
export class AlertManagementService {

  constructor(private commonService: CommonService,
              private webUiAlertsService: WebUiAlertsService) {
  }

  /**
   * S - state
   * E - entity
   * @param field - field to search
   * @param searchTerm - term to search
   */
  buildFilter<S, E>(field: string, searchTerm: string | number | boolean): Partial<AkitaFilter<S, E>> {
    return {
      id: field,
      value: searchTerm,
      predicate: (alert: E, index: number, array: Array<E>) => {
        if ((typeof searchTerm) === 'boolean') {
          return alert[field] === <boolean>searchTerm;
        } else {
          return searchFilterIn(<string>searchTerm, alert, field);
        }
      }
    };
  }

  /**
   * S - state
   * E - entity
   * @param allowableGlobalFilters - fields of property to be searched
   * @param searchTerm - search term
   */
  buildGlobalFilter<S, E>(allowableGlobalFilters: Array<string>, searchTerm: string): Partial<AkitaFilter<S, E>> {
    return {
      id: 'search',
      value: searchTerm,
      order: 20,
      name: `" ${searchTerm} "`,
      predicate: (entity => {
        let filterableObj = {};
        allowableGlobalFilters.forEach((prop: string) => {
          const value: string = entity[prop];
          if (value !== void 0) {
            filterableObj = Object.assign(filterableObj, {[prop]: value});
          }
        });
        return searchFilter(searchTerm, filterableObj);
      })
    };
  }

  /**
   * Build AlertSharing object of couriers for alerts
   */
  buildAlertCouriers(alert: AlertIdentifierResponse,
                     couriers: Array<Courier>,
                     webUiAlerts: Array<WebUiAlert>): AlertSharing {
    if (couriers !== void 0) {
      // scoped couriers
      // scoped couriers are created per alert so we can use them as found
      const emailCourier: EmailCourier = new EmailCourier(couriers.find((courier: Courier) => {
        return alert.courierIds.includes(courier.id) && courier.type === CourierTypes.PAGER_DUTY_EMAIL;
      }));

      const serviceNowCourier: ServiceNowCourier = new ServiceNowCourier(couriers.find((courier: Courier) => {
        return alert.courierIds.includes(courier.id) && courier.type === CourierTypes.SERVICE_NOW;
      }));

      // global couriers
      // there will only be on courier found for global couriers so a new instance must be created
      // and enabled will be determined if the courierId is found
      const snmpTrapCourier: SnmpTrapCourier = new SnmpTrapCourier(couriers.find((courier: Courier) => {
        return courier.type === CourierTypes.SNMP_TRAP;
      }));
      snmpTrapCourier.enabled = alert.courierIds.includes(snmpTrapCourier?.id);

      const syslogCourier: SyslogCourier = new SyslogCourier(couriers.find((courier: Courier) => {
        return courier.type === CourierTypes.SYSLOG;
      }));
      syslogCourier.enabled = alert.courierIds.includes(syslogCourier?.id);

      // NOTE: when [LD-26099] goes in we can remove this
      const foundWebUiAlert: WebUiAlert = webUiAlerts.find((webUiAlert: WebUiAlert) => webUiAlert.alertId === alert.id);
      const webUICourier: WebUiCourier = new WebUiCourier({
        id: foundWebUiAlert?._id,
        scope: CourierScopes.SCOPED,
        enabled: !!foundWebUiAlert?.enableWebUINotifications
      });

      return {
        useDefaultSharingConfig: alert.useDefaultSharingConfig,
        email: emailCourier,
        serviceNow: serviceNowCourier,
        snmpTrap: snmpTrapCourier,
        syslog: syslogCourier,
        webUi: webUICourier
      } as AlertSharing;
    } else {
      return void 0;
    }
  }

  /**
   * Used to check and create "web ui" sharing notification alerts. This is handled by nodejs and not the nx server
   * Can be empty if new instance or something changed with the alerts on the nx server
   * NOTE: when [LD-26099] goes in we can remove this
   */
  createMissingAlertWebUiSettings(identifiers: Array<AlertIdentifierResponse>,
                                  webUiAlerts: Array<WebUiAlert>): Observable<void> {
    const createWebUiNotifications$: Array<Observable<WebUiAlert>> = [];
    identifiers.forEach((identifier: AlertIdentifierResponse) => {
      if (webUiAlerts.find((webUi: WebUiAlert) => webUi.alertId === identifier.id) === void 0) {
        createWebUiNotifications$.push(this.webUiAlertsService.createWebUiAlerts(identifier.id));
      }
    });
    return forkJoin(createWebUiNotifications$)
      .pipe(
        map(() => void 0),
        catchError(() => EMPTY)
      );
  }
}
