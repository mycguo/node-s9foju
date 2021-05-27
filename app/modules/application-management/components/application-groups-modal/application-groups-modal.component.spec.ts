/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationGroupsModalComponent } from './application-groups-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApplicationManagementModule } from '../../application-management.module';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('ApplicationGroupsModalComponent', () => {
  let component: ApplicationGroupsModalComponent;
  let fixture: ComponentFixture<ApplicationGroupsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        HttpClientTestingModule,
        LoggerTestingModule,
        ApplicationManagementModule
      ],
      declarations: [ ApplicationGroupsModalComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationGroupsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
