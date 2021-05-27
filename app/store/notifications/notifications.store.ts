import {Injectable} from '@angular/core';
import {Store, StoreConfig} from '@datorama/akita';
import NxNotification from '../../services/nx-notifications/nx-notification.model';

export interface NotificationsState {
  notifications: Array<NxNotification>;
  // apiRequestResult: any // Api Request Result
}

function createInitialState(): NotificationsState {
  return {
    notifications: new Array<NxNotification>()
  };
}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'notifications' })
export class NotificationsStore extends Store<NotificationsState> {
  constructor() {
    super(createInitialState());
  }

  setNotificationsState(notifications: Array<NxNotification>) {
    this.update({ notifications });
  }

  addNotificationsToState(notifications: Array<NxNotification>) {
    this.update((state) => ({
      notifications: Object.assign([], notifications, state.notifications)
    }));
  }
}
