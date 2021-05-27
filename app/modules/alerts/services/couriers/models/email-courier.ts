import {Courier} from './courier';
import {CourierTypes} from '../enums/courier-types.enum';
import {CourierScopes} from '../enums/courier-scopes.enum';
import {CourierResponse} from './courier-response';
import {CourierRequest} from './courier-request';

export class EmailCourier implements Courier {
  enabled: boolean;
  id: string;
  scope: CourierScopes;
  type = CourierTypes.PAGER_DUTY_EMAIL;
  recipients: Array<string>;
  displayName = 'Email';

  // for this to work with akita class constructor should accept only one parameter which is a plain object
  // https://datorama.github.io/akita/docs/additional/class/
  constructor(courier: Partial<Courier & { recipients: Array<string> }>) {
    this.id = courier?.id ?? void 0;
    this.scope = courier?.scope ?? CourierScopes.SCOPED;
    this.enabled = courier?.enabled ?? false;
    this.recipients = courier?.recipients ?? [];
  }

  buildUpdateRequest(): CourierRequest {
    return {
      id: this.id,
      enabled: this.enabled,
      type: this.type,
      config: {recipients: this.recipients}
    };
  }

  shouldDelete(): boolean {
    return this.recipients.length === 0;
  }
}
