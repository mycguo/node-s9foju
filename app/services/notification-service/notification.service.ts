import {Observable} from 'rxjs';
import LaCustomNotificationDefinition from '../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';

export abstract class NotificationService {
  abstract sendNotification$(notification: LaCustomNotificationDefinition): void;
  abstract getNotifications$(): Observable<LaCustomNotificationDefinition>;
}
