import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsAccessManagementComponent } from './reports-access-management.component';

describe('ReportsAccessManagementComponent', () => {
  let component: ReportsAccessManagementComponent;
  let fixture: ComponentFixture<ReportsAccessManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsAccessManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsAccessManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
