import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedBarTimeSeriesChartComponent } from './stacked-bar-time-series-chart.component';

describe('StackedBarChartComponent', () => {
  let component: StackedBarTimeSeriesChartComponent;
  let fixture: ComponentFixture<StackedBarTimeSeriesChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StackedBarTimeSeriesChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedBarTimeSeriesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
