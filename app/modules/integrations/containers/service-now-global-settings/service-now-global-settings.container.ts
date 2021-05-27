import {Component} from '@angular/core';
import {ServiceNowCourierConfigService} from '../../services/service-now-courier-config/service-now-courier-config.service';
import {ServiceNowFieldOptionsService} from '../../services/service-now-field-options/service-now-field-options.service';
import ServiceNowCourierConfig from '../../services/service-now-courier-config/models/service-now-courier-config';
import {ServiceNowFieldsService} from '../../services/service-now-fields/service-now-fields.service';
import {ServiceNowFieldResponse} from '../../services/service-now-fields/models/service-now-field-response';
import {forkJoin, Observable, combineLatest, of} from 'rxjs';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {catchError, map, switchMap, take} from 'rxjs/operators';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import {NOTIFICATION_TYPE_ENUM} from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import {HttpErrorResponse} from '@angular/common/http';
import {ServiceNowService} from '../../services/service-now/service-now.service';
import IServiceNowIntegrationsValidate from '../../../../../../../project_typings/api/integrations/IServiceNowIntegrationsValidate';
import {SERVICE_NOW_INTEGRATION_TYPE} from '../../../../../../../project_typings/enums/serviceNowIntegrationTypeEnum';
import {ServiceNowDescriptionService} from '../../services/service-now-description/service-now-description.service';
import {ServiceNowField} from '../../services/service-now-fields/models/service-now-field';
import {NotificationService} from '../../../../services/notification-service/notification.service';
import {NotificationDowngradeService} from '../../../../services/notification-downgrade/notification-downgrade.service';

@UntilDestroy()
@Component({
  template: `
    <nx-service-now-global-settings [config]="serviceNowConfig$ | async"
                                    [descriptionValue]="serviceNowDescription$ | async"
                                    [isLoading]="selectLoading$ | async"
                                    [error]="selectError$ | async"
                                    [fields]="serviceNowFields$ | async"
                                    [integrationType]="integrationType$ | async"
                                    (saveConfig)="saveConfig($event)">
    </nx-service-now-global-settings>
  `,
  styles: [':host { height: 100%; overflow-y: auto; }'],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class ServiceNowGlobalSettingsContainer {
  serviceNowConfig$: Observable<Array<ServiceNowCourierConfig>>;
  serviceNowFields$: Observable<Array<ServiceNowField>>;
  selectLoading$: Observable<boolean>;
  selectError$: Observable<DetailedError>;
  serviceNowDescription$: Observable<string>;
  integrationType$: Observable<SERVICE_NOW_INTEGRATION_TYPE>;
  notification: LaCustomNotificationDefinition;

  constructor(private serviceNowCourierConfigService: ServiceNowCourierConfigService,
              private serviceNowFieldOptionsService: ServiceNowFieldOptionsService,
              private serviceNowFieldsService: ServiceNowFieldsService,
              private serviceNowService: ServiceNowService,
              private serviceNowDescriptionService: ServiceNowDescriptionService,
              private notificationService: NotificationService) {

    this.selectError$ = combineLatest([
      this.serviceNowService.selectError(),
      this.serviceNowDescriptionService.selectError(),
      this.serviceNowCourierConfigService.selectError(),
      this.serviceNowFieldsService.selectError()
    ]).pipe(
      untilDestroyed(this),
      map((errors: Array<Error>): DetailedError => {
        const filteredErrors = errors.filter((e: Error) => e != null);
        return filteredErrors.length > 0 ? filteredErrors[0] as DetailedError : null;
      })
    );

    this.selectLoading$ = combineLatest([
      this.serviceNowService.selectLoading(),
      this.serviceNowDescriptionService.selectLoading(),
      this.serviceNowCourierConfigService.selectLoading(),
      this.serviceNowFieldsService.selectLoading()
    ]).pipe(
      untilDestroyed(this),
      map((loadingStates: Array<boolean>) => {
        return loadingStates.includes(true);
      })
    );

    this.serviceNowConfig$ = this.serviceNowCourierConfigService.selectConfigCouriers();
    this.serviceNowFields$ = this.serviceNowFieldsService.selectFields();
    this.serviceNowDescription$ = this.serviceNowDescriptionService.selectDescription()
      .pipe(
        map((description: ServiceNowFieldResponse) => description.fieldName)
      );

    this.integrationType$ = forkJoin([
      this.serviceNowService.getServiceNow(),
      this.serviceNowDescriptionService.getDescription(),
      this.serviceNowFieldsService.getFields()
    ])
      .pipe(
        untilDestroyed(this),
        take(1),
        map(([serviceNowConfig, description, fields]:
               [IServiceNowIntegrationsValidate, ServiceNowFieldResponse, Array<ServiceNowFieldResponse>]) => {
          return serviceNowConfig?.config?.integrationType;
        }),
        switchMap((type: SERVICE_NOW_INTEGRATION_TYPE) => {
          if (type === SERVICE_NOW_INTEGRATION_TYPE.incident) {
            return this.serviceNowCourierConfigService.getConfigCouriers()
              .pipe(
                take(1),
                map(() => type)
              );
          } else {
            return of(type);
          }
        }),
        catchError((detailedError: DetailedError) => {
          return of(void 0); // swallow error here, should be shown in selectError and logged in service
        })
      );
  }

  saveConfig(item: { description: string, config: Array<ServiceNowCourierConfig> }): void {
    const descriptionItem = this.serviceNowFieldsService.findFieldByName(item.description);
    const req: Array<Observable<any>> = [this.serviceNowDescriptionService.update(descriptionItem)];
    if (item.config != null) {
      req.push(this.serviceNowCourierConfigService.updateConfigCouriers(item.config));
    }
    forkJoin(req)
      .pipe(take(1))
      .subscribe(
        () => {
          const notification = new LaCustomNotificationDefinition(
            'Settings successfully saved.',
            NOTIFICATION_TYPE_ENUM.SUCCESS
          );
          this.notificationService.sendNotification$(notification);
        },
        (error: HttpErrorResponse) => {
          const notification = new LaCustomNotificationDefinition(
            error.message,
            NOTIFICATION_TYPE_ENUM.ALERT
          );
          this.notificationService.sendNotification$(notification);
        },
      );
  }
}
