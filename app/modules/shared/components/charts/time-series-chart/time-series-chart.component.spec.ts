import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {TimeSeriesChartComponent} from './time-series-chart.component';


describe('TimeseriesChartComponent', () => {
  let component: TimeSeriesChartComponent;
  let fixture: ComponentFixture<TimeSeriesChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSeriesChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSeriesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
