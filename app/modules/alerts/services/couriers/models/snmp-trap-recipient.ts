import {SnmpVersions} from '../../../../../constants/snmp-versions.enum';
import {SnmpV2Settings} from '../../../../../interfaces/snmp-v2-settings.interface';
import {SnmpV3Settings} from '../../../../../interfaces/snmp-v3-settings.interface';

export interface SnmpTrapRecipient {
  address: string;
  snmpSettings: {
    snmpVersion: SnmpVersions,
    port: number,
    settings: SnmpV2Settings | SnmpV3Settings
  };
}
