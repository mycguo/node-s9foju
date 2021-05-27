import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataManagementContainer } from './data-management.container';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('DataManagementContainer', () => {
  let component: DataManagementContainer;
  let fixture: ComponentFixture<DataManagementContainer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        MatDialogModule
      ],
      declarations: [DataManagementContainer],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataManagementContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
