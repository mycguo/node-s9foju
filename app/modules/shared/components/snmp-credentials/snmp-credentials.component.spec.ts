import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SnmpCredentialsComponent } from './snmp-credentials.component';
import { SharedModule } from '../../shared.module';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'snmp-credentials-host',
  template: `
    <nx-snmp-credentials
      [formControl]="formControl">
    </nx-snmp-credentials>
  `,
})

class SnmpCredentialsHostComponent {
  formControl = new FormControl({
    snmpVersion: 'v3',
    port: 161,
    settings: {
      snmpAuthPassPhrase: 'Ys2Q5Xxu7g3gUoHxfUFifqiXSXjd2tkc',
      snmpAuthProtocol: 'SHA',
      snmpPrivPassPhrase: 'x3Fmpv9OpIsnk0Qg3rH25BKBd66fxzSK',
      snmpPrivProtocol: 'AES',
      snmpSecurityName: 'admin'
    },
  });
}

describe('SnmpCredentialsComponent', () => {
  let component: SnmpCredentialsHostComponent;
  let fixture: ComponentFixture<SnmpCredentialsHostComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SharedModule
      ],
      declarations: [SnmpCredentialsHostComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnmpCredentialsHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
