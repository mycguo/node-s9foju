import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {CustomLogoConfigurationComponent} from './custom-logo-configuration.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import Logo from '../../services/logos/models/logo';
import {MockComponent} from 'ng-mocks';
import {CardComponent} from '../../../shared/components/card/card.component';
import {FileUploaderComponent} from '../../../shared/components/form/file-uploader/file-uploader.component';
import {LogosListComponent} from '../logos-list/logos-list.component';
import {SimpleAlertComponent} from '../../../shared/components/simple-alert/simple-alert.component';
import {ByteFormattingPipe} from '../../../shared/pipes/byte-formatting/byte-formatting.pipe';
import {ReactiveFormsModule} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import LogosConfiguration from '../../services/logos/models/logos-configuration';
import {LogoManagementModalContainer} from '../../containers/logo-edit-modal/logo-management-modal.container';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

// fixtures
const logo: Logo = {id: '123', name: 'name', lastLogoUpdateTime: 11223344};


describe('CustomLogoConfigurationComponent', () => {
  let component: CustomLogoConfigurationComponent;
  let fixture: ComponentFixture<CustomLogoConfigurationComponent>;
  const logoConfig: LogosConfiguration = {
    limit: 10,
    fileSize: 1024,
    fileTypes: ['.jpg'],
    ratio: {
      width: 10,
      height: 5
    }
  };
  beforeEach(waitForAsync(() => {
    const logoManagementModalContainer = MockComponent(LogoManagementModalContainer);

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatDialogModule,
        LoggerTestingModule
      ],
      declarations: [
        CustomLogoConfigurationComponent,
        ByteFormattingPipe,
        MockComponent(CardComponent),
        MockComponent(FileUploaderComponent),
        MockComponent(SimpleAlertComponent),
        MockComponent(LogosListComponent),
        // logoManagementModalContainer
      ]
    })
      // .overrideModule(BrowserDynamicTestingModule, {
      //   set: {
      //     entryComponents: [logoManagementModalContainer]
      //   }
      // })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomLogoConfigurationComponent);
    component = fixture.componentInstance;
    component.logos = [logo];
    component.logosConfig = logoConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openEditModal', () => {
    it('should not open the modal if no logo is provided', () => {
      spyOn(component, 'openModal').and.returnValue(void 0);
      component.openEditModal(void 0);
      expect(component.openModal).not.toHaveBeenCalled();
    });

    it('should call openModal', () => {
      spyOn(component, 'openModal').and.returnValue(void 0);
      component.openEditModal(logo);
      expect(component.openModal).toHaveBeenCalledWith(logo.id, logo.name, void 0, logo.lastLogoUpdateTime);
    });
  });

  describe('deleteLogo', () => {
    it('should not emit if no logo if provided', () => {
      spyOn(component.delete, 'emit');
      component.deleteLogo(void 0);
      expect(component.delete.emit).not.toHaveBeenCalled();
    });

    it('should call openModal', () => {
      spyOn(component.delete, 'emit');
      component.deleteLogo(logo);
      expect(component.delete.emit).toHaveBeenCalledWith(logo);
    });
  });

  describe('selectLogo', () => {
    it('should emit the selected logo if null', () => {
      spyOn(component.defaultLogo, 'emit');
      component.selectLogo(void 0);
      expect(component.defaultLogo.emit).toHaveBeenCalledWith(void 0);
    });

    it('should emit the selected logo ID', () => {
      spyOn(component.defaultLogo, 'emit');
      component.selectLogo(logo);
      expect(component.defaultLogo.emit).toHaveBeenCalledWith(logo.id);
    });
  });

  describe('openModal', () => {
    // it('should open the dialog', () => {
    //   spyOn(component.dialog, 'open').and.callThrough();
    //   component.openModal(logo.id, logo.name);
    //   expect(component.dialog.open).toHaveBeenCalled();
    // });
  });
});
