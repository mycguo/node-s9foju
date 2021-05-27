import SnmpCredentialsRequest from './snmp-credentials-request';

export default interface DeviceCredentialsRequest {
  deviceSerial: string;
  snmpCredential: SnmpCredentialsRequest;
}
