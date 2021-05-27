import { moduleMetadata } from '@storybook/angular';
import { AlertManagementSidebarThresholdConfigFormComponent } from './alert-management-sidebar-threshold-config-form.component';
import NxAlertManagementConfig from '../../../../services/nx-alert-management/models/nx-alert-management-config';
import { ThresholdComponentOption } from '../threshold-component-option.enum';
import { AlertSeverity } from '../../../../services/enums/alert-severity.enum';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../shared/shared.module';
import { AlertManagementSidebarThresholdSingleComponent } from '../alert-management-sidebar-threshold-single/alert-management-sidebar-threshold-single.component';

export default {
  title: 'Alerts/Sidebar/AlertManagementSidebarThresholdConfigFormComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [
        AlertManagementSidebarThresholdConfigFormComponent,
        AlertManagementSidebarThresholdSingleComponent,
      ],
    }),
  ],
};

export const Default = () => ({
  template: `
      <nx-alert-management-sidebar-threshold-config-form
        [(ngModel)]="model"
        [ngModelOptions]="{standalone: true}">
      </nx-alert-management-sidebar-threshold-config-form>`,
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
