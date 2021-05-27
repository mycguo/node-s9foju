import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceNowAlertOptionsDowngradeContainer } from './service-now-alert-options-downgrade.container';
import {SharedModule} from '../../../modules/shared/shared.module';
import {ServiceNowAlertOptionsComponent} from '../../../modules/alerts/components/side-bar/sharing/service-now/service-now-alert-options/service-now-alert-options.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ServiceNowAlertOptionsContainer} from '../../../modules/alerts/containers/side-bar/sharing/service-now-alert-options/service-now-alert-options.container';
import {LoggerTestingModule} from '../../../modules/logger/logger-testing/logger-testing.module';

describe('ServiceNowDowngradeComponent', () => {
  let component: ServiceNowAlertOptionsDowngradeContainer;
  let fixture: ComponentFixture<ServiceNowAlertOptionsDowngradeContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        ServiceNowAlertOptionsDowngradeContainer,
        ServiceNowAlertOptionsContainer,
        ServiceNowAlertOptionsComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceNowAlertOptionsDowngradeContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
