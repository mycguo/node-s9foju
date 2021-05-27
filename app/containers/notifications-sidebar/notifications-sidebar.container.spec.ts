import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsSidebarContainer } from './notifications-sidebar.container';
import {NotificationsSidebarComponent} from '../../components/notifications-sidebar/notifications-sidebar.component';
import {NotificationsModule} from '../../modules/notifications/notifications.module';
import {CookieService} from 'ngx-cookie-service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SharedModule} from '../../modules/shared/shared.module';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

describe('NotificationsSidebarContainer', () => {
  let component: NotificationsSidebarContainer;
  let fixture: ComponentFixture<NotificationsSidebarContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NotificationsModule,
        LoggerTestingModule,
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [
        NotificationsSidebarContainer,
        NotificationsSidebarComponent,
      ],
      providers: [
        CookieService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsSidebarContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
