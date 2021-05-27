import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgeConfigDisplayComponent } from './live-insight-edge-config-display.component';
import {SharedModule} from '../../../shared/shared.module';

describe('LiveInsightEdgeConfigDisplayComponent', () => {
  let component: LiveInsightEdgeConfigDisplayComponent;
  let fixture: ComponentFixture<LiveInsightEdgeConfigDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ LiveInsightEdgeConfigDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeConfigDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
