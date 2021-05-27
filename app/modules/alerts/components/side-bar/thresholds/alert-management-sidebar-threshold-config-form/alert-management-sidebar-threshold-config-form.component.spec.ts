import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertManagementSidebarThresholdConfigFormComponent } from './alert-management-sidebar-threshold-config-form.component';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import NxAlertManagementConfig from '../../../../services/nx-alert-management/models/nx-alert-management-config';
import { ThresholdComponentOption } from '../threshold-component-option.enum';
import { AlertSeverity } from '../../../../services/enums/alert-severity.enum';
import { AlertsModule } from '../../../../alerts.module';

@Component({
  template: `
    <nx-alert-management-sidebar-threshold-config-form [formControl]="formControl"></nx-alert-management-sidebar-threshold-config-form>`
})
class AlertManagementSidebarThresholdConfigFormHostComponent {
  formControl: FormControl = new FormControl(<NxAlertManagementConfig>{
    thresholdComponent: ThresholdComponentOption.DEFAULT,
    thresholds: [
      {
        severity: AlertSeverity.CRITICAL,
        value: 1,
        enabled: true,
        units: '%',
        comparator: '1',
        name: 'Threshold',
        timeOverMinutes: 1
      }
    ],
    timeOverMinutes: 1
  });
}

describe('AlertManagementSidebarThresholdConfigFormComponent', () => {
  let component: AlertManagementSidebarThresholdConfigFormHostComponent;
  let fixture: ComponentFixture<AlertManagementSidebarThresholdConfigFormHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AlertsModule,
        ReactiveFormsModule
      ],
      declarations: [
        AlertManagementSidebarThresholdConfigFormComponent,
        AlertManagementSidebarThresholdConfigFormHostComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertManagementSidebarThresholdConfigFormHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
