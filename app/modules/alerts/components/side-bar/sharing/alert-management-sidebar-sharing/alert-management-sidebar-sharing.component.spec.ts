import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertManagementSidebarSharingComponent } from './alert-management-sidebar-sharing.component';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EmailCourier } from '../../../../services/couriers/models/email-courier';
import { ServiceNowCourier } from '../../../../services/couriers/models/service-now-courier';
import { SnmpTrapCourier } from '../../../../services/couriers/models/snmp-trap-courier';
import { WebUiCourier } from '../../../../services/couriers/models/web-ui-courier';
import { SyslogCourier } from '../../../../services/couriers/models/syslog-courier';

@Component({
  template: `
    <nx-alert-management-sidebar-sharing [formControl]="formControl"></nx-alert-management-sidebar-sharing>`
})
class AlertManagementSidebarSharingHostComponent {
  formControl: FormControl = new FormControl({
    email: new EmailCourier(void 0),
    serviceNow: new ServiceNowCourier(void 0),
    snmpTrap: new SnmpTrapCourier(void 0),
    webUi: new WebUiCourier(void 0),
    syslog: new SyslogCourier(void 0),
  });
}

describe('AlertManagementSidebarSharingComponent', () => {
  let component: AlertManagementSidebarSharingHostComponent;
  let fixture: ComponentFixture<AlertManagementSidebarSharingHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        AlertManagementSidebarSharingComponent,
        AlertManagementSidebarSharingHostComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertManagementSidebarSharingHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
