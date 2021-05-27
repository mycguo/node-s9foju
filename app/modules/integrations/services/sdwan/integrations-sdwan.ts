import IntegrationsSdwanConfig from '../../components/sdwan-form/integrationsSdwanConfig';
import ConfigurationEnum from '../../../../../../../project_typings/enums/configuration.enum';

export default interface IntegrationsSdwan {
    config?: IntegrationsSdwanConfig;
    status: ConfigurationEnum;
    statusMessage?: string;
    provided?: boolean;
}
