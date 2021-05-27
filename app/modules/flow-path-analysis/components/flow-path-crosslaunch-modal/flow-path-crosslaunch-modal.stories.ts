import { moduleMetadata } from '@storybook/angular';
import { FlowPathCrosslaunchModalComponent } from './flow-path-crosslaunch-modal.component';
import { SharedModule } from '../../../shared/shared.module';
import { GridModule } from '../../../grid/grid.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FlowPathCrosslaunchTableComponent } from '../flow-path-crosslaunch-table/flow-path-crosslaunch-table.component';
import PeekDevice from '../../models/peek-device';
import { Node } from '../../../../services/nodes/models/node';
import LaSourceInfoTypesEnum from '../../../../../../../client/laCommon/constants/laSourceInfoTypes.constant';
import { FilterModule } from '../../../filter/filter.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

export default {
  title: 'Flow-path-analysis/FlowPathCrosslaunchModalComponent',

  decorators: [
    moduleMetadata({
      imports: [
        SharedModule,
        GridModule,
        MatDialogModule,
        FilterModule,
        HttpClientTestingModule,
        LoggerTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [
        FlowPathCrosslaunchModalComponent,
        FlowPathCrosslaunchTableComponent,
      ],
    }),
  ],
};

export const Default = () => ({
  component: FlowPathCrosslaunchModalComponent,
  props: {
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
              '(addr(type:ip, addr1:192.168.100.100, addr2:192.168.105.100, dir:1to2))&(port(port1:80, port2:59894, dir:1to2))&(pspec(tcp))',
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
              '(addr(type:ip, addr1:192.168.100.100, addr2:192.168.105.100, dir:1to2))&(port(port1:80, port2:59894, dir:1to2))&(pspec(tcp))',
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
              '(addr(type:ip, addr1:192.168.100.100, addr2:192.168.105.100, dir:1to2))&(port(port1:80, port2:59894, dir:1to2))&(pspec(tcp))',
          },
        },
        address: '10.1.40.3',
        nodeId: '1234-5678',
        nodes: <Node[]>[{ id: '1234-5678', name: 'Local' }],
        site: 'Constellation',
        tags: null,
      }),
    ],
    crosslaunchData: [
      { key: 'Time', value: '18 Sep 2020, 25:75PM' },
      { key: 'Src IP', value: '257.428.976.555' },
      { key: 'Src port', value: '65536' },
      { key: 'Protocol', value: 'SNAFU' },
    ],
    highlightIds: ['2'],
    statusBarData: {
      allRows: 3,
    },
  },
});

Default.story = {
  name: 'default',
};
