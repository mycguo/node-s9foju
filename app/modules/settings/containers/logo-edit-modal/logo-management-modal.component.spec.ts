import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ReactiveFormsModule} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { LogoManagementModalContainer } from './logo-management-modal.container';
import {LogoManagementModalComponent} from '../../components/logo-management-modal/logo-management-modal.component';
import {LogosListComponent} from '../../components/logos-list/logos-list.component';
import {SharedModule} from '../../../shared/shared.module';
import {ByteFormattingPipe} from '../../../shared/pipes/byte-formatting/byte-formatting.pipe';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('LogoManagementModalContainer', () => {
  let component: LogoManagementModalContainer;
  let fixture: ComponentFixture<LogoManagementModalContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        ReactiveFormsModule,
        SharedModule
      ],
      declarations: [
        LogoManagementModalContainer,
        LogoManagementModalComponent,
        LogosListComponent
      ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: []},
        ByteFormattingPipe
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoManagementModalContainer);
    component = fixture.componentInstance;
    component.data = {
      id: 'id',
      name: 'name',
      titleText: 'title text',
      lastLogoUpdateTime: 2,
      logosConfig: {
        limit: 1,
        fileSize: 1,
        fileTypes: ['png'],
        ratio: {
          width: 1,
          height: 1
        }
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
