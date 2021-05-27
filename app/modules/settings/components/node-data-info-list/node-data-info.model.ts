import {DataManagementNodeConfigRecord} from '../../services/data-management/interfaces/data-management-node-config-record';
import {DataStoreType} from '../../services/data-management/enums/data-store-type.enum';
import { NodeStates } from '../../services/data-management/enums/node-sates.enum';

export class NodeDataInfo {
  id: string;
  name: string;
  freeSpace: number;
  totalSpace: number;
  qosUsage: number;
  flowUsage: number;
  alertUsage: number;
  longTermUsage: number;
  useDefaultSettings: boolean;
  nodeState: NodeStates;

  constructor(
    {
      id,
      name,
      freeSpace,
      totalSpace,
      useDefaultSettings,
      nodeState,
      nodesData,
    }:
      {
        id: string,
        name: string,
        freeSpace?: number,
        totalSpace?: number,
        useDefaultSettings: boolean,
        nodeState: NodeStates;
        nodesData: DataManagementNodeConfigRecord[]
      }
  ) {
    this.id = id;
    this.name = name;
    this.freeSpace = freeSpace;
    this.totalSpace = totalSpace;
    this.qosUsage = nodesData?.find(node => node.dataStoreType === DataStoreType.SNMP)?.dataStoreUsedBytes;
    this.flowUsage = nodesData?.find(node => node.dataStoreType === DataStoreType.FLOW)?.dataStoreUsedBytes;
    this.alertUsage = nodesData?.find(node => node.dataStoreType === DataStoreType.ALERT)?.dataStoreUsedBytes;
    this.longTermUsage = nodesData?.find(node => node.dataStoreType === DataStoreType.LONG_TERM)?.dataStoreUsedBytes;
    this.useDefaultSettings = useDefaultSettings;
    this.nodeState = nodeState;
  }
}
