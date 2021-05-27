import {TemplateRef, Type} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

// Properties of GridColumn that can be used to customize widget tables (ReportTableDataGeneratorService)
export interface ReportTableDataGeneratorOptionsColumn {
  label?: string;
  flexGrow?: number;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  customSortFn?: (colId: string, desc: boolean, valA: any, valB: any) => number;
  headerTemplate?: TemplateRef<any>;
  cellRenderComponent?: Type<ICellRendererAngularComp>;
  cellRenderParams?: any;
  onCellClicked?: (event: any) => void;
  cellClass?: string;
  flex?: number;
  headerClass?: string;
  rightAligned?: boolean;
}
