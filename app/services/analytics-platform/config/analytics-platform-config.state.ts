import ConfigurationEnum from '../../../../../../project_typings/enums/configuration.enum';
import {RequestErrors} from '../../../utils/api/request-errors';
import AnalyticsPlatformConfig from './analytics-platform-config';

export interface AnalyticsPlatformConfigState {
  config: AnalyticsPlatformConfig;
  configSubmitting: boolean;
  error: RequestErrors;
  loading: boolean;
}
