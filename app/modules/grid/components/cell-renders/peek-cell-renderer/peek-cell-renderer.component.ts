import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Component } from '@angular/core';

@Component({
  selector: 'nx-peek-cell-renderer',
  templateUrl: './peek-cell-renderer.component.html',
  styleUrls: ['./peek-cell-renderer.component.less']
})
export class PeekCellRendererComponent implements ICellRendererAngularComp {
  value: string;
  constructor() { }
  agInit(params: ICellRendererParams): void {
    this.value = params.value;
  }

  refresh(params: any): boolean {
    return false;
  }
}
