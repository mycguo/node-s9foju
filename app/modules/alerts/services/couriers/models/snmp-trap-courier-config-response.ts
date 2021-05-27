import {SnmpTrapRecipient} from './snmp-trap-recipient';

export interface SnmpTrapCourierConfigResponse {
  recipients: Array<SnmpTrapRecipient>;
}
