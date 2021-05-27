import {AnalyticsPlatformConfigState} from './analytics-platform-config.state';

export default class AnalyticsPlatformConfig {
  public static DEFAULT_PORT = 34524;

  hostname: string;
  port: number;

  constructor(hostname = '', port = AnalyticsPlatformConfig.DEFAULT_PORT) {
    this.hostname = hostname;
    this.port = port;
  }

  static isConfigured(config: AnalyticsPlatformConfig): boolean {
    return config.hostname != null && config.hostname.length > 0 && config.port != null;
  }
}
