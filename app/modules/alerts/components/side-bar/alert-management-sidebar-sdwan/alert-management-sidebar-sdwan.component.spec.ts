import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertManagementSidebarSdwanComponent } from './alert-management-sidebar-sdwan.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { SdwanAlertManagement } from '../../../services/sdwan-alert-management/sdwan-alert-management';
import { ALERT_CATEGORIES } from '../../../services/nx-alert-management/enums/alert-categories.enum';
import { AlertSeverity } from '../../../services/enums/alert-severity.enum';
import { EmailCourier } from '../../../services/couriers/models/email-courier';
import { ServiceNowCourier } from '../../../services/couriers/models/service-now-courier';
import { SnmpTrapCourier } from '../../../services/couriers/models/snmp-trap-courier';
import { WebUiCourier } from '../../../services/couriers/models/web-ui-courier';
import { SyslogCourier } from '../../../services/couriers/models/syslog-courier';

@Component({
  template: `
    <nx-alert-management-sidebar-sdwan [alert]="alert"></nx-alert-management-sidebar-sdwan>`
})
class AlertManagementSidebarSdwanHostComponent {
  alert: SdwanAlertManagement = {
    id: '1',
    name: 'alert',
    category: ALERT_CATEGORIES.DEVICE_INTERFACE,
    enabled: true,
    severity: AlertSeverity.CRITICAL,
    type: 'type',
    description: 'description',
    sharing: {
      email: new EmailCourier(void 0),
      serviceNow: new ServiceNowCourier(void 0),
      snmpTrap: new SnmpTrapCourier(void 0),
      webUi: new WebUiCourier(void 0),
      syslog: new SyslogCourier(void 0),
    },
    instanceName: 'Alert',
    sharingString: ''
  } as SdwanAlertManagement;
}

describe('AlertManagementSidebarSdwanComponent', () => {
  let component: AlertManagementSidebarSdwanHostComponent;
  let fixture: ComponentFixture<AlertManagementSidebarSdwanHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [ AlertManagementSidebarSdwanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertManagementSidebarSdwanHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
