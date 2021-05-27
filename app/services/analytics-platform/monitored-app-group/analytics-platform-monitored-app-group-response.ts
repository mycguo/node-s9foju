/**
 * Represents an application group as returned from the "/applicationGroups" livenx server resource
 */
import {AnalyticsPlatformMonitoredAppGroupApplication} from './analytics-platform-monitored-app-group-application';

interface AnalyticsPlatformMonitoredAppGroupResponse {
  id: string;
  name: string;
  applications: Array<AnalyticsPlatformMonitoredAppGroupApplication>;
}

export default AnalyticsPlatformMonitoredAppGroupResponse;
