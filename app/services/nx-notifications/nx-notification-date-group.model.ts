import NxNotification from './nx-notification.model';

export default class NxNotificationDateGroup {
  date: Date;
  notifications: Array<NxNotification>;

  get id() {
    return this.date !== void 0 ? this.date.toDateString() : null;
  }
}
