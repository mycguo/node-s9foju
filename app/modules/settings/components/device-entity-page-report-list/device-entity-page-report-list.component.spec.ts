import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DeviceEntityPageReportListComponent} from './device-entity-page-report-list.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeviceEntityPageFormComponent } from '../device-entity-page-form/device-entity-page-form.component';
import { SettingsModule } from '../../settings.module';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

@Component({
  template: `
    <nx-device-entity-page-report-list [formControl]="formControl"></nx-device-entity-page-report-list>`
})
class DeviceEntityPageReportListHostComponent {
  formControl: FormControl = new FormControl();
}

describe('DeviceEntityPageReportListComponent', () => {
  let component: DeviceEntityPageReportListHostComponent;
  let fixture: ComponentFixture<DeviceEntityPageReportListHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SettingsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      declarations: [
        DeviceEntityPageReportListComponent,
        DeviceEntityPageReportListHostComponent,
        DeviceEntityPageFormComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceEntityPageReportListHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
