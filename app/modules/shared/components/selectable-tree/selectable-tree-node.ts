export interface SelectableTreeNode {
  id: string;
  name: string;
  children?: SelectableTreeNode[];
  enabled: boolean;
  disabled: boolean;
}
