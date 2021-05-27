import {Courier} from './courier';
import {CourierScopes} from '../enums/courier-scopes.enum';
import {CourierTypes} from '../enums/courier-types.enum';
import {CourierResponse} from './courier-response';
import {CourierRequest} from './courier-request';

export class SyslogCourier implements Courier {
  enabled: boolean;
  id: string;
  scope: CourierScopes;
  type = CourierTypes.SYSLOG;
  displayName = 'Syslog';

  // for this to work with akita class constructor should accept only one parameter which is a plain object
  // https://datorama.github.io/akita/docs/additional/class/
  constructor(courier: Partial<Courier>) {
    this.id = courier?.id ?? void 0;
    this.scope = courier?.scope ?? CourierScopes.GLOBAL;
    this.enabled = courier?.enabled;
  }

  buildUpdateRequest(): CourierRequest {
    return {
      id: this.id,
      type: this.type,
      enabled: this.enabled,
      config: void 0
    };
  }

  shouldDelete(): boolean {
    return false; // global never should be deleted
  }
}
