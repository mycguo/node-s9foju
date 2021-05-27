import {CourierScopes} from '../enums/courier-scopes.enum';
import {CourierRequest} from './courier-request';

export interface CourierResponse extends CourierRequest {
  scope: CourierScopes;
}
