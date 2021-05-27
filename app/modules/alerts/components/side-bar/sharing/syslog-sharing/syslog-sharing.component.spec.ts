import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {SyslogSharingComponent} from './syslog-sharing.component';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AlertsModule } from '../../../../alerts.module';

@Component({
  template: `
    <nx-syslog-sharing [formControl]="formControl"></nx-syslog-sharing>`
})
class SyslogSharingHostComponent {
  formControl: FormControl = new FormControl();
}

describe('SysLogSharingComponent', () => {
  let component: SyslogSharingHostComponent;
  let fixture: ComponentFixture<SyslogSharingHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AlertsModule
      ],
      declarations: [
        SyslogSharingComponent,
        SyslogSharingHostComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyslogSharingHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
