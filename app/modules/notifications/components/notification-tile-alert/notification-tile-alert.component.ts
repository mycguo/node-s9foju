import {ChangeDetectionStrategy, Component, HostBinding, Input, OnInit} from '@angular/core';
import NotificationTileComponent from '../../../../services/notification-tile-factory/notification-tile-component';
import NotificationTileTypes from '../../../../services/notification-tile-factory/notification-tile-types.enum';
import NxNotification from '../../../../services/nx-notifications/nx-notification.model';
import idx from 'idx';

@Component({
  selector: 'nx-notification-tile-alert',
  templateUrl: './notification-tile-alert.component.html',
  styleUrls: ['./notification-tile-alert.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationTileAlertComponent implements NotificationTileComponent, OnInit {

  // TODO: Note Conversion to alert type is in laNotification.service.ts
  @Input() notification: NxNotification;

  @HostBinding('class.la-notifications-side-bar__notifications-group-item') groupItem = true;

  componentType = NotificationTileTypes.ALERT;

  alertNotificationClass: string;

  constructor() { }

  ngOnInit() {
    this.alertNotificationClass = this.buildAlertClass(this.notification);
  }

  buildAlertClass(notifictaion: NxNotification): string {
    const alertStatus = this.getAlertStatus(notifictaion);
    if (alertStatus === void 0) {
      return;
    }
    return `la-notifications-side-bar-item-wrapper_alert-status-${alertStatus.toLowerCase()}`;
  }

  getAlertStatus(notification: NxNotification): string {
    return idx<NxNotification, string>(notification, _ => _.dataRaw.data.userStatus);
  }

}
