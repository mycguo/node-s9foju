import { Injectable } from '@angular/core';
import NxNotification from '../nx-notifications/nx-notification.model';
import NotificationTile from './notification-tile';
import NotificationTileTypes from './notification-tile-types.enum';
import {NotificationTileGeneralComponent} from '../../modules/notifications/components/notification-tile-general/notification-tile-general.component';
import {NotificationTileAlertComponent} from '../../modules/notifications/components/notification-tile-alert/notification-tile-alert.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationTileFactoryService {

  constructor() { }

  generateNotificationTile(notification: NxNotification): NotificationTile {
    let notificationTile: NotificationTile;
    switch (notification.type) {
      case NotificationTileTypes.ALERT:
        notificationTile = new NotificationTile(NotificationTileAlertComponent, notification);
        break;
      default:
        notificationTile = new NotificationTile(NotificationTileGeneralComponent, notification);
        break;
    }
    return notificationTile;
  }
}
