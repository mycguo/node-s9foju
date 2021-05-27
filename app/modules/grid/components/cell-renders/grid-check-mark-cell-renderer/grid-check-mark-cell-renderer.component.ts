import { Component } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

@Component({
  selector: 'nx-grid-check-mark-cell-renderer',
  templateUrl: './grid-check-mark-cell-renderer.component.html',
  styleUrls: ['./grid-check-mark-cell-renderer.component.less']
})
export class GridCheckMarkCellRendererComponent implements ICellRendererAngularComp {
  value: string;
  constructor() { }
  agInit(params: ICellRendererParams): void {
    this.value = params.value;
  }

  refresh(params: any): boolean {
    return false;
  }

}
