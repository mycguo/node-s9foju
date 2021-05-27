import { Component, OnInit } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {TimeUtilsService} from '../../../../../services/time-utils/time-utils.service';
import {ICellRendererParams} from 'ag-grid-community';

@Component({
  selector: 'nx-datetime-cell-renderer',
  templateUrl: './datetime-cell-renderer.component.html',
  styleUrls: ['./datetime-cell-renderer.component.less'],
  host: {'[class.table-cell-content]': 'true'}
})
export class DatetimeCellRendererComponent implements OnInit, ICellRendererAngularComp {

  value: string;

  constructor(private timeUtils: TimeUtilsService) { }

  ngOnInit(): void {
  }

  agInit(params: ICellRendererParams): void {
    const date = new Date(params.value);
    this.value = this.timeUtils.formatDate(date);
  }

  refresh(params: any): boolean {
    return false;
  }

}
