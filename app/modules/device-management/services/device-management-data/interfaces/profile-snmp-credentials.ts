import SnmpCredentials from './snmp-credentials';

export default interface ProfileSnmpCredentials extends SnmpCredentials {
  id: string;
  profileName: string;
}
