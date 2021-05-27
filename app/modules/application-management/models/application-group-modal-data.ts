import ApplicationGroup from './application-group';
import {ModalActionType} from '../../shared/enums/modal-action-type.enum';

export interface ApplicationGroupModalData {
  mode: ModalActionType;
  appGroupNames: Array<string>;
  appGroup?: ApplicationGroup;
}
