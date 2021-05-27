import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsManagementModalComponent } from './reports-management-modal.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from '../../../logger/logger-testing/logger-testing.module';

describe('ReportsManagementModalComponent', () => {
  let component: ReportsManagementModalComponent;
  let fixture: ComponentFixture<ReportsManagementModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      declarations: [ReportsManagementModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
