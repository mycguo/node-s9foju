import { moduleMetadata } from '@storybook/angular';
import { CustomOidPollingPageComponent } from './custom-oid-polling-page.component';
import { SharedModule } from '../../../shared/shared.module';
import { GridModule } from '../../../grid/grid.module';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';

const OID_LIST = [
  {
    id: 'c69a63a5-fdc6-4ae0-bf5c-22552f06ceca',
    name: '1testOID',
    oidValue: '.1.3.6.1.4.1.9.9.109.1.1.1.1.7.7',
    units: '%',
    processingType: 'DELTA',
    conversionType: 'MULTIPLY',
    conversionFactor: 1,
    associationType: 'SPECIFIC_DEVICES',
    association: {
      deviceSerials: ['FLM2053W1KK'],
    },
    processingTypeString: 'delta',
    deviceNamesString: '4331-HE-14',
  },
  {
    id: '444aad7c-0fbd-4ac9-bef0-c4e28e7f1c14',
    name: 'TestOID_2',
    oidValue: '.1.3.6.1.4.1.9.9.109.1.1.1.1.7.7',
    units: 'GHz',
    processingType: 'RATE',
    conversionType: 'MULTIPLY',
    conversionFactor: 1,
    associationType: 'SPECIFIC_DEVICES',
    association: {
      deviceSerials: ['FLM2053W1KK'],
    },
    processingTypeString: 'multiply',
    deviceNamesString: '4331-HE-14',
  },
];

export default {
  title: 'Settings/CustomOidPollingPageComponent',

  decorators: [
    moduleMetadata({
      imports: [SharedModule, GridModule],
    }),
  ],
};

export const Default = () => ({
  component: CustomOidPollingPageComponent,
  props: {
    data: OID_LIST,
    statusBarData: <GridStatusBar>{
      allRows: 2,
      filteredRows: 2,
      selectedRows: null,
    },
  },
});

Default.story = {
  name: 'default',
};
