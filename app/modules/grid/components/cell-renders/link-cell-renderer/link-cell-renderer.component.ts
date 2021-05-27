import { Component, OnInit } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {LinkCellValue} from './link-cell-value';

@Component({
  selector: 'nx-link-cell-renderer',
  templateUrl: './link-cell-renderer.component.html',
  styleUrls: ['./link-cell-renderer.component.less']
})
export class LinkCellRendererComponent implements ICellRendererAngularComp {

  value: LinkCellValue = { text: '', link: '' };

  constructor() { }

  agInit(params: ICellRendererParams): void {
    this.value = params.value ?? {};
  }

  refresh(params: any): boolean {
    return false;
  }

}
