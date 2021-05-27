import IntegrationSdwanForm from '../../components/sdwan-form/integrationsSdwanForm';
import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import IntegrationDisplayStateEnum from '../../enums/integration-display-state.enum';
import ConfigurationEnum from '../../../../../../../project_typings/enums/configuration.enum';
import { switchMap, take} from 'rxjs/operators';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import {Observable} from 'rxjs';
import {NOTIFICATION_TYPE_ENUM} from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import IntegrationTitlesEnum from '../../enums/integration-title.enum';
import IntegrationsSdwan from '../../services/sdwan/integrations-sdwan';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {SdwanService} from '../../services/sdwan/sdwan.service';
import {CommonService} from '../../../../utils/common/common.service';
import {NotificationService} from '../../../../services/notification-service/notification.service';
import {NotificationDowngradeService} from '../../../../services/notification-downgrade/notification-downgrade.service';
import DetailedError from '../../../shared/components/loading/detailed-error';

@UntilDestroy()
@Component({
  selector: 'nx-sdwan-integrations-container',
  styles: [':host { display: block; text-align: center; }'],
  template: `
    <nx-sdwan-integrations
      [isLoading]="selectLoading$ | async"
      [data]="selectSdwan$ | async"
      [error]="fatalError"
      [displayState]="displayState"
      (edit)="onEdit()"
      (delete)="onDelete()"
      (checkConnection)="onCheckConnection()"
      (discover)="onDiscover()"
      (formSubmit)="updateConfig($event)"
      (cancel)="onCancel()"
    >
    </nx-sdwan-integrations>
  `,
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class SdwanIntegrationsContainer implements OnInit, OnDestroy {

  @Output() discover = new EventEmitter<void>();

  displayState: IntegrationDisplayStateEnum;

  selectSdwan$: Observable<IntegrationsSdwan>;
  selectLoading$: Observable<boolean>;
  fatalError: DetailedError;

  /**
   * @ignore
   */
  constructor(
    private commonService: CommonService,
    private notificationService: NotificationService,
    private sdwanService: SdwanService) {

    this.selectSdwan$ = this.sdwanService.selectSdwan();
    this.selectLoading$ = this.sdwanService.selectLoading();
  }

  /**
   * run initial get
   * setup subscription from store
   */
  ngOnInit() {
    this.sdwanService.getSdwan()
      .pipe(untilDestroyed(this))
      .subscribe((sdwan: IntegrationsSdwan) => {
        this.displayState = (sdwan.status === ConfigurationEnum.VALID || sdwan.status === ConfigurationEnum.INVALID) ?
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
    this.sdwanService.getSdwan()
      .pipe(take(1))
      .subscribe();
  }

  /**
   * Output when discover is called
   */
  onDiscover() {
    this.discover.emit();
  }

  updateConfig(config: IntegrationSdwanForm) {
    this.sdwanService.updateSdwan(config)
      .pipe(
        take(1),
        switchMap(() => {
          this.notify(NOTIFICATION_TYPE_ENUM.SUCCESS, `Successfully ${IntegrationDisplayStateEnum.ADD ? 'added' : 'updated'} ${IntegrationTitlesEnum.SDWAN} configuration`);
          this.displayState = IntegrationDisplayStateEnum.VIEW;
          return this.sdwanService.getSdwan();
        })
      )
      .subscribe(() => {
          // nothing;
        },
        (error) => {
          let errorMessage = error.message || 'An Error Occurred.';
          if (error?.error?.error?.clientMessage === 'INVALID_CREDENTIALS') {
            errorMessage = `Invalid ${IntegrationTitlesEnum.SDWAN} credentials.`;
          }
          this.notify(NOTIFICATION_TYPE_ENUM.ALERT, errorMessage);
        });
  }

  onDelete(): void {
    this.sdwanService.deleteSdwan()
      .pipe(take(1))
      .subscribe(
        () => {
          this.notify(NOTIFICATION_TYPE_ENUM.SUCCESS, `Successfully deleted ${IntegrationTitlesEnum.SDWAN} configuration`);
          this.displayState = IntegrationDisplayStateEnum.ADD;
        },
        (error) => {
          const errorMessage = error.message || `Error deleting ${IntegrationTitlesEnum.SDWAN} configuration`;
          this.notify(NOTIFICATION_TYPE_ENUM.ALERT, errorMessage);
        }
      );
  }

  notify(type: NOTIFICATION_TYPE_ENUM, message: string): void {
    this.notificationService.sendNotification$(new LaCustomNotificationDefinition(message, type));
  }
}
