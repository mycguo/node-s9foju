import { moduleMetadata } from '@storybook/angular';
import { AlertManagementSidebarThresholdMultipleComponent } from './alert-management-sidebar-threshold-multiple.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../shared/shared.module';
import { ThresholdComponentOption } from '../threshold-component-option.enum';
import { AlertSeverity } from '../../../../services/enums/alert-severity.enum';
import NxAlertManagementConfig from '../../../../services/nx-alert-management/models/nx-alert-management-config';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Alerts/Sidebar/AlertManagementSidebarThresholdMultipleComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [AlertManagementSidebarThresholdMultipleComponent],
    }),
  ],
};

export const Default = () => ({
  template: `
      <nx-alert-management-sidebar-threshold-multiple
        [(ngModel)]="model"
        [ngModelOptions]="{standalone: true}"
        (ngModelChange)="modelChanged($event)">
       </nx-alert-management-sidebar-threshold-multiple>
    `,
  props: {
    model: {
      thresholdComponent: ThresholdComponentOption.MULTIPLE,
      thresholds: [
        {
          severity: AlertSeverity.CRITICAL,
          label: 'threshold 1',
          value: 10,
          units: '%',
          comparator: '>',
          timeOverMinutes: 15,
        },
        {
          severity: AlertSeverity.CRITICAL,
          label: 'threshold 2',
          value: 20,
          units: 'ms',
          comparator: '>',
          timeOverMinutes: 25,
        },
      ],
    } as NxAlertManagementConfig,
    modelChanged: (changedVal: NxAlertManagementConfig) => {
      action('model')(JSON.stringify(changedVal));
    },
  },
});

Default.story = {
  name: 'default',
};
