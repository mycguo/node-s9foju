import {SdwanHttpHeader} from '../sdwan-http-header-item/sdwanHttpHeader';
import IIntegrations from '../../../../../../../project_typings/api/integrations/IIntegrations';

export default interface IntegrationsSdwanConfig extends IIntegrations {
    headers?: SdwanHttpHeader[];
}
