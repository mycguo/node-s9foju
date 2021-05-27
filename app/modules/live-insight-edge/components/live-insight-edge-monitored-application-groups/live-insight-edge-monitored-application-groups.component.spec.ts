import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgeMonitoredApplicationGroupsComponent } from './live-insight-edge-monitored-application-groups.component';

describe('LiveInsightEdgeMonitoredApplicationGroupsComponent', () => {
  let component: LiveInsightEdgeMonitoredApplicationGroupsComponent;
  let fixture: ComponentFixture<LiveInsightEdgeMonitoredApplicationGroupsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveInsightEdgeMonitoredApplicationGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeMonitoredApplicationGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
