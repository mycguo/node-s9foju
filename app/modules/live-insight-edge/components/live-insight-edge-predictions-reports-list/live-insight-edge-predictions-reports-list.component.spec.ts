import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgePredictionsReportsListComponent } from './live-insight-edge-predictions-reports-list.component';

describe('LiveInsightEdgePredictionsReportsListComponent', () => {
  let component: LiveInsightEdgePredictionsReportsListComponent;
  let fixture: ComponentFixture<LiveInsightEdgePredictionsReportsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveInsightEdgePredictionsReportsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgePredictionsReportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
