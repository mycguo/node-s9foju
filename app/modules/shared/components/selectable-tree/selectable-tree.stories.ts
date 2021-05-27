import { moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { SelectableTreeNode } from './selectable-tree-node';
import { CdkTreeModule } from '@angular/cdk/tree';
import { Component, OnChanges, OnInit } from '@angular/core';
import { SelectableTreeFlatNode } from './selectable-tree-flat-node';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import REPORTS_LIST from './reports-list.fixtures';

@Component({
  selector: 'nx-tree-stories',
  template: `
    <nx-selectable-tree
      style='flex-grow: 1; overflow-y: auto;'
      [formControl]='treeControl'
    ></nx-selectable-tree>
  `,
  styles: [':host {display: flex; flex-direction: column; height: 90vh;}'],
})

// @ts-ignore
class SelectableTreeStories implements OnInit, OnChanges {
  treeData: SelectableTreeNode[];

  treeControl: FormControl;

  constructor() {
    this.treeControl = new FormControl(REPORTS_LIST);

    this.treeControl.valueChanges.subscribe(
      (nodes: SelectableTreeFlatNode[]) => {
        this.changedNodes(nodes);
      }
    );
  }

  changedNodes(changedNodes: SelectableTreeFlatNode[]) {
    action('changedNodes')(changedNodes);
  }
}

export default {
  title: 'Shared/SelectableTreeComponent',

  decorators: [
    moduleMetadata({
      imports: [CdkTreeModule, ReactiveFormsModule, SharedModule],
    }),
  ],
};

export const Default = () => ({
  component: SelectableTreeStories,
});

Default.story = {
  name: 'default',
};
