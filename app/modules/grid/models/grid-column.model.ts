/***
 * Column definition for the grid component
 */
import {TemplateRef, Type} from '@angular/core';
import {GridColumnFilterConfig} from './grid-column-filter-config';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {GridColumnCustom} from './grid-column-custom';
import GridBaseColumn from './grid-base-column';

export default class GridColumn extends GridBaseColumn {
  /*** Column name */
  name: string;

  /*** Column prop field */
  prop: string;

  /*** grow factor relative to other columns. */
  flexGrow: number;

  /** Widget of column in pixels. */
  width: number;
  minWidth: number;
  maxWidth: number;

  /** True if column is sortable. */
  sortable: boolean;
  sortFn: (colId: string, desc: boolean, valA: any, valB: any) => number;

  handleSort: (string) => void;

  /** Configuration for the column filter. If set to undefined then no filter is shown */
  filter: GridColumnFilterConfig<any, any>;

  /** Reference to template ref for custom cell body
   * Templates are provided references to the row and cell value */
  headerTemplate: TemplateRef<any>;

  cellRenderComponent: Type<ICellRendererAngularComp>;
  cellRenderParams: any;

  onCellClicked: (event: any) => void;

  cellClass: string;
  flex: number;
  headerClass: string;

  /** Column tooltip field */
  tooltipField: string;

  /**
   * @desc Get "auto-size" value
   * @param flex Determine how the current column will grow to fit the space available in the table
   * @param maxWidth Available space for the current column resizing
   */
  private static getFlexValue(flex: number, maxWidth: number): number {
    if (!flex) {
      return maxWidth ? 0 : 1; // 0 restrict column width by maxWidth value; 1 - first level of column growing
    }
    return flex;
  }

  constructor({
                name,
                prop,
                flexGrow,
                width,
                minWidth,
                maxWidth,
                sortable,
                customSortFn,
                headerTemplate,
                filter,
                cellRenderComponent,
                cellRenderParams,
                onCellClicked,
                cellClass,
                flex,
                headerClass,
                tooltipField
              }: {
    name: string,
    prop: string,
    flexGrow?: number,
    width?: number,
    minWidth?: number
    maxWidth?: number,
    sortable?: boolean,
    customSortFn?: (colId: string, desc: boolean, valA: any, valB: any) => number,
    headerTemplate?: TemplateRef<any>,
    filter?: GridColumnFilterConfig<any, any>,
    cellRenderComponent?: Type<ICellRendererAngularComp>,
    cellRenderParams?: any,
    onCellClicked?: (event: any) => void;
    cellClass?: string;
    flex?: number;
    headerClass?: string;
    tooltipField?: string;
  }) {
    super({name});
    this.prop = prop;
    this.flexGrow = flexGrow;
    this.width = width;
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
    this.sortable = sortable;
    this.sortFn = customSortFn;
    this.headerTemplate = headerTemplate;
    this.handleSort = this._handleSort.bind(this);
    this.filter = filter;
    this.cellRenderComponent = cellRenderComponent;
    this.cellRenderParams = cellRenderParams;
    this.onCellClicked = onCellClicked;
    this.cellClass = cellClass;
    this.flex = flex;
    this.headerClass = headerClass;
    this.tooltipField = tooltipField;
  }

  _handleSort(direction: string) {
  }

  toAgColumnDef(): GridColumnCustom {
    return {
      headerName: this.name,
      headerClass: this.headerClass,
      field: this.prop,
      width: this.width,
      minWidth: this.minWidth || 80,
      maxWidth: this.maxWidth,
      // This will set the agGrid filter to some value.
      // This is required to render any filter including floating filters.
      filter: this.filter ? 'columnFilter' : void 0,
      floatingFilterComponent: this.filter ? 'columnFilter' : void 0,
      floatingFilterComponentParams: {
        ...this.filter,
      },
      cellRendererFramework: this.cellRenderComponent,
      cellRendererParams: this.cellRenderParams,
      suppressMenu: true,
      sortable: this.sortable,
      onCellClicked: this.onCellClicked,
      cellClass: this.cellClass,
      resizable: true,
      comparator: () => 0, // disable ag-grid native sort
      sortFn: this.sortFn,
      flex: GridColumn.getFlexValue(this.flex, this.maxWidth),
      tooltipField: this.tooltipField
    };
  }
}
