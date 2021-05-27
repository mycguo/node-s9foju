import {ReportTreeItem} from './report-tree-item';
import {ReportTreeGroup} from './report-tree-group';

export interface ReportTreeType {
  name: string;
  sort: number;
  children: Array<ReportTreeGroup | ReportTreeItem>;
}
