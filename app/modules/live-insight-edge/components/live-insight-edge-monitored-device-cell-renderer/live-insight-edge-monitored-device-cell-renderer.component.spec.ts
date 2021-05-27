import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgeMonitoredDeviceCellRendererComponent } from './live-insight-edge-monitored-device-cell-renderer.component';

describe('LiveInsightEdgeMonitoredDeviceCellRendererComponent', () => {
  let component: LiveInsightEdgeMonitoredDeviceCellRendererComponent;
  let fixture: ComponentFixture<LiveInsightEdgeMonitoredDeviceCellRendererComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveInsightEdgeMonitoredDeviceCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeMonitoredDeviceCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
