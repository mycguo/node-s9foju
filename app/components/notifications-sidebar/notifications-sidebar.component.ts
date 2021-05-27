import {
  Component,
  ComponentFactoryResolver, EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Observable} from 'rxjs';
import {NotificationsListDirective} from '../../modules/notifications/directives/notifications-list/notifications-list.directive';
import {NotificationTileFactoryService} from '../../services/notification-tile-factory/notification-tile-factory.service';
import NotificationTileComponent from '../../services/notification-tile-factory/notification-tile-component';
import NxNotificationDateGroup from '../../services/nx-notifications/nx-notification-date-group.model';
import NxNotification from '../../services/nx-notifications/nx-notification.model';
import * as _ from 'lodash';

@Component({
  selector: 'nx-notifications-sidebar',
  templateUrl: './notifications-sidebar.component.html',
  styleUrls: ['./notifications-sidebar.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationsSidebarComponent implements OnInit, OnChanges {

  @Input() notifications: Array<NxNotification>;
  @Input() showSidebar$: Observable<boolean>;
  @Input() isPopupActive: boolean;

  @Output() popupActiveChanged = new EventEmitter<boolean>();

  notificationDateGroups: Array<NxNotificationDateGroup>;
  notificationComponents: Array<NotificationTileComponent>;
  notificationsDataGroup = {};
  notificationGroupItemLimit: { groupKey: string, limit: number } = {
    groupKey: '',
    limit: 10
  };

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private notificationTileFactory: NotificationTileFactoryService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const notificationChanges = changes.notifications;
    if (notificationChanges !== void 0 &&
      (notificationChanges.currentValue !== notificationChanges.previousValue || notificationChanges.isFirstChange())) {
      this.notificationDateGroups = this.groupNotificationsByDate(notificationChanges.currentValue);
    }
  }

  hideNotification(notification: Notification) {
    // laCustomNotificationService hideNotification
  }
  getLaNotificationDisplayStatus() {

  }

  displayMoreButton(list, date) {

  }

  updatePopupGroupDefaultDisplayStatus(popupActiveSwichState: boolean) {
    this.popupActiveChanged.emit(popupActiveSwichState);
  }

  groupNotificationsByDate(notifications: Array<NxNotification>): Array<NxNotificationDateGroup> {
    let notificationGroups: Array<NxNotificationDateGroup>;
    const millisecondsInDay = 86400000;
    const clientTimezoneOffset = new Date().getTimezoneOffset() * 60000; // ms
    const dayRoundingTick = 1;
    const groupedNotifications = _.groupBy(notifications, (notification) =>
        Math.floor((notification.created.getTime() - clientTimezoneOffset) / millisecondsInDay));
    const unsortedNotificationGroups = Object.keys(groupedNotifications).map((dayKey) => {
      const notificationGroup = {
        date: new Date(millisecondsInDay * parseInt(dayKey, 10) + clientTimezoneOffset + dayRoundingTick),
        notifications: groupedNotifications[dayKey]
      };
      return Object.assign(new NxNotificationDateGroup(), notificationGroup);
    });
    notificationGroups = _.orderBy(unsortedNotificationGroups, (group) => group.date, 'desc');
    return notificationGroups;
  }
}
