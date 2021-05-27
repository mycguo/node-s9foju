import { NodeDataInfoDiskStorageCapacityLegendPipe } from './pipes/node-data-info-disk-storage-capacity-legend/node-data-info-disk-storage-capacity-legend.pipe';
import { DiskStorageCapacityComponent } from '../disk-storage-capacity/disk-storage-capacity.component';
import { ByteFormattingPipe } from '../../../shared/pipes/byte-formatting/byte-formatting.pipe';
import { NodeDataInfoListComponent } from './node-data-info-list.component';
import { NodeDataInfo } from './node-data-info.model';
import { moduleMetadata } from '@storybook/angular';
import { MatListModule } from '@angular/material/list';
import { Component } from '@angular/core';
import { NodeStates } from '../../services/data-management/enums/node-sates.enum';

@Component({
  template: `
    <div
      class="nx-data-store-management-container"
      style="display: flex; height: 90vh; box-shadow: 0 2px 6px rgba(53, 64, 83, 0.06), 0 1px 3px rgba(53, 64, 83, 0.06), 0 0 2px rgba(53, 64, 83, 0.1)"
    >
      <nx-node-data-info-list
        [nodeDataInfoList]="nodeDataInfoList"
        (nodeSelect)="nodeSelect($event)"
      ></nx-node-data-info-list>
      <div
        class="nx-node-data-store-settings-container"
        style="flex-shrink: 0; height: 100%; width: 50%; overflow-y: auto"
      >
        {{ selectedNodeId }}
      </div>
    </div>
  `,
})
// @ts-ignore
class NodeDataInfoListStories {
  selectedNodeId: string;
  nodeDataInfoList: NodeDataInfo[];

  constructor() {
    this.nodeDataInfoList = [
      {
        name: 'Local Node',
        id: 'local',
        freeSpace: 992,
        totalSpace: 1000,
        qosUsage: 2,
        flowUsage: 2,
        alertUsage: 2,
        longTermUsage: 2,
        useDefaultSettings: true,
        nodeState: NodeStates.DISCONNECTED,
      },
      {
        name: 'Node 2',
        id: 'node2',
        freeSpace: 992,
        totalSpace: 1000,
        qosUsage: 2,
        flowUsage: 2,
        alertUsage: 2,
        longTermUsage: 2,
        useDefaultSettings: false,
        nodeState: NodeStates.CONNECTED,
      },
    ];
  }

  nodeSelect(id: string) {
    this.selectedNodeId = id;
  }
}

export default {
  title: 'Settings/Data Store/Node Data Info List',

  decorators: [
    moduleMetadata({
      imports: [MatListModule],
      declarations: [
        NodeDataInfoListStories,
        NodeDataInfoListComponent,
        DiskStorageCapacityComponent,
        NodeDataInfoDiskStorageCapacityLegendPipe,
        ByteFormattingPipe,
      ],
    }),
  ],
};

export const Base = () => ({
  component: NodeDataInfoListStories,
});
