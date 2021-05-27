import CustomOidPollingDevices from './models/custom-oid-polling-devices';
import ILaDeviceResponse from '../../../../../../../project_typings/api/laDevice/ILaDeviceResponse';
import CustomOidPolling from './models/custom-oid-polling';
import { ProcessingType } from '../../../../services/custom-oids/enums/processing-type.enum';
import { ConversionType } from '../../../../services/custom-oids/enums/conversion-type.enum';
import { AssociationType } from '../../../../services/custom-oids/enums/association-type.enum';

export class CustomOidPollingServiceFixtures {
  static readonly ERROR_RESPONSE = {status: 500, statusText: 'Server Error'};

  static readonly OID_CONFIGURATION: CustomOidPolling[] = [
    new CustomOidPolling({
      customOid: {
      id: '33956e56-1a10-4cd2-a247-7b75548463c5',
      name: 'CPU 1 Minute',
      oidValue: '.1.3.6.1.4.1.9.9.109.1.1.1.1.7.7',
      units: '%',
      processingType: ProcessingType.DELTA,
      conversionType: ConversionType.MULTIPLY,
      conversionFactor: 1,
      associationType: AssociationType.SPECIFIC_DEVICES,
      association: {deviceSerials: ['9K4GX6G29L5', '9B68IV2ARHE']},
    },
      deviceNames: ['MC1_229', '4331-HE-14']})
  ];

  static readonly DEVICES_RESPONSE = [
      {
        'href': 'https://10.4.201.224:8093/v1/devices/9H4C98RFILR',
        'id': '9K4GX6G29L5',
        'serial': '9K4GX6G29L5',
        'address': '10.1.40.229',
        'systemName': 'MC1_229.liveaction.com',
        'hostName': 'MC1_229',
        'systemDescription': 'Cisco IOS Software, CSR1000V Software (X86_64_LINUX_IOSD-UNIVERSALK9-M), Version 15.5(3)S4b, RELEASE SOFTWARE (fc1)\r\nTechnical Support: http://www.cisco.com/techsupport\r\nCopyright (c) 1986-2016 by Cisco Systems, Inc.\r\nCompiled Mon 17-Oct-16 19:49 by mcpre',
        'vendorProduct': {
          'model': 'ciscoCSR1000v',
          'displayName': 'ciscoCSR1000v',
          'description': 'ciscoCSR1000v',
          'vendor': {
            'vendorName': 'Cisco',
            'vendorOid': {
              'displayName': '.1.3.6.1.4.1.9'
            },
            'vendorSerialOid': {
              'displayName': '.1.3.6.1.4.1.9.3.6.3'
            }
          },
          'objectOID': {
            'displayName': '.1.3.6.1.4.1.9.1.1537'
          },
          'asrModel': false,
          'objectOIDString': '.1.3.6.1.4.1.9.1.1537'
        },
        'site': 'PaloAlto-VE-01',
        'tags': [
          'Omnipliance'
        ],
        'down': false
      },
      {
        'href': 'https://10.4.201.224:8093/v1/devices/FLM2053W1KK',
        'id': '9B68IV2ARHE',
        'serial': '9B68IV2ARHE',
        'address': '10.4.183.1',
        'systemName': '4331-HE-14.liveaction.com',
        'hostName': '4331-HE-14',
        'systemDescription': 'Cisco IOS Software [Everest], ISR Software (X86_64_LINUX_IOSD-UNIVERSALK9-M), Version 16.6.2, RELEASE SOFTWARE (fc2)\r\nTechnical Support: http://www.cisco.com/techsupport\r\nCopyright (c) 1986-2017 by Cisco Systems, Inc.\r\nCompiled Wed 01-Nov-17 07:09 by mcpr',
        'vendorProduct': {
          'model': 'ciscoISR4331',
          'displayName': 'ciscoISR4331',
          'description': 'ciscoISR4331',
          'vendor': {
            'vendorName': 'Cisco',
            'vendorOid': {
              'displayName': '.1.3.6.1.4.1.9'
            },
            'vendorSerialOid': {
              'displayName': '.1.3.6.1.4.1.9.3.6.3'
            }
          },
          'objectOID': {
            'displayName': '.1.3.6.1.4.1.9.1.2068'
          },
          'asrModel': false,
          'objectOIDString': '.1.3.6.1.4.1.9.1.2068'
        },
        'site': 'PaloAlto-VE-01',
        'tags': [
          'LiveWire'
        ],
        'down': false
      },
      {
        'href': 'https://10.4.201.224:8093/v1/devices/FXS2009Q243',
        'id': 'FXS2009Q243',
        'serial': 'FXS2009Q243',
        'address': '10.1.101.100',
        'systemName': 'Melbourne-cEdge',
        'hostName': 'Melbourne-cEdge',
        'systemDescription': 'Cisco IOS Software [Amsterdam], ASR1000 Software (X86_64_LINUX_IOSD-UNIVERSALK9-M), Version 17.2.1r, RELEASE SOFTWARE (fc2)\r\nTechnical Support: http://www.cisco.com/techsupport\r\nCopyright (c) 1986-2020 by Cisco Systems, Inc.\r\nCompiled Thu 09-Apr-20 23:25 ',
        'vendorProduct': {
          'model': 'ciscoASR1001X',
          'displayName': 'ciscoASR1001X',
          'description': 'ciscoASR1001X',
          'vendor': {
            'vendorName': 'Cisco',
            'vendorOid': {
              'displayName': '.1.3.6.1.4.1.9'
            },
            'vendorSerialOid': {
              'displayName': '.1.3.6.1.4.1.9.3.6.3'
            }
          },
          'objectOID': {
            'displayName': '.1.3.6.1.4.1.9.1.1861'
          },
          'asrModel': true,
          'objectOIDString': '.1.3.6.1.4.1.9.1.1861'
        },
        'down': false
      },
      {
        'href': 'https://10.4.201.224:8093/v1/devices/FDO1838R1GU',
        'id': 'FDO1838R1GU',
        'serial': 'FDO1838R1GU',
        'address': '10.4.201.1',
        'systemName': 'HE_QA-3710-2',
        'hostName': 'HE_QA-3710-2',
        'systemDescription': 'Cisco IOS Software, C3750E Software (C3750E-UNIVERSALK9-M), Version 15.2(4)E5, RELEASE SOFTWARE (fc2)\r\nTechnical Support: http://www.cisco.com/techsupport\r\nCopyright (c) 1986-2017 by Cisco Systems, Inc.\r\nCompiled Mon 18-Sep-17 06:58 by prod_rel_team',
        'vendorProduct': {
          'model': 'catalyst37xxStack',
          'displayName': 'catalyst37xxStack',
          'description': 'catalyst37xxStack',
          'vendor': {
            'vendorName': 'Cisco',
            'vendorOid': {
              'displayName': '.1.3.6.1.4.1.9'
            },
            'vendorSerialOid': {
              'displayName': '.1.3.6.1.4.1.9.3.6.3'
            }
          },
          'objectOID': {
            'displayName': '.1.3.6.1.4.1.9.1.516'
          },
          'asrModel': false,
          'objectOIDString': '.1.3.6.1.4.1.9.1.516'
        },
        'site': 'PaloAlto-VE-01',
        'down': false
      },
      {
        'href': 'https://10.4.201.224:8093/v1/devices/non',
        'id': 'non',
        'serial': 'non',
        'address': '10.1.2.112',
        'systemName': 'non',
        'hostName': 'non',
        'vendorProduct': {
          'model': 'Non-SNMP',
          'displayName': 'Non-SNMP',
          'description': 'Non-SNMP device',
          'vendor': {
            'vendorName': 'Non-SNMP',
            'vendorOid': {
              'displayName': '.1.3.6.1.4.1'
            },
            'vendorSerialOid': {
              'displayName': '.1.3.6.1.4.1'
            }
          },
          'objectOID': null,
          'asrModel': false,
          'objectOIDString': ''
        },
        'down': false
      },
      ];

}
