import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ApicemService} from '../../services/apicem/apicem.service';
import IntegrationDisplayStateEnum from '../../enums/integration-display-state.enum';
import ConfigurationEnum from '../../../../../../../project_typings/enums/configuration.enum';
import {switchMap, take} from 'rxjs/operators';
import IIntegrationForm from '../../services/integrations-form/IIntegrationForm';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import {Observable} from 'rxjs';
import {NOTIFICATION_TYPE_ENUM} from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import IntegrationTitlesEnum from '../../enums/integration-title.enum';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {NotificationService} from '../../../../services/notification-service/notification.service';
import {NotificationDowngradeService} from '../../../../services/notification-downgrade/notification-downgrade.service';
import IIntegrationsValidate from '../../../../../../../project_typings/api/integrations/IIntegrationsValidate';
import {CommonService} from '../../../../utils/common/common.service';
import DetailedError from '../../../shared/components/loading/detailed-error';

@UntilDestroy()
@Component({
  selector: 'nx-apicem-integrations-container',
  styles: [':host { display: block; text-align: center; } :host > * { text-align: left; } '],
  template: `
    <nx-apicem-integrations
      [isLoading]="selectLoading$ | async"
      [data]="selectApicem$ | async"
      [error]="fatalError"
      [displayState]="displayState"
      (edit)="onEdit()"
      (delete)="onDelete()"
      (checkConnection)="onCheckConnection()"
      (discover)="onDiscover()"
      (formSubmit)="updateConfig($event)"
      (cancel)="onCancel()"
    >
    </nx-apicem-integrations>
  `,
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class ApicemIntegrationsContainer implements OnInit, OnDestroy {
  @Output() discover = new EventEmitter<void>();

  displayState: IntegrationDisplayStateEnum;

  selectApicem$: Observable<IIntegrationsValidate>;
  selectLoading$: Observable<boolean>;
  fatalError: DetailedError;

  /**
   * @ignore
   */
  constructor(
    private commonService: CommonService,
    private notificationService: NotificationService,
    private apicemService: ApicemService) {

    this.selectApicem$ = this.apicemService.selectApicem();
    this.selectLoading$ = this.apicemService.selectLoading();
  }

  /**
   * run initial get
   * setup subscription from store
   */
  ngOnInit() {
    // if store is not unknown show value now then update
    if (this.apicemService.getStatus() !== ConfigurationEnum.UNKNOWN) {
      this.displayState = IntegrationDisplayStateEnum.VIEW;
    }
    this.apicemService.getApicem()
      .pipe(untilDestroyed(this))
      .subscribe((apicem: IIntegrationsValidate) => {
        this.displayState = (apicem.status === ConfigurationEnum.VALID || apicem.status === ConfigurationEnum.INVALID) ?
          IntegrationDisplayStateEnum.VIEW : IntegrationDisplayStateEnum.ADD;
      }, (error: Error) => {
        this.fatalError = Object.assign(error, {title: void 0});
      });
  }


  ngOnDestroy() {
  }

  /**
   * Change state on cancel
   */
  onCancel(): void {
    this.displayState = IntegrationDisplayStateEnum.VIEW;
  }

  /**
   * change to edit state
   */
  onEdit(): void {
    this.displayState = IntegrationDisplayStateEnum.EDIT;
  }

  onCheckConnection() {
    this.apicemService.getApicem()
      .pipe(take(1))
      .subscribe();
  }

  /**
   * Output when discover is called
   */
  onDiscover() {
    this.discover.emit();
  }

  updateConfig(config: IIntegrationForm) {
    this.apicemService.updateApicem(config)
      .pipe(
        take(1),
        switchMap(() => {
          this.notify(NOTIFICATION_TYPE_ENUM.SUCCESS, `Successfully ${IntegrationDisplayStateEnum.ADD ? 'added' : 'updated'} ${IntegrationTitlesEnum.APICEM} configuration`);
          this.displayState = IntegrationDisplayStateEnum.VIEW;
          return this.apicemService.getApicem();
        }))
      .subscribe(() => {
          // nothing;
        },
        (error) => {
          let errorMessage = error.message || 'An Error Occurred.';
          if (error?.error?.error?.clientMessage === 'INVALID_CREDENTIALS') {
            errorMessage = `Invalid ${IntegrationTitlesEnum.APICEM} credentials.`;
          }
          this.notify(NOTIFICATION_TYPE_ENUM.ALERT, errorMessage);
        });
  }

  onDelete(): void {
    this.apicemService.deleteApicem()
      .pipe(take(1))
      .subscribe(
        () => {
          this.notify(NOTIFICATION_TYPE_ENUM.SUCCESS, `Successfully deleted ${IntegrationTitlesEnum.APICEM} configuration`);
          this.displayState = IntegrationDisplayStateEnum.ADD;
        },
        (error) => {
          const errorMessage = error.message || `Error deleting ${IntegrationTitlesEnum.APICEM} configuration`;
          this.notify(NOTIFICATION_TYPE_ENUM.ALERT, errorMessage);
        }
      );
  }

  notify(type: NOTIFICATION_TYPE_ENUM, message: string): void {
    this.notificationService.sendNotification$(new LaCustomNotificationDefinition(message, type));
  }
}
