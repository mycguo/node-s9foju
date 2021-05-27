import {CourierTypes} from '../enums/courier-types.enum';
import {CourierScopes} from '../enums/courier-scopes.enum';
import {EmailCourierConfigResponse} from './email-courier-config-response';
import {ServiceNowCourierConfigResponse} from './service-now-courier-config-response';
import {SnmpTrapCourierConfigResponse} from './snmp-trap-courier-config-response';

export interface CourierRequest {
  id: string;
  type: CourierTypes;
  config: EmailCourierConfigResponse | ServiceNowCourierConfigResponse | SnmpTrapCourierConfigResponse;
  enabled: boolean;
}
