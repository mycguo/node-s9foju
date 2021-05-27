import LogosConfiguration from '../../services/logos/models/logos-configuration';
import Logo from '../../services/logos/models/logo';

export default interface LogoManagementModalDataInterface extends Logo {
  file?: File;
  logosConfig: LogosConfiguration;
  titleText: string;
}
