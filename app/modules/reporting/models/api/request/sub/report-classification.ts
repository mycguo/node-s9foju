import ReportClassificationSource from '../enums/report-classification-source';
import ReportClassificationContext from '../enums/report-classification-context';

export interface ReportClassification {
  source: ReportClassificationSource;
  context: ReportClassificationContext;
}
