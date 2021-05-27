import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsSidebarComponent } from './notifications-sidebar.component';
import {ComponentFactoryResolver} from '@angular/core';
import {NotificationsListDirective} from '../../modules/notifications/directives/notifications-list/notifications-list.directive';
import NxNotification from '../../services/nx-notifications/nx-notification.model';
import {NotificationTilesDateGroupComponent} from '../../modules/notifications/components/notification-tiles-date-group/notification-tiles-date-group.component';
import { subHours } from 'date-fns';
import {NotificationTilesDateGroupContainer} from '../../modules/notifications/containers/notification-tiles-date-group/notification-tiles-date-group.container';
import {CustomTextToggleComponent} from '../../modules/shared/components/custom-text-toggle/custom-text-toggle.component';

const buildNotificationForTime = (id, date: Date): NxNotification => {
  return {
    _id: id,
    externalId: id,
    created: date,
    type: 'general',
    body: 'body',
    dataRaw: null,
    title: 'title',
    wasDisplayed: false
  };
};

describe('NotificationsSidebarComponent', () => {
  let component: NotificationsSidebarComponent;
  let fixture: ComponentFixture<NotificationsSidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CustomTextToggleComponent,
        NotificationsSidebarComponent,
        NotificationsListDirective,
        NotificationTilesDateGroupComponent,
        NotificationTilesDateGroupContainer
      ],
      providers: [
        ComponentFactoryResolver
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it( 'should group notifications by day', () => {
    const todaysDate = new Date();
    const notifications: Array<NxNotification> = [
      buildNotificationForTime(2, subHours(new Date(), 24)),
      buildNotificationForTime(1, todaysDate),
      buildNotificationForTime(3, subHours(new Date(), 24))
    ];
    const dateGroupedNotifications = component.groupNotificationsByDate(notifications);
    expect(dateGroupedNotifications.length).toEqual(2);
    expect(dateGroupedNotifications[0].date.getDate()).toEqual(todaysDate.getDate());
  });
});
