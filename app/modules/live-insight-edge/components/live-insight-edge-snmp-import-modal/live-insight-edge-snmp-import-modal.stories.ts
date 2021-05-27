import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../../shared/shared.module';
import { LiveInsightEdgeSnmpImportModalComponent } from './live-insight-edge-snmp-import-modal.component';

export default {
  title: 'LiveInsightEdge/LiveInsightEdgeSnmpImportModalComponent',

  decorators: [
    moduleMetadata({
      imports: [MatDialogModule, SharedModule, ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
      ],
    }),
  ],
};

export const Default = () => ({
  component: LiveInsightEdgeSnmpImportModalComponent,
});

Default.story = {
  name: 'default',
};
