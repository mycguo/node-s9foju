import { EntityState, MultiActiveState } from '@datorama/akita';
import CustomOidPolling from './custom-oid-polling';

export interface CustomOidPollingState extends EntityState<CustomOidPolling>, MultiActiveState<string> {}
