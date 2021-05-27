import { moduleMetadata } from '@storybook/angular';
import { ReportsManagementModalComponent } from './reports-management-modal.component';
import { SharedModule } from '../../../shared/shared.module';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogService } from '../../../shared/services/dialog/dialog.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

export default {
  title: 'Settings/ReportsManagementModalComponent',

  decorators: [
    moduleMetadata({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        SharedModule,
        MatDialogModule,
        ReactiveFormsModule
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
      ],
    }),
  ],
};

export const Default = () => ({
  component: ReportsManagementModalComponent,
});

Default.story = {
  name: 'default',
};
