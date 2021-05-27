import { moduleMetadata } from '@storybook/angular';
import { GridModule } from '../../../grid/grid.module';
import { SharedModule } from '../../../shared/shared.module';
import { ApplicationGroupsTableComponent } from './application-groups-table.component';
import ApplicationGroup from '../../models/application-group';

export default {
  title: 'ApplicationManagement/ApplicationGroupsTableComponent',

  decorators: [
    moduleMetadata({
      imports: [SharedModule, GridModule],
      declarations: [ApplicationGroupsTableComponent],
    }),
  ],
};

export const Default = () => ({
  component: ApplicationGroupsTableComponent,
  props: {
    data: <Array<ApplicationGroup>>[
      {
        id: '1',
        name: 'App Group 1',
        applications: [{ name: 'app1' }, { name: 'app2' }],
      },
      {
        id: '2',
        name: 'App Group 2',
        applications: [{ name: 'app3' }, { name: 'app4' }],
      },
    ],
  },
});

Default.story = {
  name: 'default',
};
