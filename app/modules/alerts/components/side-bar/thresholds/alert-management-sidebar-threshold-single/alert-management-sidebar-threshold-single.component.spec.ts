import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {AlertManagementSidebarThresholdSingleComponent} from './alert-management-sidebar-threshold-single.component';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AlertsModule } from '../../../../alerts.module';

@Component({
  template: `
    <nx-alert-management-sidebar-threshold-single [formControl]="formControl"></nx-alert-management-sidebar-threshold-single>`
})
class AlertManagementSidebarThresholdSingleHostComponent {
  formControl: FormControl = new FormControl();
}

describe('AlertManagementSidebarThresholdSingleComponent', () => {
  let component: AlertManagementSidebarThresholdSingleHostComponent;
  let fixture: ComponentFixture<AlertManagementSidebarThresholdSingleHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AlertsModule
      ],
      declarations: [ AlertManagementSidebarThresholdSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertManagementSidebarThresholdSingleHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
