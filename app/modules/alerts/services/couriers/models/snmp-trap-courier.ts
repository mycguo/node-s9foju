import {Courier} from './courier';
import {CourierScopes} from '../enums/courier-scopes.enum';
import {CourierTypes} from '../enums/courier-types.enum';
import {CourierResponse} from './courier-response';
import {SnmpTrapRecipient} from './snmp-trap-recipient';
import {CourierRequest} from './courier-request';

export class SnmpTrapCourier implements Courier {
  enabled: boolean;
  id: string;
  scope: CourierScopes;
  type = CourierTypes.SNMP_TRAP;
  recipients: Array<SnmpTrapRecipient>;
  displayName = 'SNMP Trap';

  // for this to work with akita class constructor should accept only one parameter which is a plain object
  // https://datorama.github.io/akita/docs/additional/class/
  constructor(courier: Partial<Courier & {recipients: Array<SnmpTrapRecipient>}>) {
    this.id = courier?.id ?? void 0;
    this.scope = courier?.scope ?? CourierScopes.GLOBAL;
    this.enabled = courier?.enabled;
    this.recipients = courier?.recipients ?? [];
  }

  buildUpdateRequest(): CourierRequest {
    return {
      id: this.id,
      type: this.type,
      enabled: this.enabled,
      config: {recipients: this.recipients}
    };
  }

  shouldDelete(): boolean {
    return this.recipients.length === 0;
  }
}
