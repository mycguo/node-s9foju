import NotificationGroup from './notificationGroup.model';
import {EntityUIQuery, QueryEntity} from '@datorama/akita';
import {NotificationGroupStore} from './notificationGroup.store';
import NotificationGroupState from './notificationGroup.state';
import NotificationGroupUI from './ui/notificationGroupUI.model';
import NotificationGroupUIState from './ui/notificationGroupUI.state';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationGroupQuery extends QueryEntity<NotificationGroupState, NotificationGroup> {

  ui: EntityUIQuery<NotificationGroupUIState, NotificationGroupUI>;

  constructor(
    protected store: NotificationGroupStore
  ) {
    super(store);
    this.createUIQuery();
  }
}
