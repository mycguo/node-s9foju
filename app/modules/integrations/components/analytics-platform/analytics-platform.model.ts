import { StatusIndicatorValues } from '../../../shared/components/status-indicator/enums/status-indicator-values.enum';
import AnalyticsPlatformConfig from '../../../../services/analytics-platform/config/analytics-platform-config';

export default class AnalyticsPlatformModel extends AnalyticsPlatformConfig {
  hostname = '';
  port = AnalyticsPlatformConfig.DEFAULT_PORT;
  authToken = '';
  status: StatusIndicatorValues = StatusIndicatorValues.UNKNOWN;
}
