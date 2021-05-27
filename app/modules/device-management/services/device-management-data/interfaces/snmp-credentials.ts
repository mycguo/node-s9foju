import SnmpVersionsEnum from '../enums/snmp-versions';
import SnmpCredentialsSettings from './snmp-credentials-settings';

export default interface SnmpCredentials {
  snmpVersion: SnmpVersionsEnum;
  port: number;
  settings: SnmpCredentialsSettings;
}

