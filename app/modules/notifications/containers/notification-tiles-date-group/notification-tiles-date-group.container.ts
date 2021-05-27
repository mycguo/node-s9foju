import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import NxNotificationDateGroup from '../../../../services/nx-notifications/nx-notification-date-group.model';
import {NotificationSidebarService} from '../../../../services/notification-sidebar/notification-sidebar.service';
import {NxNotificationsService} from '../../../../services/nx-notifications/nx-notifications.service';
import {Observable, Subscription} from 'rxjs';
import {NotificationGroupService} from '../../../../services/notification-group/notification-group.service';

@Component({
  selector: 'nx-notification-tiles-date-group-container',
  template: `
    <div class="notification-tiles-date-group-container">
        <nx-notification-tiles-date-group
          [notificationGroup]="notificationGroup"
          [numberOfTilesToShow]="tileShowCount$ | async"
          (notificationGroupRead)="notificationGroupRead($event)"
          (showMoreNotifications)="updateTileMaxCount($event)"
        >
        </nx-notification-tiles-date-group>
    </div>
  `,
  styles: []
})
export class NotificationTilesDateGroupContainer implements OnInit, OnDestroy {

  @Input() notificationGroup: NxNotificationDateGroup;

  tileShowCount$: Observable<number>;

  constructor(
    private notificationSideBarService: NotificationSidebarService,
    private nxNotificationService: NxNotificationsService,
    private notificationGroupService: NotificationGroupService
  ) { }

  ngOnInit() {
    if (this.notificationGroup !== void 0) {
      this.tileShowCount$ = this.notificationGroupService.getShowTileMaxCount(this.notificationGroup.id);
    }
  }

  ngOnDestroy(): void {
  }

  updateTileMaxCount(newMax: number): void {
    this.notificationGroupService.setShowTileMaxCount(this.notificationGroup.id, newMax);
  }

  notificationGroupRead(dateGroup: NxNotificationDateGroup) {
    this.nxNotificationService.markNotificationsAsRead(dateGroup.notifications);
  }

}
