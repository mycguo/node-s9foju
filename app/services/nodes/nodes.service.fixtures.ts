import {Node} from './models/node';
import {NodeState} from './enums/node-state.enum';
import {ConformanceStatus} from './enums/conformance-status.enum';
import {PerformanceStatus} from './enums/performance-status.enum';
import {AnalyticsNodeConnection} from './enums/analytics-node-connection.enum';

export class NodesServiceFixtures {
  static readonly NODES: Array<Node> = [
    {
      id: '123',
      name: 'Local/Server',
      ipAddress: 'Local',
      local: true,
      state: NodeState.CONNECTED,
      startTime: new Date(),
      timeZoneId: 'Pacific/Honolulu',
      timeStamp: new Date(),
      specificationsConformanceStatus: ConformanceStatus.FAIL,
      performanceStatus: PerformanceStatus.WARNING,
      analyticsNodeAddress: null,
      analyticsNodeStatus: AnalyticsNodeConnection.UNKNOWN
    }
  ];
}
