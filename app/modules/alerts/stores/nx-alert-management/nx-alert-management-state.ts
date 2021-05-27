import {EntityState, MultiActiveState} from '@datorama/akita';
import NxAlertManagement from '../../services/nx-alert-management/models/nx-alert-management';

export interface NxAlertManagementState extends EntityState<NxAlertManagement>, MultiActiveState {

}
