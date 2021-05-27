import { DeviceAutoRefreshProperties } from './device-auto-refresh-properties';

describe('AutoRefreshProperties', () => {
  it('should create an instance', () => {
    expect(new DeviceAutoRefreshProperties(false, 14)).toBeTruthy();
  });
});
