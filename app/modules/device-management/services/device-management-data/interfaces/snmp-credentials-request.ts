import SnmpCredentialsTypesEnum from '../enums/snmp-credentials-types';
import SnmpCredentials from './snmp-credentials';

export default interface SnmpCredentialsRequest {
  type: SnmpCredentialsTypesEnum;
  credential: SnmpCredentials | { id: string };
}
