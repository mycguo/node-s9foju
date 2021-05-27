
export enum ColumnSortDirection {
  asc = 'asc',
  desc = 'desc'
}

export interface GridColumnSort {
  colId: string;
  sort: string;
  customSortFn?: (colId: string, desc: boolean, valA: any, valB: any) => number;
}
