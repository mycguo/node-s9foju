import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';

import {AlertManagementSdwanTableComponent} from './alert-management-sdwan-table.component';

describe('AlertManagementTableComponent', () => {
  let component: AlertManagementSdwanTableComponent;
  let fixture: ComponentFixture<AlertManagementSdwanTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AlertManagementSdwanTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertManagementSdwanTableComponent);
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
