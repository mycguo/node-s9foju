import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgeReportsComponent } from './live-insight-edge-reports.component';

describe('LiveInsightEdgeReportsComponent', () => {
  let component: LiveInsightEdgeReportsComponent;
  let fixture: ComponentFixture<LiveInsightEdgeReportsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveInsightEdgeReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
