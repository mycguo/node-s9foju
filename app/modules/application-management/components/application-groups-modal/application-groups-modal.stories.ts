import { moduleMetadata } from '@storybook/angular';
import { ApplicationManagementModule } from '../../application-management.module';
import { ApplicationGroupsModalComponent } from './application-groups-modal.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

export default {
  title: 'ApplicationManagement/Application Groups Modal',

  decorators: [
    moduleMetadata({
      imports: [
        ApplicationManagementModule,
        HttpClientTestingModule,
        MatDialogModule,
        SharedModule,
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
    }),
  ],
};

export const AddEditApplicationGroups = () => {
  return {
    component: ApplicationGroupsModalComponent,
  };
};

AddEditApplicationGroups.story = {
  name: 'Add/Edit Application Groups',
};
