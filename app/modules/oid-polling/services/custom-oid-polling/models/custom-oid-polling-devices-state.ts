import { EntityState, MultiActiveState } from '@datorama/akita';
import CustomOidPollingDevices from './custom-oid-polling-devices';

export interface CustomOidPollingDevicesState extends EntityState<CustomOidPollingDevices>, MultiActiveState<string> {}
