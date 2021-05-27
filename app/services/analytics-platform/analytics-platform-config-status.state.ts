import {StatusIndicatorValues} from '../../modules/shared/components/status-indicator/enums/status-indicator-values.enum';
import { SupportedCapabilities } from '../../modules/live-insight-edge/enums/supported-capabilities.enum';

export interface AnalyticsPlatformConfigStatusState {
  status: StatusIndicatorValues;
  analyticsVersion: string;
  supportedCapabilities: SupportedCapabilities[];
}
