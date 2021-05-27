import { SelectableTreeNode } from './selectable-tree-node';

export class SelectableTreeFlatNode {
  id: string;
  name: string;
  level: number;
  expandable: boolean;
  selected: boolean;
  disabled: boolean;
  isExpanded: boolean;

  constructor(
      node: SelectableTreeNode,
      level: number
    ) {
    this.name = node.name;
    this.selected = node.enabled;
    this.disabled = node.disabled;
    this.expandable = !!node.children && node.children.length > 0;
    this.level = level;
    this.id = node.id;
  }
}
