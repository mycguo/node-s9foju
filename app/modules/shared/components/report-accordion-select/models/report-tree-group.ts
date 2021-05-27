import {ReportTreeItem} from './report-tree-item';

export interface ReportTreeGroup {
  name: string;
  children: Array<ReportTreeItem>;
}
