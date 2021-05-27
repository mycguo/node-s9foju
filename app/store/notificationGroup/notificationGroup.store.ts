import NotificationGroup from './notificationGroup.model';
import NotificationGroupState from './notificationGroup.state';
import NotificationGroupUIState from './ui/notificationGroupUI.state';
import NotificationGroupUI from './ui/notificationGroupUI.model';
import {EntityStore, EntityUIStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'notificationGroup '})
export class NotificationGroupStore extends EntityStore<NotificationGroupState, NotificationGroup> {
  ui: EntityUIStore<NotificationGroupUIState, NotificationGroupUI>;

  constructor() {
    super();
    this.createUIStore();
  }
}
