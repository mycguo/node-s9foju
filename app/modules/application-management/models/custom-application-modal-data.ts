import {ModalActionType} from '../../shared/enums/modal-action-type.enum';
import CustomApplicationModel from './custom-application-model';

export interface CustomApplicationModalData {
  mode: ModalActionType;
  application: CustomApplicationModel;
  customAppProtocols: Array<string>;
}
