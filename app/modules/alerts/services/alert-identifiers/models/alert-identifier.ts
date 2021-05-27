import {AlertIdentifierResponse} from './alert-identifier-response';
import {AlertIdentifierSource} from '../alert-identifier-source.enum';

export interface AlertIdentifier extends AlertIdentifierResponse {
  source: AlertIdentifierSource;
}
