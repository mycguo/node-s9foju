
export default class UxLicense {
  expirationDate: Date;
  issueDate: Date;
  activationDate: Date;
  licenseNumber: string;
  licenseType: string;
  maxDeviceCount: number;
  maxAgentCount: number;
  maxHistoricalData: string;
  technologyModules: string;
  compatibleVersions: string;
  isCloudLicense: boolean;
  isActivated: boolean;
  licenseCheckFailureCauses: string;
  licenseOkWarnings: string;
  maintenanceExpirationDate: Date;
  actualExpirationDate: Date;
  licenseExpirationWarningDays: number;
  maintenanceExpirationWarningDays: number;
  activationGracePeriodWarningDays: number;
  isUsingProductionServer: boolean;
  maintenanceExpired: boolean;
  licenseServerConnectionFailureWarningDays: boolean;
  nullLicense: boolean;
  organization: string;
  max_global_agents: number;
  max_global_tests: number;
  max_private_agents: number;
  max_private_tests: number;
  nax_days_raw: number;
  max_days_processed: number;
}
