import { moduleMetadata } from '@storybook/angular';
import { CustomApplicationsModalComponent } from './custom-applications-modal.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ApplicationManagementModule } from '../../application-management.module';
import { SharedModule } from '../../../shared/shared.module';
import CustomApplicationModel from '../../models/custom-application-model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

export default {
  title: 'ApplicationManagement/Custom Applications Modal',

  decorators: [
    moduleMetadata({
      imports: [
        ApplicationManagementModule,
        MatDialogModule,
        HttpClientTestingModule,
        SharedModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            mode: 'Add',
            application: new CustomApplicationModel({
              id: 'asdfas',
              rank: 1,
              name: 'Africa',
              description: 'Description',
              ipRanges: ['10.1.1.1'],
              portMap: {
                protocols: ['ICMP'],
                portRanges: ['3434', '2424'],
              },
              nbarIds: [],
            }),
          },
        },
      ],
    }),
  ],
};

export const AddEditCustomApplication = () => ({
  component: CustomApplicationsModalComponent,
  props: {},
});

AddEditCustomApplication.story = {
  name: 'Add/Edit Custom Application',
};
