import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NotificationService} from '../../../../services/notification-service/notification.service';
import {NotificationDowngradeService} from '../../../../services/notification-downgrade/notification-downgrade.service';
import {AlertSharingConfig} from '../../components/side-bar/sharing/alert-sharing-config';
import {SdwanAlertManagement} from '../../services/sdwan-alert-management/sdwan-alert-management';
import {SdwanAlertManagementService} from '../../services/sdwan-alert-management/sdwan-alert-management.service';
import {Observable} from 'rxjs';
import DetailedError from '../../../shared/components/loading/detailed-error';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import {NOTIFICATION_TYPE_ENUM} from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';

@Component({
  selector: 'nx-alert-management-sidebar-sdwan-container',
  template: `
    <nx-alert-management-sidebar-sdwan
      [isLoading]="isLoading$ | async"
      [alert]="alert"
      (cancel)="closeSidebar.emit()"
      (submitForm)="handleSubmit($event)">
    </nx-alert-management-sidebar-sdwan>
  `,
  styles: [':host { display: block; height: 100%; }'],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class AlertManagementSidebarSdwanContainer {
  @Input() alert: SdwanAlertManagement;

  @Output() closeSidebar = new EventEmitter<void>();

  isLoading$: Observable<boolean>;

  constructor(private notificationService: NotificationService,
              private sdwanAlertManagementService: SdwanAlertManagementService) {
    this.isLoading$ = this.sdwanAlertManagementService.selectLoading();
  }

  handleSubmit(alert: SdwanAlertManagement): void {
    this.sdwanAlertManagementService.update(alert)
      .subscribe(
        () => {
          this.notificationService.sendNotification$(
            new LaCustomNotificationDefinition('Alert configuration saved', NOTIFICATION_TYPE_ENUM.SUCCESS)
          );
          this.closeSidebar.emit();
        },
        (error: DetailedError) => {
          this.notificationService.sendNotification$(
            new LaCustomNotificationDefinition(error.message, NOTIFICATION_TYPE_ENUM.ALERT)
          );
        }
      );
  }
}
