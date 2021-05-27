import LaCustomNotificationDefinition from '../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import {EventEmitter} from '@angular/core';
export default interface NotificationDowngrade {
  notificationOutput: EventEmitter<LaCustomNotificationDefinition>;
}
