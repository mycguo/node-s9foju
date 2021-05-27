import ReportCategoryParameter from './api/parameter-enums/report-category-parameter';

export default interface RestrictedReportResponse {
  id: number | string;
  reportCategory: ReportCategoryParameter;
  name: string;
  group: string;
  isEnabled: boolean;
  isConfigurable: boolean;
}
