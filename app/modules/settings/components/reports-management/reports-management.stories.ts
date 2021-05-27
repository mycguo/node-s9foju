import { moduleMetadata } from '@storybook/angular';
import { ReportsManagementComponent } from './reports-management.component';
import { SharedModule } from '../../../shared/shared.module';
import { GridModule } from '../../../grid/grid.module';
import ReportsManagementServiceFixtures from '../../services/reports-management/reports-management.service.fixtures';

export default {
  title: 'Settings/ReportsManagementComponent',

  decorators: [
    moduleMetadata({
      imports: [SharedModule, GridModule],
    }),
  ],
};

export const Default = () => ({
  component: ReportsManagementComponent,
  props: {
    data: ReportsManagementServiceFixtures.REPORTS_LIST_MOCK,
  },
});

Default.story = {
  name: 'default',
};
