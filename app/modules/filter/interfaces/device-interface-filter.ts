export interface DeviceInterfaceFilter {
  interfaces: Array<string>;
  device: {
    deviceSerial: string,
    deviceSystemName: string,
    deviceHostName: string
  };
}
