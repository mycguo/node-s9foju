import {Courier} from './courier';
import {CourierScopes} from '../enums/courier-scopes.enum';
import {CourierTypes} from '../enums/courier-types.enum';
import {CourierResponse} from './courier-response';
import {CourierRequest} from './courier-request';

export class WebUiCourier implements Courier {
  enabled: boolean;
  id: string;
  scope: CourierScopes;
  type = CourierTypes.WEB_UI;
  displayName = 'Web UI';

  constructor(courier: Partial<Courier>) {
    this.id = courier?.id ?? void 0;
    this.scope = courier?.scope ?? CourierScopes.GLOBAL;
    this.enabled = courier?.enabled;
  }

  // todo
  buildUpdateRequest(): CourierRequest {
    return {
      id: this.id,
      type: this.type,
      enabled: this.enabled,
      config: void 0
    };
  }

  shouldDelete(): boolean {
    return false;
  }
}
