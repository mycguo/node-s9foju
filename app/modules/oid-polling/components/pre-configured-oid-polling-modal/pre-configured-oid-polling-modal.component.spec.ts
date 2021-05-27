import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreConfiguredOidPollingModalComponent } from './pre-configured-oid-polling-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('PreConfiguredOidPollingModalComponent', () => {
  let component: PreConfiguredOidPollingModalComponent;
  let fixture: ComponentFixture<PreConfiguredOidPollingModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        ReactiveFormsModule,
        MatDialogModule
      ],
      declarations: [ PreConfiguredOidPollingModalComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreConfiguredOidPollingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
