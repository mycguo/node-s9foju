import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgeMonitoredDevicesComponent } from './live-insight-edge-monitored-devices.component';
import {LiveInsightEdgeModule} from '../../live-insight-edge.module';
import {GridModule} from '../../../grid/grid.module';
import {IntegrationsModule} from '../../../integrations/integrations.module';

describe('LiveInsightEdgeMonitoredDevicesComponent', () => {
  let component: LiveInsightEdgeMonitoredDevicesComponent;
  let fixture: ComponentFixture<LiveInsightEdgeMonitoredDevicesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IntegrationsModule.forRoot(false),
        LiveInsightEdgeModule.forRoot(false),
        GridModule
      ],
      declarations: [ ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeMonitoredDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
