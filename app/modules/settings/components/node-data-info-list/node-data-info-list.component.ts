import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NodeDataInfo } from './node-data-info.model';
import { MatSelectionList } from '@angular/material/list';
import { DataManagementService } from '../../services/data-management/data-management.service';
import { NodeStates } from '../../services/data-management/enums/node-sates.enum';

@Component({
  selector: 'nx-node-data-info-list',
  templateUrl: './node-data-info-list.component.html',
  styleUrls: ['./node-data-info-list.component.less']
})
export class NodeDataInfoListComponent {
  @Input() nodeDataInfoList: NodeDataInfo[];
  @Output() nodeSelect = new EventEmitter<string>();

  @ViewChild('selectionList') selectionList: MatSelectionList;

  readonly DEFAULT_NODE_ID = DataManagementService.DEFAULT_NODE_ID;
  readonly NODE_STATES = NodeStates;
  selectedOptionValue;

  constructor() {
    this.selectedOptionValue = this.DEFAULT_NODE_ID;
  }

  selectionListChange(id: string): void {
    if (!this.nodeDataInfoList || !this.nodeDataInfoList.find(node => node.id === id)) {
      id = this.DEFAULT_NODE_ID;
    }

    this.selectedOptionValue = id;
    this.nodeSelect.emit(id);
  }
}
