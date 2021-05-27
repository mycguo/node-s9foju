import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTilesDateGroupComponent } from './notification-tiles-date-group.component';
import NxNotificationDateGroup from '../../../../services/nx-notifications/nx-notification-date-group.model';

describe('NotificationTilesDateGroupComponent', () => {
  let component: NotificationTilesDateGroupComponent;
  let fixture: ComponentFixture<NotificationTilesDateGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationTilesDateGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTilesDateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.notificationGroup = new NxNotificationDateGroup();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
