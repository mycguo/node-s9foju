import {ColDef} from 'ag-grid-community';

export interface GridColumnCustom extends ColDef {
  sortFn?: (colId: string, desc: boolean, valA: any, valB: any) => number;
}
