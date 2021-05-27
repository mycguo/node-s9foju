import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import AnalyticsPlatformConfig from '../analytics-platform/config/analytics-platform-config';
import AnalyticsPlatformMonitoredDevice from '../analytics-platform/monitored-devices/analytics-platform-monitored-device.model';
import AnalyticsPlatformMonitoredAppGroupResponse from '../analytics-platform/monitored-app-group/analytics-platform-monitored-app-group-response';
import {AnalyticsPlatformConnection} from '../analytics-platform/connection/analytics-platform-connection';
import AnalyticsPlatformValidateConfigApiResponse from '../analytics-platform/config/analytics-platform-config-api-response';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsPlatformRestClientService {

  static ANALYTICS_BASE_URL = '/api/livena';

  static ANALYTICS_CONFIG_URL = `${AnalyticsPlatformRestClientService.ANALYTICS_BASE_URL}/config`;
  static ANALYTICS_CONFIG_VALIDATE_URL = `${AnalyticsPlatformRestClientService.ANALYTICS_BASE_URL}/config/validate`;
  static ANALYTICS_CONNECTION_STATUS_URL = `${AnalyticsPlatformRestClientService.ANALYTICS_BASE_URL}/connectionStatus`;

  /** Device URLs*/
  static ANALYTICS_DEVICES_URL = `${AnalyticsPlatformRestClientService.ANALYTICS_BASE_URL}/devices`;
  static ANALYTICS_DELETE_DEVICES_URL = `${AnalyticsPlatformRestClientService.ANALYTICS_BASE_URL}/devices/bulkDelete`;
  static ANALYTICS_ADDABLE_DEVICES_URL = `${AnalyticsPlatformRestClientService.ANALYTICS_BASE_URL}/addableDevices`;

  /** App group URLs*/
  static ANALYTICS_APP_GROUP_URL = `${AnalyticsPlatformRestClientService.ANALYTICS_BASE_URL}/applicationGroups`;
  static ANALYTICS_DELETE_APP_GROUP_URL = `${AnalyticsPlatformRestClientService.ANALYTICS_BASE_URL}` +
                                          `/applicationGroups/bulkDelete`;
  static ANALYTICS_ADDABLE_APP_GROUPS_URL = `${AnalyticsPlatformRestClientService.ANALYTICS_BASE_URL}` +
                                             `/addableApplicationGroups`;

  constructor(
    private httpClient: HttpClient
  ) {}

  updateAnalyticsPlatformConfig(updated: AnalyticsPlatformConfig): Observable<AnalyticsPlatformConfig> {
    return this.httpClient.put<AnalyticsPlatformConfig>(AnalyticsPlatformRestClientService.ANALYTICS_CONFIG_URL, updated);
  }

  getAnalyticsPlatformConfig(): Observable<AnalyticsPlatformConfig> {
    return this.httpClient.get<AnalyticsPlatformConfig>(AnalyticsPlatformRestClientService.ANALYTICS_CONFIG_URL);
  }

  deleteAnalyticsPlatformConfig(): Observable<any> {
    return this.httpClient.delete<any>(AnalyticsPlatformRestClientService.ANALYTICS_CONFIG_URL);
  }

  validateAnalyticsPlatformConfig(): Observable<AnalyticsPlatformValidateConfigApiResponse> {
    return this.httpClient.get
      < AnalyticsPlatformValidateConfigApiResponse > (AnalyticsPlatformRestClientService.ANALYTICS_CONFIG_VALIDATE_URL);
  }

  getConnectionStatus(): Observable<AnalyticsPlatformConnection> {
    return this.httpClient.get<AnalyticsPlatformConnection>(AnalyticsPlatformRestClientService.ANALYTICS_CONNECTION_STATUS_URL);
  }

  getMonitoredDevices(): Observable<{analyticsDevices: Array<AnalyticsPlatformMonitoredDevice>}> {
    return this.httpClient.get<{analyticsDevices: Array<AnalyticsPlatformMonitoredDevice>}>
        (AnalyticsPlatformRestClientService.ANALYTICS_DEVICES_URL);
  }

  addMonitoredDevices(deviceSerials: Array<string>, analyticsNode: string = 'Local'): Observable<any> {
    return this.httpClient.post<any>(
      AnalyticsPlatformRestClientService.ANALYTICS_DEVICES_URL,
      {deviceSerials, analyticsNode}
      );
  }

  removeMonitoredDevices(deviceSerials: Array<string>): Observable<any> {
    return this.httpClient.post(
      AnalyticsPlatformRestClientService.ANALYTICS_DELETE_DEVICES_URL,
      {deviceSerials}
      );
  }

  getAvailableDevicesToMonitor(): Observable<any> {
    return this.httpClient.get<{analyticsDevices: Array<AnalyticsPlatformMonitoredDevice>}>
    (AnalyticsPlatformRestClientService.ANALYTICS_ADDABLE_DEVICES_URL);
  }

  getMonitoredAppGroups(): Observable<{applicationGroups: Array<AnalyticsPlatformMonitoredAppGroupResponse>}> {
    return this.httpClient.get<{applicationGroups: Array<AnalyticsPlatformMonitoredAppGroupResponse>}>
    (AnalyticsPlatformRestClientService.ANALYTICS_APP_GROUP_URL);
  }

  addMonitoredAppGroups(groupIds: Array<string>): Observable<any> {
    return this.httpClient.post<any>(
      AnalyticsPlatformRestClientService.ANALYTICS_APP_GROUP_URL,
      {groupIds}
    );
  }

  removeMonitoredAppGroups(groupIds: Array<string>): Observable<any> {
    return this.httpClient.post(
      AnalyticsPlatformRestClientService.ANALYTICS_DELETE_APP_GROUP_URL,
      {groupIds}
    );
  }

  getAvailableAppGroupsToMonitor(): Observable<{applicationGroups: Array<AnalyticsPlatformMonitoredAppGroupResponse>}> {
    return this.httpClient.get<{applicationGroups: Array<AnalyticsPlatformMonitoredAppGroupResponse>}>
    (AnalyticsPlatformRestClientService.ANALYTICS_ADDABLE_APP_GROUPS_URL);
  }
}
