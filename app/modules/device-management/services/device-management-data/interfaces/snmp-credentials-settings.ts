import SnmpAuthProtocolsEnum from '../enums/snmp-auth-protocols';
import SnmpPrivProtocolsEnum from '../enums/snmp-priv-protocols';

export default interface SnmpCredentialsSettings {
  snmpCommunity?: string;
  snmpAuthPassPhrase?: string;
  snmpAuthProtocol?: SnmpAuthProtocolsEnum;
  snmpPrivPassPhrase?: string;
  snmpPrivProtocol?: SnmpPrivProtocolsEnum;
  snmpSecurityName?: string;
}
