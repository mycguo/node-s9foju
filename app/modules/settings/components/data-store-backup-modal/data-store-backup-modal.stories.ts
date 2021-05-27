import { DataStoreBackupModalComponent } from './data-store-backup-modal.component';
import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../../shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

export default {
  title: 'Settings/DataStoreBackupModalComponent',
  decorators: [
    moduleMetadata({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        ReactiveFormsModule,
        MatDialogModule,
        SharedModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            mode: 'Add',
          },
        },
      ],
    })
  ]
};

export const Default = () => ({
  component: DataStoreBackupModalComponent,
});

Default.story = {
  name: 'default',
};
