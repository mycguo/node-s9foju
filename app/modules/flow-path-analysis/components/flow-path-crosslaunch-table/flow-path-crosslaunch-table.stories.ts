import { moduleMetadata } from '@storybook/angular';
import { FlowPathCrosslaunchTableComponent } from './flow-path-crosslaunch-table.component';
import { SharedModule } from '../../../shared/shared.module';
import { GridModule } from '../../../grid/grid.module';
import { Node } from '../../../../services/nodes/models/node';
import PeekDevice from '../../models/peek-device';
import LaSourceInfoTypesEnum from '../../../../../../../client/laCommon/constants/laSourceInfoTypes.constant';
import { FilterModule } from '../../../filter/filter.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from '../../../logger/logger-testing/logger-testing.module';
import LaFilterSupportEnums from '../../../../../../../project_typings/enums/laFilterSupportEnums';
import { FilterValue } from '../../../filter/interfaces/filter-value';

export default {
  title: 'Flow-path-analysis/FlowPathCrosslaunchTableComponent',

  decorators: [
    moduleMetadata({
      imports: [
        SharedModule,
        GridModule,
        FilterModule,
        HttpClientTestingModule,
        LoggerTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [FlowPathCrosslaunchTableComponent],
    }),
  ],
};

export const Default = () => ({
  component: FlowPathCrosslaunchTableComponent,
  props: {
    highlightIds: ['1'],
    filterOptions: [
      LaFilterSupportEnums.SITE,
      LaFilterSupportEnums.TAG,
      LaFilterSupportEnums.REGION
    ],
    flexFilters: <FilterValue>{
      [LaFilterSupportEnums.SITE]: ['Berlin']
    },
    data: <PeekDevice[]>[
      new PeekDevice({
        id: '1',
        hostName: 'deviceName 1',
        linkInfo: {
          type: LaSourceInfoTypesEnum.OMNI_PEEK,
          label: 'Packet Inspection',
          displayValue: 'Peek',
          rawValue: {
            name: 'OmniPeek Web',
            host: '10.1.2.155',
            path: '/omnipeek/forensics',
            startTime: '2020-09-16T07:05:00.000Z',
            endTime: '2020-09-16T07:10:00.000Z',
            filter:
              '(addr(type:ip, addr1:192.168.100.100, addr2:192.168.105.100, dir:1to2))&' +
              '(port(port1:80, port2:59894, dir:1to2))&(pspec(tcp))',
          },
        },
        address: '10.1.40.1',
        nodeId: '1234-5678',
        nodes: <Node[]>[{ id: '1234-5678', name: 'Local' }],
        site: 'LondonEdge',
        tags: ['tag1, tag2'],
      }),
      new PeekDevice({
        id: '2',
        hostName: 'deviceName 2',
        linkInfo: {
          type: LaSourceInfoTypesEnum.OMNI_PEEK,
          label: 'Packet Inspection',
          displayValue: 'Peek',
          rawValue: {
            name: 'OmniPeek Web',
            host: '10.1.2.155',
            path: '/omnipeek/forensics',
            startTime: '2020-09-16T07:05:00.000Z',
            endTime: '2020-09-16T07:10:00.000Z',
            filter:
              '(addr(type:ip, addr1:192.168.100.100, addr2:192.168.105.100, dir:1to2))&' +
              '(port(port1:80, port2:59894, dir:1to2))&(pspec(tcp))',
          },
        },
        address: '10.1.40.2',
        nodeId: '1234-5678',
        nodes: <Node[]>[{ id: '1234-5678', name: 'Local' }],
        site: 'TexasEdge',
        tags: ['tag2, tag3'],
      }),
      new PeekDevice({
        id: '3',
        hostName: 'deviceName 3',
        linkInfo: {
          type: LaSourceInfoTypesEnum.OMNI_PEEK,
          label: 'Packet Inspection',
          displayValue: 'Peek',
          rawValue: {
            name: 'OmniPeek Web',
            host: '10.1.2.155',
            path: '/omnipeek/forensics',
            startTime: '2020-09-16T07:05:00.000Z',
            endTime: '2020-09-16T07:10:00.000Z',
            filter:
              '(addr(type:ip, addr1:192.168.100.100, addr2:192.168.105.100, dir:1to2))&' +
              '(port(port1:80, port2:59894, dir:1to2))&(pspec(tcp))',
          },
        },
        address: '10.1.40.3',
        nodeId: '1234-5678',
        nodes: <Node[]>[{ id: '1234-5678', name: 'Local' }],
        site: 'Constellation',
        tags: null,
      }),
    ],
  },
});

Default.story = {
  name: 'default',
};
