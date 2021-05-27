export interface Syslog {
  engineerConsoleEnable: boolean;
  syslogFacility: string;
  syslogProtocol: string;
  syslogPort: number;
  syslogAddress: string;
  appName: string;
  hostNameFormat: string;
  timeStampFormat: string;
  processIdFormat: string;
}
