import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertManagementSidebarNxSingleComponent } from './alert-management-sidebar-nx-single.component';
import { Component } from '@angular/core';
import { ALERT_CATEGORIES } from '../../../services/nx-alert-management/enums/alert-categories.enum';
import { AlertSeverity } from '../../../services/enums/alert-severity.enum';
import { EmailCourier } from '../../../services/couriers/models/email-courier';
import { ServiceNowCourier } from '../../../services/couriers/models/service-now-courier';
import { SnmpTrapCourier } from '../../../services/couriers/models/snmp-trap-courier';
import { WebUiCourier } from '../../../services/couriers/models/web-ui-courier';
import { SyslogCourier } from '../../../services/couriers/models/syslog-courier';
import NxAlertManagement from '../../../services/nx-alert-management/models/nx-alert-management';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  template: `
    <nx-alert-management-sidebar-nx-single [alert]="alert"></nx-alert-management-sidebar-nx-single>`
})
class AlertManagementSidebarNxSingleHostComponent {
  alert: NxAlertManagement = {
    id: '1',
    name: 'alert',
    category: ALERT_CATEGORIES.DEVICE_INTERFACE,
    enabled: true,
    severity: AlertSeverity.CRITICAL,
    type: 'type',
    description: 'description',
    coolDownMinutes: 1,
    sharing: {
      email: new EmailCourier(void 0),
      serviceNow: new ServiceNowCourier(void 0),
      snmpTrap: new SnmpTrapCourier(void 0),
      webUi: new WebUiCourier(void 0),
      syslog: new SyslogCourier(void 0),
    },
    instanceName: 'Alert',
    sharingString: ''
  } as NxAlertManagement;
}

describe('AlertManagementSidebarNxSingleComponent', () => {
  let component: AlertManagementSidebarNxSingleHostComponent;
  let fixture: ComponentFixture<AlertManagementSidebarNxSingleHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        AlertManagementSidebarNxSingleComponent,
        AlertManagementSidebarNxSingleComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertManagementSidebarNxSingleHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
