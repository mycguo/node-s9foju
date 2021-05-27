import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgeSummaryPageComponent } from './live-insight-edge-summary-page.component';
import { $STATE } from '../../ajs-upgraded-providers';

describe('LiveInsightEdgeSummaryPageComponent', () => {
  let component: LiveInsightEdgeSummaryPageComponent;
  let fixture: ComponentFixture<LiveInsightEdgeSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveInsightEdgeSummaryPageComponent ],
      providers: [
        {
          provide: $STATE,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
