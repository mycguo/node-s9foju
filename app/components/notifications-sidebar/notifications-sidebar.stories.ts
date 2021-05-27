import { BehaviorSubject, Observable, of } from 'rxjs';
import { NotificationsSidebarComponent } from './notifications-sidebar.component';
import { NotificationsModule } from '../../modules/notifications/notifications.module';
import { subDays } from 'date-fns';
import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { NotificationGroupService } from '../../services/notification-group/notification-group.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { map } from 'rxjs/operators';
import { NxNotificationsService } from '../../services/nx-notifications/nx-notifications.service';
import { SharedModule } from '../../modules/shared/shared.module';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

const statusResolved = 'resolved';
const statusActive = 'active';
const statusIgnored = 'ignored';
const statusAcknowledged = 'acknowledged';

const generateNotification = (
  notificationId: string,
  type: string,
  daysAgo: Date,
  rawData: any
) => {
  return {
    _id: notificationId,
    externalId: notificationId,
    created: daysAgo,
    type,
    body: `Notification ${notificationId}: ${type}`,
    title: `Notification ${notificationId}`,
    wasDisplayed: false,
    dataRaw: rawData,
  };
};

const returnRandomStatus = () => {
  const statusId = Math.floor(Math.random() * 4);
  let status;
  switch (statusId) {
    case 0:
      status = statusResolved;
      break;
    case 1:
      status = statusActive;
      break;
    case 2:
      status = statusIgnored;
      break;
    case 3:
      status = statusAcknowledged;
      break;
  }
  return status;
};

const buildNotificationList = () => {
  const dayCount = 5;
  const notificationCount = 20;
  const notificationList = [];
  for (let i = 0; i < dayCount; i++) {
    const daysAgoDate = subDays(new Date(), i);
    for (let j = 0; j < notificationCount; j++) {
      const alertData = {
        data: {
          userStatus: returnRandomStatus(),
        },
      };
      const type = i % 2 === 0 ? 'alert' : 'general';
      const notification = generateNotification(
        `${i}:${j}`,
        type,
        daysAgoDate,
        alertData
      );
      notificationList.push(notification);
    }
  }
  return notificationList;
};

@Injectable()
class MockNotificationGroupService implements OnDestroy {
  maxCountPerKey = {};
  maxCountSub$ = new BehaviorSubject(this.maxCountPerKey);

  setShowTileMaxCount(groupKey: string, maxCount: number) {
    this.maxCountPerKey[groupKey] = maxCount;
    this.maxCountSub$.next(this.maxCountPerKey);
  }

  getShowTileMaxCount(groupKey: string): Observable<number> {
    if (this.maxCountPerKey[groupKey] === void 0) {
      this.maxCountPerKey[groupKey] = 10;
    }
    return this.maxCountSub$.pipe(
      map((countMap) => {
        return countMap[groupKey];
      })
    );
  }

  ngOnDestroy(): void {
    this.maxCountSub$.unsubscribe();
  }
}

@Injectable()
class MockNotificationService {}

@Component({
  selector: 'nx-notification-sidebar-wrapper',
  template: `
    <div
      (click)="addNewNotification()"
      style="position: absolute; right: 0; padding: 8px 4px; margin: 4px 8px; background: green; color: white;"
    >
      New Notification
    </div>
    <nx-notifications-sidebar
      [showSidebar$]="showSidebar$"
      [notifications]="notificationList"
    ></nx-notifications-sidebar>
  `,
  providers: [
    {
      provide: NotificationGroupService,
      useClass: MockNotificationGroupService,
    },
    { provide: NxNotificationsService, useClass: MockNotificationService },
  ],
})
class NotificationsSidebarWrapper implements OnInit {
  showSidebar$ = of(true);
  notificationList;
  ngOnInit(): void {
    this.notificationList = buildNotificationList();
  }

  addNewNotification() {
    const notification = generateNotification(
      `${0}:${new Date().getTime()}`,
      'general',
      new Date(),
      null
    );
    const updatedNotificationList = Object.assign([], this.notificationList);
    updatedNotificationList.push(notification);
    this.notificationList = updatedNotificationList;
  }
}

export default {
  title: 'App/Notification Sidebar',
};

export const Default = () => {
  return {
    props: {},
    template: `
        <nx-notification-sidebar-wrapper>
        </nx-notification-sidebar-wrapper>
      `,
    moduleMetadata: {
      imports: [
        NotificationsModule,
        HttpClientTestingModule,
        LoggerTestingModule,
        SharedModule,
      ],
      declarations: [
        NotificationsSidebarComponent,
        NotificationsSidebarWrapper,
      ],
      providers: [CookieService],
    },
  };
};
