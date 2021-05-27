import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardWidgetFilteredTableComponent } from './dashboard-widget-filtered-table.component';

describe('DashboardWidgetFilteredTableComponent', () => {
  let component: DashboardWidgetFilteredTableComponent;
  let fixture: ComponentFixture<DashboardWidgetFilteredTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardWidgetFilteredTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWidgetFilteredTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
