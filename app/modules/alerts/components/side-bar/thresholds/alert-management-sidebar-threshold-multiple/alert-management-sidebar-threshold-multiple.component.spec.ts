import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertManagementSidebarThresholdMultipleComponent } from './alert-management-sidebar-threshold-multiple.component';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AlertsModule } from '../../../../alerts.module';

@Component({
  template: `
    <nx-alert-management-sidebar-threshold-multiple [formControl]="formControl"></nx-alert-management-sidebar-threshold-multiple>`
})
class AlertManagementSidebarThresholdMultipleHostComponent {
  formControl: FormControl = new FormControl();
}

describe('AlertManagementSidebarThresholdMultipleComponent', () => {
  let component: AlertManagementSidebarThresholdMultipleHostComponent;
  let fixture: ComponentFixture<AlertManagementSidebarThresholdMultipleHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AlertsModule
      ],
      declarations: [
        AlertManagementSidebarThresholdMultipleComponent,
        AlertManagementSidebarThresholdMultipleHostComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertManagementSidebarThresholdMultipleHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
