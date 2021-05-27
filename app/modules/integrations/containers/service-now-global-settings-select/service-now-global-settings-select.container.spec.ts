import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServiceNowGlobalSettingsSelectContainer } from './service-now-global-settings-select.container';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

@Component({
  template: `<nx-service-now-global-settings-select-container [formControl]="formControl"></nx-service-now-global-settings-select-container>`
})
class ServiceNowGlobalSettingsSelectHostContainer {
  formControl: FormControl = new FormControl();
}

describe('ServiceNowGlobalSettingsSelectContainer', () => {
  let component: ServiceNowGlobalSettingsSelectHostContainer;
  let fixture: ComponentFixture<ServiceNowGlobalSettingsSelectHostContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      declarations: [
        ServiceNowGlobalSettingsSelectContainer,
        ServiceNowGlobalSettingsSelectHostContainer
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceNowGlobalSettingsSelectHostContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
