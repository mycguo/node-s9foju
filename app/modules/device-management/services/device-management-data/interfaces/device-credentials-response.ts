export default interface DeviceCredentialsResponse {
  failedDevices: IFailedDevice[];
}

interface IFailedDevice {
  serialString: string;
}
