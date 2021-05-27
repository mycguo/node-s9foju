import { ErrorCellValue } from './enums/error-cell-value.enum';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'nx-error-cell-renderer',
  templateUrl: './error-cell-renderer.component.html',
  styleUrls: ['./error-cell-renderer.component.less']
})
export class ErrorCellRendererComponent implements ICellRendererAngularComp {
  value: string;
  @HostBinding('class.nx-error-cell-renderer_status_good') get hasSuccessStatus() { return this.value === ErrorCellValue.SUCCESS; }
  @HostBinding('class.nx-error-cell-renderer_status_other') get hasOtherError() { return this.value === ErrorCellValue.OTHER; }
  constructor() { }
  agInit(params: ICellRendererParams): void {
    this.value = params.value;
  }

  refresh(params: any): boolean {
    return false;
  }

  get displayValue(): string {
    // const error = ErrorCellDisplayValue.find(errObj => errObj.type === this.value);
    return this.value;
  }
}
