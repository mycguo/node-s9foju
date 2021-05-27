import {EntityState, MultiActiveState} from '@datorama/akita';
import {SdwanAlertManagement} from '../../services/sdwan-alert-management/sdwan-alert-management';

export interface SdwanAlertManagementState extends EntityState<SdwanAlertManagement>, MultiActiveState {

}
