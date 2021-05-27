import PeekDrilldownRequest from '../../../../../../project_typings/client/nxComponents/laFlowPathAnalysis/PeekDrilldownRequest';
import PeekDrilldownLinkInfoTypeEnum from '../../../../../../project_typings/client/nxComponents/laFlowPathAnalysis/PeekDrilldownLinkInfoTypeEnum';
import PeekDevice from '../models/peek-device';
import LaSourceInfoTypesEnum from '../../../../../../client/laCommon/constants/laSourceInfoTypes.constant';
import { NodesServiceFixtures } from '../../../services/nodes/nodes.service.fixtures';

export class PeekDevicesServiceFixtures {
  static readonly DRILLDOWN: PeekDrilldownRequest = {
    linkInfoType: PeekDrilldownLinkInfoTypeEnum.DIRECTIONAL,
    linkInfo: {
      endTime: 1600413600000
    }
  };

  static readonly DEVICES_RESPONSE = [
    {
      serial: '9IZTDXZLD6A',
      address: '10.1.2.155',
      systemName: 'LiveWire',
      hostName: 'LiveWire',
      nodeId: '123',
      site: 'Omni',
      tags: [
        'omnipliance'
      ],
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
          filter: '(addr(type:ip, addr1:192.168.100.100, addr2:192.168.105.100, dir:1to2))&(port(port1:80, port2:59894, dir:1to2))&(pspec(tcp))',
        }
      }
    }
  ];

  static readonly PEEK_DEVICES = [
    new PeekDevice({
      id: PeekDevicesServiceFixtures.DEVICES_RESPONSE[0].serial,
      hostName: PeekDevicesServiceFixtures.DEVICES_RESPONSE[0].hostName,
      linkInfo: PeekDevicesServiceFixtures.DEVICES_RESPONSE[0].linkInfo,
      address: PeekDevicesServiceFixtures.DEVICES_RESPONSE[0].address,
      nodeId: PeekDevicesServiceFixtures.DEVICES_RESPONSE[0].nodeId,
      site: PeekDevicesServiceFixtures.DEVICES_RESPONSE[0].site,
      tags: PeekDevicesServiceFixtures.DEVICES_RESPONSE[0].tags,
      nodes: NodesServiceFixtures.NODES
    })
  ];

  static readonly ERROR_RESPONSE = {status: 500, statusText: 'Server Error'};
}
