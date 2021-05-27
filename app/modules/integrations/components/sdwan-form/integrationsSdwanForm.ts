import {SdwanHttpHeader} from '../sdwan-http-header-item/sdwanHttpHeader';
import IIntegrationForm from '../../services/integrations-form/IIntegrationForm';

export default interface IntegrationSdwanForm extends IIntegrationForm {
    headers?: SdwanHttpHeader[];
  }
