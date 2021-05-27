import {ReportTableDataStrategy} from './data-strategies/report-table-data-strategy';

export interface ReportTableDataGeneratorOptions<T, R = ReportTableDataStrategy> {
  // prop key of the columns which should be right aligned
  columns?: { [key: string]: T };
  hiddenColumns?: Array<string>;
  additionalColumns?: Array<{ prop: string, index: number }>;
  grouped?: Array<{ name: string, props: Array<string> }>;
  /**
   * Strategy used to transform data with knowledge of data
   * (vs restructuring which would be done in the VisualDataGenerator's transform)
   */
  visualDataStrategy?: ReportTableDataStrategy;
}
