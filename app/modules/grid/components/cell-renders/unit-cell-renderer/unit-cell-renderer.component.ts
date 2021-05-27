import { Component, OnInit } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

@Component({
  selector: 'nx-unit-cell-renderer',
  templateUrl: './unit-cell-renderer.component.html',
  styleUrls: ['./unit-cell-renderer.component.less'],
  host: {'[class.table-cell-content]': 'true'}
})
export class UnitCellRendererComponent implements OnInit, ICellRendererAngularComp {
  value: number | string;
  unit: string;
  constructor() { }

  ngOnInit(): void {
  }

  agInit(params: ICellRendererParams): void {
    this.unit = params.colDef?.cellRendererParams?.units;
    this.value = params.value != null ? params.value : '-';
  }

  refresh(params: any): boolean {
    return false;
  }
}
