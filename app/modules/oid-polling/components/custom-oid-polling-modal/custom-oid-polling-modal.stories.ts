import { moduleMetadata } from '@storybook/angular';
import { CustomOidPollingModalComponent } from './custom-oid-polling-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../../../shared/services/dialog/dialog.service';
import { CustomOidPollingSettingsComponent } from '../custom-oid-polling-settings/custom-oid-polling-settings.component';
import { CustomOidPollingDevicesContainer } from '../../containers/custom-oid-polling-devices/custom-oid-polling-devices.container';
import { CustomOidPollingDevicesService } from '../../services/custom-oid-polling/custom-oid-polling-devices.service';
import {
  HttpBackend,
  HttpClient,
  HttpClientModule,
  HttpHandler,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CustomOidPollingDevicesComponent } from '../custom-oid-polling-devices/custom-oid-polling-devices.component';
import { GridModule } from '../../../grid/grid.module';
import {LoggerModule} from '../../../logger/logger.module';

export default {
  title: 'Settings/CustomOidPollingModalComponent',

  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        HttpClientModule,
        LoggerModule,
        GridModule
      ],
      declarations: [
        CustomOidPollingModalComponent,
        CustomOidPollingSettingsComponent,
        CustomOidPollingDevicesContainer,
        CustomOidPollingDevicesComponent
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
        DialogService,
        CustomOidPollingDevicesService,
        HttpClient,
        HttpHandler,
        HttpBackend
      ]
    })
  ]
};

export const InitialState = () => ({
  component: CustomOidPollingModalComponent
});

export const InjectedData = () => ({
  component: CustomOidPollingModalComponent,
  props: {
    data: {
      name: 'Name',
      oidIndex: '.1.2.34',
      processingType: 'DELTA',
      units: 'MHz',
      conversionType: 'DIVIDE',
      conversionFactor: 3
    }
  }
});
