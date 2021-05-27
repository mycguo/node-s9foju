import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';

import {ServiceNowAlertOptionsComponent} from './service-now-alert-options.component';
import {SharedModule} from '../../../../../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../../../../logger/logger-testing/logger-testing.module';

describe('ServiceNowAlertOptionsComponent', () => {
  let component: ServiceNowAlertOptionsComponent;
  let fixture: ComponentFixture<ServiceNowAlertOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      declarations: [
        ServiceNowAlertOptionsComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceNowAlertOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
