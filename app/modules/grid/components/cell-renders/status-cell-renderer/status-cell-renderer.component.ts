import { StatusIndicatorValues } from '../../../../shared/components/status-indicator/enums/status-indicator-values.enum';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { StatusIndicatorViewTypes } from '../../../../shared/components/status-indicator/enums/status-indicator-view-types.enum';

@Component({
  selector: 'nx-status-cell-renderer',
  templateUrl: './status-cell-renderer.component.html',
  styleUrls: ['./status-cell-renderer.component.less']
})
export class StatusCellRendererComponent implements ICellRendererAngularComp {
  value: StatusIndicatorValues;
  viewType = StatusIndicatorViewTypes.ICON;
  constructor() { }
  agInit(params: ICellRendererParams): void {
    this.value = params.value;
  }

  refresh(params: any): boolean {
    return false;
  }
}
