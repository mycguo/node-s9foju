import { moduleMetadata } from '@storybook/angular';
import { AlertManagementSidebarThresholdSingleComponent } from './alert-management-sidebar-threshold-single.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../shared/shared.module';
import { ThresholdComponentOption } from '../threshold-component-option.enum';
import { AlertSeverity } from '../../../../services/enums/alert-severity.enum';
import NxAlertManagementConfig from '../../../../services/nx-alert-management/models/nx-alert-management-config';

export default {
  title: 'Alerts/Sidebar/AlertManagementSidebarThresholdSingleComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [AlertManagementSidebarThresholdSingleComponent],
    }),
  ],
};

export const Default = () => ({
  template: `
      <nx-alert-management-sidebar-threshold-single
        [(ngModel)]="model"
        [ngModelOptions]="{standalone: true}">
       </nx-alert-management-sidebar-threshold-single>
    `,
  props: {
    model: {
      thresholdComponent: ThresholdComponentOption.DEFAULT,
      thresholds: [
        {
          severity: AlertSeverity.CRITICAL,
          label: 'label',
          value: 10,
          units: '%',
          comparator: '>',
        },
      ],
      timeOverMinutes: 0,
    } as NxAlertManagementConfig,
  },
});

Default.story = {
  name: 'default',
};

export const NoThreshold = () => ({
  template: `
      <nx-alert-management-sidebar-threshold-single
        [(ngModel)]="model"
        [ngModelOptions]="{standalone: true}">
       </nx-alert-management-sidebar-threshold-single>
    `,
  props: {
    model: {
      thresholdComponent: ThresholdComponentOption.DEFAULT,
      thresholds: [],
      timeOverMinutes: 2,
    } as NxAlertManagementConfig,
  },
});
