import NxNotification from './nx-notification.model';
import { LaNotification } from '../../../../../client/nxuxComponents/directives/laNotifications/laNotificationsModels';

export default class AlertNotificationModel extends LaNotification {

  constructor(baseNotification?: LaNotification) {
    super();
    if (baseNotification !== void 0) {
      Object.assign(this, {...baseNotification});
    }
  }

  public getAlertStatus(): string {
    try {
      return this.dataRaw.notification.userStatus;
    } catch (e) {
      return null;
    }
  }
}
