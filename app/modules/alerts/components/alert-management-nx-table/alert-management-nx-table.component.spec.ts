import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';

import {AlertManagementNxTableComponent} from './alert-management-nx-table.component';

describe('AlertManagementTableComponent', () => {
  let component: AlertManagementNxTableComponent;
  let fixture: ComponentFixture<AlertManagementNxTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AlertManagementNxTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertManagementNxTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('init', () => {
    it('should initialize the columns for the table', () => {
      expect(component.columns).not.toBe(null);
      expect(component.columns.length).toBeGreaterThan(0);
    });
  });
});
