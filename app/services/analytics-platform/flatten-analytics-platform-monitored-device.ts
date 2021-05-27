import AnalyticsPlatformMonitoredDevice from './monitored-devices/analytics-platform-monitored-device.model';

export const flattenDevice = (entity: AnalyticsPlatformMonitoredDevice): {[key: string]: string} => {
  return {
    name: entity.deviceName,
    node: entity.analyticsNode,
    site: entity.site,
    region: entity.region,
    tags: entity.tags
  };
};
