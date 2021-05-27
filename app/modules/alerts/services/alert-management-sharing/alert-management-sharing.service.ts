import {Injectable} from '@angular/core';
import {forkJoin, iif, Observable, of} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';
import {ServiceNowFieldsService} from '../../../integrations/services/service-now-fields/service-now-fields.service';
import {ServiceNowService} from '../../../integrations/services/service-now/service-now.service';
import {ServiceNowFieldOptionsService} from '../../../integrations/services/service-now-field-options/service-now-field-options.service';
import IServiceNowIntegrationsValidate from '../../../../../../../project_typings/api/integrations/IServiceNowIntegrationsValidate';
import {SERVICE_NOW_INTEGRATION_TYPE} from '../../../../../../../project_typings/enums/serviceNowIntegrationTypeEnum';
import {EmailConfigurationService} from '../../../../services/email-configuration/email-configuration.service';
import {CouriersService} from '../couriers/couriers.service';
import {SyslogService} from '../../../../services/syslog/syslog.service';

@Injectable({
  providedIn: 'root'
})
export class AlertManagementSharingService {

  constructor(private serviceNowService: ServiceNowService,
              private serviceNowFieldsService: ServiceNowFieldsService,
              private serviceNowFieldOptionsService: ServiceNowFieldOptionsService,
              private emailConfigurationService: EmailConfigurationService,
              private couriersService: CouriersService,
              private syslogService: SyslogService) {
  }

  getSharingConfiguration(): Observable<void> {
    // get sharing configuration if not known
    const sharingConfiguredRequests = [];
    if (!this.emailConfigurationService.isConfigurationKnown()) {
      sharingConfiguredRequests.push(this.emailConfigurationService.getEmailConfiguration());
    }
    if (!this.serviceNowService.isConfigurationKnown()) {
      sharingConfiguredRequests.push(this.serviceNowService.getServiceNow());
    }
    if (!this.couriersService.isCouriersSetup()) {
      sharingConfiguredRequests.push(this.couriersService.getCouriers());
    }
    if (!this.syslogService.isConfigurationKnown()) {
      sharingConfiguredRequests.push(this.syslogService.getSyslog());
    }
    return forkJoin(sharingConfiguredRequests)
      .pipe(
        take(1),
        map(() => void 0)
      );
  }

  /**
   * fetches and updates store for service now
   * if service now is configured with incident, fetches and updates store for fields and field options
   */
  getServiceNow(): Observable<void> {
    // if function to determine if we should get fields and options (only when incident)
    const ifObs = (sn: IServiceNowIntegrationsValidate): Observable<void> => {
      if (sn.config.integrationType === SERVICE_NOW_INTEGRATION_TYPE.incident) {
        return this.serviceNowFieldsService.getFields()
          .pipe(
            take(1),
            map(() => void 0)
          ); // update store with fields
      } else {
        return of(void 0);
      }
    };

    const serviceNow = this.serviceNowService.serviceNow();
    // if serviceNow is known skip fetching
    if (this.serviceNowService.isConfigurationKnown()) {
      return ifObs(serviceNow);
    } else {
      return this.serviceNowService.getServiceNow()
        .pipe(
          switchMap((sn: IServiceNowIntegrationsValidate) => {
            return ifObs(sn);
          })
        );
    }
  }

  /**
   * resets serviceNowFieldsService, serviceNowFieldOptionsService and serviceNowCourierConfigService
   */
  reset(): void {
    this.serviceNowFieldsService.reset();
  }
}
