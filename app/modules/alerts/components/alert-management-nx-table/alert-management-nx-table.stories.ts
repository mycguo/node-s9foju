import { moduleMetadata } from '@storybook/angular';
import { AlertManagementNxTableComponent } from './alert-management-nx-table.component';
import { SharedModule } from '../../../shared/shared.module';
import { GridModule } from '../../../grid/grid.module';
import { ALERT_CATEGORIES } from '../../services/nx-alert-management/enums/alert-categories.enum';
import { AlertSeverity } from '../../services/enums/alert-severity.enum';

export default {
  title: 'Alerts/AlertManagementNxTableComponent',

  decorators: [
    moduleMetadata({
      imports: [SharedModule, GridModule],
      declarations: [AlertManagementNxTableComponent],
    }),
  ],
};

export const Default = () => ({
  template: `<nx-alert-management-table
                [data]="data"></nx-alert-management-table>`,
  props: {
    data: [
      {
        id: '1',
        name: 'alert 1',
        type: 'alert_type',
        category: ALERT_CATEGORIES.APPLICATION,
        severity: AlertSeverity.CRITICAL,
        enabled: false,
        thresholdString: 'threshold',
        sharingString: 'sharing info',
      },
      {
        id: '1',
        name: 'alert 2',
        type: 'alert_type',
        category: ALERT_CATEGORIES.SYSTEM,
        severity: AlertSeverity.WARNING,
        enabled: true,
        thresholdString: 'threshold',
        sharingString: 'sharing info',
      },
    ],
  },
});

Default.story = {
  name: 'default',
};
