import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgeReportsListComponent } from './live-insight-edge-reports-list.component';

describe('LiveInsightEdgeReportsListComponent', () => {
  let component: LiveInsightEdgeReportsListComponent;
  let fixture: ComponentFixture<LiveInsightEdgeReportsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveInsightEdgeReportsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeReportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
