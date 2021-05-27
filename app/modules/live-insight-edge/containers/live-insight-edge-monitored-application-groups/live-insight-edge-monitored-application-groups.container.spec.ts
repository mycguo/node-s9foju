import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgeMonitoredApplicationGroupsContainer } from './live-insight-edge-monitored-application-groups.container';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RequestErrorsNotificationPipe} from '../../../shared/pipes/request-errors-notification/request-errors-notification.pipe';
import {SharedModule} from '../../../shared/shared.module';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('LiveInsightEdgeMonitoredApplicationGroupsContainer', () => {
  let component: LiveInsightEdgeMonitoredApplicationGroupsContainer;
  let fixture: ComponentFixture<LiveInsightEdgeMonitoredApplicationGroupsContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        SharedModule,
      ],
      declarations: [ LiveInsightEdgeMonitoredApplicationGroupsContainer,
        RequestErrorsNotificationPipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeMonitoredApplicationGroupsContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
