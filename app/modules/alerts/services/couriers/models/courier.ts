import {CourierTypes} from '../enums/courier-types.enum';
import {CourierScopes} from '../enums/courier-scopes.enum';
import {CourierRequest} from './courier-request';

export interface Courier {
  id: string;
  displayName: string;
  type: CourierTypes;
  scope: CourierScopes;
  enabled: boolean;

  buildUpdateRequest: () => CourierRequest;
  shouldDelete: () => boolean; // used to determine if delete route should be called
}
