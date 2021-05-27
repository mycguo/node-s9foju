import AvailableParameter from './available-parameter';
import ReportCategoryParameter from './api/parameter-enums/report-category-parameter';

export interface ReportInfoValue {
  id: number | string;
  name: string;
  reportBase: string;
  reportCategory: ReportCategoryParameter;
  group?: string;
  allowsAllDevices: boolean;
  allowsAllInterfaces: boolean;
  availableParameters: AvailableParameter[];
  isSavedReport: boolean;
  isRestrictedReport: boolean;
}

export default interface ReportInfo {
  name: string;
  value?: ReportInfoValue;
}

