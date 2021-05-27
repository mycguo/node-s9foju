import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../../shared/shared.module';
import { GridModule } from '../../../grid/grid.module';
import { CustomApplicationsTableComponent } from './custom-applications-table.component';
import CustomApplicationModel from '../../models/custom-application-model';

export default {
  title: 'ApplicationManagement/CustomApplicationsTableComponent',

  decorators: [
    moduleMetadata({
      imports: [SharedModule, GridModule],
      declarations: [CustomApplicationsTableComponent],
    }),
  ],
};

export const Default = () => ({
  component: CustomApplicationsTableComponent,
  props: {
    data: <CustomApplicationModel[]>(<unknown>[
      new CustomApplicationModel({
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
      new CustomApplicationModel({
        id: 'qwerqret',
        rank: 2,
        name: 'Asia',
        description: 'Description asia',
        ipRanges: ['10.1.1.2'],
        portMap: {
          protocols: ['TCP'],
          portRanges: ['3434', '2424'],
        },
        nbarIds: [],
      }),
      new CustomApplicationModel({
        id: 'zxcvzxvc',
        rank: 3,
        name: 'Europe',
        description: 'Description Europe',
        ipRanges: ['10.1.1.2'],
        portMap: {
          protocols: ['UDP'],
          portRanges: ['3434', '2424'],
        },
        nbarIds: [],
      }),
    ]),
  },
});

Default.story = {
  name: 'default',
};
