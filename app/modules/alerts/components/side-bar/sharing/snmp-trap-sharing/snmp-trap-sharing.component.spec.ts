import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SnmpTrapSharingComponent } from './snmp-trap-sharing.component';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AlertsModule } from '../../../../alerts.module';

@Component({
  template: `
    <nx-snmp-trap-sharing [formControl]="formControl"></nx-snmp-trap-sharing>`
})
class SnmpTrapSharingHostComponent {
  formControl: FormControl = new FormControl();
}

describe('SnmpTrapSharingComponent', () => {
  let component: SnmpTrapSharingHostComponent;
  let fixture: ComponentFixture<SnmpTrapSharingHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AlertsModule
      ],
      declarations: [
        SnmpTrapSharingComponent,
        SnmpTrapSharingHostComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnmpTrapSharingHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
