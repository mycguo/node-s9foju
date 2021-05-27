import { Component } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import SeverityTypes from '../../../../../../../../project_typings/api/alerting/alerts/SeverityTypes';

@Component({
  selector: 'nx-alert-management-severity-cell-renderer',
  templateUrl: './severity-cell-renderer.component.html',
  styleUrls: ['./severity-cell-renderer.component.less']
})
export class SeverityCellRendererComponent implements ICellRendererAngularComp {
  value: SeverityTypes;
  constructor() { }
  agInit(params: ICellRendererParams): void {
    this.value = params.value;
  }

  refresh(params: any): boolean {
    return false;
  }
}
