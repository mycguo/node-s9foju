import {Courier} from './courier';
import {CourierScopes} from '../enums/courier-scopes.enum';
import {CourierTypes} from '../enums/courier-types.enum';
import ServiceNowCourierConfig from '../../../../integrations/services/service-now-courier-config/models/service-now-courier-config';
import {CourierRequest} from './courier-request';

export class ServiceNowCourier implements Courier {
  enabled: boolean;
  id: string;
  scope: CourierScopes;
  type = CourierTypes.SERVICE_NOW;
  fieldOptions: Array<ServiceNowCourierConfig>;
  displayName = 'ServiceNow';

  // for this to work with akita class constructor should accept only one parameter which is a plain object
  // https://datorama.github.io/akita/docs/additional/class/
  constructor(courier: Partial<Courier & {fieldOptions: Array<ServiceNowCourierConfig>}>) {
    this.id = courier?.id ?? void 0;
    this.scope = courier?.scope ?? CourierScopes.SCOPED;
    this.enabled = !!courier?.enabled;
    this.fieldOptions = courier?.fieldOptions ?? [];
  }

  buildUpdateRequest(): CourierRequest {
    return {
      id: this.id,
      type: this.type,
      enabled: this.enabled,
      config: {fieldOptions: this.fieldOptions}
    };
  }

  /**
   * Service now courier should only be deleted if not enabled
   */
  shouldDelete(): boolean {
    return !this.enabled;
  }
}
