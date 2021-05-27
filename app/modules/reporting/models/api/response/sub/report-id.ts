import ReportCategoryParameter from '../../parameter-enums/report-category-parameter';

interface ReportId {
  id: number|string;
  category: ReportCategoryParameter;
  name?: string;
}

export default ReportId;
