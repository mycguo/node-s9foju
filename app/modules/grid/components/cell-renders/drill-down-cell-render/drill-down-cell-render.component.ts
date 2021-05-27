import { Component, OnInit } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

@Component({
  selector: 'nx-drill-down-cell-render',
  templateUrl: './drill-down-cell-render.component.html',
  styleUrls: ['./drill-down-cell-render.component.less']
})
export class DrillDownCellRenderComponent implements ICellRendererAngularComp  {
  href = '#';

  constructor() { }

  agInit(params: ICellRendererParams): void {
    this.href = params.value;
  }

  refresh(params: any): boolean {
    return false;
  }
}
