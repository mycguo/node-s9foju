import { SupportedCapabilities } from '../../../modules/live-insight-edge/enums/supported-capabilities.enum';

export class AnalyticsPlatformConnection {
  configured: boolean;
  connectionState: AnalyticsPlatformConnectionState;
  errorMessage?: string; // Present if connectionState = ERROR
  errorMessageDetail?: string; // Present if errorMessage is present
  analyticsVersion: string;
  analyticsUptimeMillis: number;
  supportedCapabilities: SupportedCapabilities[];
}

export enum AnalyticsPlatformConnectionState {
  CONNECTED = 'Connected',
  CONNECTING = 'Connecting',
  ERROR = 'Error',
  DOWN = 'Down'
}

