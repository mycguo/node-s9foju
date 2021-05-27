import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServiceNowSharingComponent } from './service-now-sharing.component';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AlertsModule } from '../../../../../alerts.module';

@Component({
  template: `
    <nx-service-now-sharing [formControl]="formControl"></nx-service-now-sharing>`
})
class ServiceNowSharingHostComponent {
  formControl: FormControl = new FormControl();
}

describe('ServiceNowSharingComponent', () => {
  let component: ServiceNowSharingHostComponent;
  let fixture: ComponentFixture<ServiceNowSharingHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AlertsModule
      ],
      declarations: [
        ServiceNowSharingComponent,
        ServiceNowSharingHostComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceNowSharingHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
