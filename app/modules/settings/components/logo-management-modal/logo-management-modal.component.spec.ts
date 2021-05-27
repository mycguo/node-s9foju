import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {LogoManagementModalComponent} from './logo-management-modal.component';
import {SharedModule} from '../../../shared/shared.module';
import LogoManagementModalDataInterface from './logo-management-modal-data.interface';
import {FormValidationService} from '../../../../services/form-validation/form-validation.service';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

const data: LogoManagementModalDataInterface = {
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

describe('LogoManagementModalComponent', () => {
  let component: LogoManagementModalComponent;
  let fixture: ComponentFixture<LogoManagementModalComponent>;
  let formValidation: FormValidationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        ReactiveFormsModule,
        LoggerTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [
        LogoManagementModalComponent
      ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: []}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoManagementModalComponent);
    formValidation = fixture.debugElement.injector.get(FormValidationService);
    component = fixture.componentInstance;
    component.data = data;
  });

  describe('onInit', () => {
    let testFixture: ComponentFixture<LogoManagementModalComponent>;
    let testComp: LogoManagementModalComponent;

    beforeEach(() => {
      testFixture = TestBed.createComponent(LogoManagementModalComponent);
      formValidation = testFixture.debugElement.injector.get(FormValidationService);
      testComp = testFixture.componentInstance;
    });

    it('should set the preview state URL', waitForAsync(() => {
      testComp.data = Object.create(data);
      testFixture.detectChanges();
      expect(testComp.state.previewUrl).toBe('/api/nx-no-auth/logos/id/file?2');
    }));

    it('should set the preview URL', () => {
      const setImagePreviewUrlSpy = spyOn(testComp, 'setImagePreviewUrl');
      setImagePreviewUrlSpy.and.returnValue(cold('---x|', void 0));
      testComp.data = Object.create(data);
      testComp.data.file = new File(new Array<Blob>(), 'test-file.jpg');
      testFixture.detectChanges();

      getTestScheduler().flush();

      testFixture.detectChanges();

      expect(testComp.setImagePreviewUrl).toHaveBeenCalledWith(testComp.data.file);
    });
  });

  describe('onClose', () => {
    it('should emit on the close event', () => {
      spyOn(component.close, 'emit');
      component.onClose();
      fixture.detectChanges();
      expect(component.close.emit).toHaveBeenCalled();
    });
  });

  describe('onSave', () => {
    it('should emit value on save', (done) => {
      let logoData: LogoManagementModalDataInterface;

      component.save.subscribe((modalData) => {
        logoData = modalData;
        expect(logoData).toBeTruthy();
        done();
      });

      // ngOnInit
      fixture.detectChanges();

      component.onSave();

    });
  });

  describe('setImagePreviewUrl', () => {
    it('should set the previewUrl from the file', waitForAsync(() => {
      const file = new File(new Array<Blob>(), 'test-file.jpg');
      component.setImagePreviewUrl(file);
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(component.state.previewUrl).not.toBeUndefined();
        });
    }));
  });
});
