import { Component, HostBinding, OnInit } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {ALERT_TYPE_NOTES} from '../../../../alerts/constants/alert-type-notes.constants';

@Component({
  selector: 'nx-alert-type-cell-renderer',
  templateUrl: './alert-type-cell-renderer.component.html',
  styleUrls: ['./alert-type-cell-renderer.component.less'],
})
export class AlertTypeCellRendererComponent implements OnInit, ICellRendererAngularComp {
  value: string;
  contributesToStatus: boolean;
  ALERT_TYPE_NOTES = ALERT_TYPE_NOTES;

  @HostBinding('class.table-cell-content') isTableCellContent = true;

  constructor() { }

  ngOnInit() {
  }

  agInit(params: ICellRendererParams): void {
    this.value = params.value;
    this.contributesToStatus = params.data.contributesToStatus;
  }

  refresh(params: any): boolean {
    return false;
  }

}
