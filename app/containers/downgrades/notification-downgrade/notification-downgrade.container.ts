import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import LaCustomNotificationDefinition from '../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import {NotificationService} from '../../../services/notification-service/notification.service';
import {NotificationDowngradeService} from '../../../services/notification-downgrade/notification-downgrade.service';
import NotificationDowngrade from '../NotificationDowngrade';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'nx-notification-downgrade',
  template: '',
  styles: [],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class NotificationDowngradeContainer implements OnInit, OnDestroy, NotificationDowngrade {
  @Output() notificationOutput = new EventEmitter<LaCustomNotificationDefinition>();

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.notificationService.getNotifications$()
      .pipe(untilDestroyed(this))
      .subscribe((notificationDefinition: LaCustomNotificationDefinition) => {
        this.notificationOutput.emit(notificationDefinition);
      });
  }

  ngOnDestroy() {
  }
}
