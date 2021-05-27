import {AlertIdentifierResponse} from './models/alert-identifier-response';
import {ALERT_CATEGORIES} from '../nx-alert-management/enums/alert-categories.enum';
import {AlertSeverity} from '../enums/alert-severity.enum';
import {AlertIdentifierRequest} from './models/alert-identifier-request';

export class AlertIdentifiersServiceFixtures {
  static IDENTIFIERS: Array<AlertIdentifierResponse> = [
    {
      'id': '55979f07-96f8-495d-9af3-9394e587cb8f',
      'name': 'WAN Interface Utilization',
      'type': 'INTERFACE_UTILIZATION',
      'category': ALERT_CATEGORIES.DEVICE_INTERFACE,
      'enabled': false,
      'rank': -1,
      'useDefaultSharingConfig': true,
      'instanceName': 'Default Instance',
      'config': {
        'thresholds': [{
          'enabled': true,
          'severity': AlertSeverity.CRITICAL,
          'value': 75.0
        }, {
          'enabled': true,
          'severity': AlertSeverity.WARNING,
          'value': 50.0
        }, {
          'enabled': true,
          'severity': AlertSeverity.INFO,
          'value': 40.0
        }],
        'timeOverMinutes': 15
      },
      'severity': AlertSeverity.MULTIPLE,
      'courierIds': [],
      'coolDownMinutes': 5,
    },
    {
      'id': '1f80ad52-88ea-40a2-af6b-acc24316d98f',
      'name': 'WAN Interface Utilization',
      'type': 'INTERFACE_UTILIZATION',
      'category': ALERT_CATEGORIES.DEVICE_INTERFACE,
      'enabled': true,
      'rank': 1,
      'useDefaultSharingConfig': false,
      'instanceName': 'New Alert',
      'config': {
        'thresholds': [{
          'enabled': true,
          'severity': AlertSeverity.CRITICAL,
          'value': 75.0
        }, {
          'enabled': true,
          'severity': AlertSeverity.WARNING,
          'value': 50.0
        }, {
          'enabled': true,
          'severity': AlertSeverity.INFO,
          'value': 40.0
        }],
        'filter': {
          'flexString': 'site=Beijing'
        },
        'timeOverMinutes': 15
      },
      'severity': AlertSeverity.MULTIPLE,
      'courierIds': [],
      'coolDownMinutes': 5
    },
    {
      'id': '5f6fe80e-0ad0-43ca-8709-e5ba74264c4f',
      'name': 'WAN Interface Utilization',
      'type': 'INTERFACE_UTILIZATION',
      'category': ALERT_CATEGORIES.DEVICE_INTERFACE,
      'enabled': true,
      'rank': 2,
      'useDefaultSharingConfig': true,
      'instanceName': 'New Alert (1)',
      'config': {
        'thresholds': [{
          'enabled': true,
          'severity': AlertSeverity.CRITICAL,
          'value': 75.0
        }, {
          'enabled': true,
          'severity': AlertSeverity.WARNING,
          'value': 50.0
        }, {
          'enabled': true,
          'severity': AlertSeverity.INFO,
          'value': 40.0
        }],
        'filter': {
          'flexString': 'site=CompusSite'
        },
        'timeOverMinutes': 15
      },
      'severity': AlertSeverity.MULTIPLE,
      'courierIds': [],
      'coolDownMinutes': 5
    },
    {
      'id': 'de69c716-ebb2-4963-924b-bfb9de65cea8',
      'name': 'Media Packet Loss',
      'type': 'MEDIA_PACKET_LOSS_PERCENT',
      'category': ALERT_CATEGORIES.APPLICATION,
      'description': 'Monitor packet loss of RTP based Audio, Video applications',
      'enabled': true,
      'useDefaultSharingConfig': true,
      'rank': -1,
      'instanceName': 'Default Instance',
      'config': {
        'thresholds': [{
          'severity': AlertSeverity.CRITICAL,
          'value': 1.0
        }],
        'timeOverMinutes': 0
      },
      'severity': AlertSeverity.CRITICAL,
      'courierIds': [],
      'coolDownMinutes': 0
    }, {
      'id': '11ec0e02-9838-4a29-90cb-bd975728d221',
      'name': 'Routing Polling Error',
      'type': 'ROUTING_POLL_ERROR',
      'category': ALERT_CATEGORIES.NETWORK,
      'description': 'A polling error was encountered with EIGRP, OSPF, or ISIS protocols',
      'enabled': false,
      'useDefaultSharingConfig': true,
      'rank': -1,
      'instanceName': 'Default Instance',
      'config': {
        'thresholds': [],
        'timeOverMinutes': 0
      },
      'severity': AlertSeverity.CRITICAL,
      'courierIds': []
    }, {
      'id': '7247b900-0948-4622-aa20-8526b81807b3',
      'name': 'Custom OID - Bad Devices',
      'type': 'CUSTOM_OID',
      'category': ALERT_CATEGORIES.DEVICE_INTERFACE,
      'enabled': false,
      'useDefaultSharingConfig': true,
      'rank': -1,
      'instanceName': 'Default Instance',
      'config': {
        'thresholds': [{
          'severity': AlertSeverity.INFO,
          'value': 100.0
        }],
        'timeOverMinutes': 0
      },
      'severity': AlertSeverity.INFO,
      'courierIds': [],
      'customOidId': 'b8f336b6-15cc-45fe-8af6-3d12f64565ef'
    },
    {
      'id': 'b697243b-3bf9-41ef-bef8-e3f039719703',
      'name': 'LiveNX CPU Utilization',
      'type': 'NODE_CPU_UTILIZATION',
      'category': ALERT_CATEGORIES.SYSTEM,
      'enabled': false,
      'useDefaultSharingConfig': true,
      'rank': -1,
      'instanceName': 'Default Instance',
      'config': {
        'thresholds': [{
          'severity': AlertSeverity.CRITICAL,
          'value': 40.0,
          'label': '781a5ef3-1480-4064-81af-5b672be12487'
        }],
        'timeOverMinutes': 0
      },
      'severity': AlertSeverity.CRITICAL,
      'courierIds': [],
      'coolDownMinutes': 0
    }
  ];

  static readonly ALERT_REQUESTS: Array<AlertIdentifierRequest> =
    AlertIdentifiersServiceFixtures.IDENTIFIERS.map((identifier: AlertIdentifierResponse) => {
      return {
        id: identifier.id,
        name: identifier.name,
        severity: identifier.severity,
        instanceName: identifier.instanceName,
        type: identifier.type,
        rank: identifier.rank,
        enabled: identifier.enabled,
        coolDownMinutes: identifier.coolDownMinutes,
        config: identifier.config,
        courierIds: identifier.courierIds
      } as AlertIdentifierRequest;
    });
}

