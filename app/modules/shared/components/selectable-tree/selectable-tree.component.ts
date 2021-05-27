import { Component, Input, Self } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectableTreeNode } from './selectable-tree-node';
import { SelectableTreeFlatNode } from './selectable-tree-flat-node';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'nx-selectable-tree',
  templateUrl: './selectable-tree.component.html',
  styleUrls: ['./selectable-tree.component.less']
})
export class SelectableTreeComponent implements ControlValueAccessor {
  @Input() set searchString(search: string) {
    this.searchText = search;
    if (search?.trim().length > 0)  {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

  searchText: string;

  treeControl: FlatTreeControl<SelectableTreeFlatNode>;
  treeFlattener: MatTreeFlattener<SelectableTreeNode, SelectableTreeFlatNode>;
  dataSource: MatTreeFlatDataSource<SelectableTreeNode, SelectableTreeFlatNode>;
  _onTouched: () => void;

  expandedNodes = new Set<string>();

  private static getLevel = (node: SelectableTreeFlatNode) => node.level;
  private static isExpandable = (node: SelectableTreeFlatNode) => node.expandable;
  private static getChildren = (node: SelectableTreeNode): SelectableTreeNode[] => node.children;
  /** Transformer to convert nested node to flat node */
  private static transformer = (node: SelectableTreeNode, level: number) => {
    return new SelectableTreeFlatNode(node, level);
  }

  hasChild = (_: number, node: SelectableTreeFlatNode) => node.expandable;
  _onChange: (value: SelectableTreeFlatNode[]) => void = () => void 0;

  constructor(
    @Self() public controlDir: NgControl,
  ) {
    controlDir.valueAccessor = this;
    this.treeControl = new FlatTreeControl<SelectableTreeFlatNode>(
      SelectableTreeComponent.getLevel,
      SelectableTreeComponent.isExpandable
    );
    this.treeFlattener = new MatTreeFlattener(
      SelectableTreeComponent.transformer,
      SelectableTreeComponent.getLevel,
      SelectableTreeComponent.isExpandable,
      SelectableTreeComponent.getChildren
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    this.treeControl.expansionModel.changed
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(change => {
      if (change.added.length > 0) {
        change.added.forEach(node => node !== void 0 && this.expandedNodes.add(node.id));
      }
      if (change.removed.length > 0) {
        change.removed.forEach(node => node !== void 0 && this.expandedNodes.delete(node.id));
      }
    });
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: SelectableTreeFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => !child.disabled && !!child.selected);
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the node item selection. Select/deselect all the descendants node */
  nodeItemSelectionToggle(node: SelectableTreeFlatNode): void {
    node.selected = !node.selected;
    const descendants = this.treeControl.getDescendants(node);
    this.toggleAllDescendants(node.selected, descendants);
    this.checkAllParentsSelection(node);
  }

  /** Toggle leaf node selection */
  leafNodeItemSelectionToggle(node: SelectableTreeFlatNode) {
    node.selected = !node.selected;
    this.checkAllParentsSelection(node);
    this._onChange([node]);
  }

  /** Whether all the descendants of the node are selected. */
  private descendantsAllSelected(node: SelectableTreeFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.length > 0 && descendants.every(child => child.disabled || !!child.selected);
  }

  /** Checks all the parents when a leaf node is selected/unselected */
  private checkAllParentsSelection(node: SelectableTreeFlatNode): void {
    let parent: SelectableTreeFlatNode | null = this.getParentNode(node);
    while (parent) {
      parent.selected = this.descendantsAllSelected(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Get the parent node of a node */
  private getParentNode(node: SelectableTreeFlatNode): SelectableTreeFlatNode | null {
    const currentLevel = SelectableTreeComponent.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (SelectableTreeComponent.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Toggle all descendants of selected node and emit result */
  private toggleAllDescendants(selected: boolean, nodes: SelectableTreeFlatNode[]) {
    const leafNodes = nodes.reduce((acc, node) => {
      if (node.disabled) { // ignore disabled nodes
        return acc;
      }
      node.selected = selected;
      if (!node.expandable) {
        acc.push(node);
      }
      return acc;
    }, <SelectableTreeFlatNode[]>[]);
    this._onChange(leafNodes);
  }

  /** Restore previously expanded nodes state */
  private restoreExpandedNodes() {
    this.expandedNodes.forEach(nodeId => {
      this.treeControl.expand(this.treeControl.dataNodes.find(node => node.id === nodeId));
    });
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(dataSource: SelectableTreeNode[]): void {
    if (dataSource !== null) {
      this.dataSource.data = dataSource || [];
      this.restoreExpandedNodes();
    }
  }

}
