import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NotificationService} from '../../../../services/notification-service/notification.service';
import {NotificationDowngradeService} from '../../../../services/notification-downgrade/notification-downgrade.service';
import NxAlertManagement from '../../services/nx-alert-management/models/nx-alert-management';
import {NxAlertManagementService} from '../../services/nx-alert-management/nx-alert-management.service';
import {Observable} from 'rxjs';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import {NOTIFICATION_TYPE_ENUM} from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import DetailedError from '../../../shared/components/loading/detailed-error';

@Component({
  selector: 'nx-alert-management-sidebar-nx-single-container',
  template: `
    <nx-alert-management-sidebar-nx-single
      [isLoading]="isLoading$ | async"
      [alert]="alert"
      (cancel)="closeSidebar.emit()"
      (submitForm)="handleSubmit($event)"></nx-alert-management-sidebar-nx-single>
  `,
  styles: [':host { display: block; height: 100%; }'],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class AlertManagementSidebarNxSingleContainer {

  @Input() alert: NxAlertManagement;

  @Output() closeSidebar = new EventEmitter<void>();

  isLoading$: Observable<boolean>;

  constructor(private notificationService: NotificationService,
              private nxAlertManagementService: NxAlertManagementService) {
    this.isLoading$ = this.nxAlertManagementService.selectLoading();
  }

  handleSubmit(alert: NxAlertManagement): void {
    this.nxAlertManagementService.update(alert)
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
