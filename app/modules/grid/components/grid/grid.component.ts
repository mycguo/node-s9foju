import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import GridData from '../../models/grid-data.model';
import GridColumn from '../../models/grid-column.model';
import {AgGridColumnFilterComponent} from '../filters/ag-grid-column-filter/ag-grid-column-filter.component';
import {
  ColDef,
  GridApi,
  GridOptions,
  RowNode,
  SortChangedEvent,
  GridReadyEvent,
  GridColumnsChangedEvent, ColGroupDef
} from 'ag-grid-community';
import FilterChange from '../filters/filter-change';
import {combineLatest, Observable, Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {GridColumnSort} from '../../models/grid-column-sort';
import {GridColumnCustom} from '../../models/grid-column-custom';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {CommonService} from '../../../../utils/common/common.service';
import {GridTooltipComponent} from '../grid-tooltip/grid-tooltip.component';
import {GridTheme} from './themes/grid-theme.enum';
import GridGroupColumn from '../../models/grid-group-column';
import GridBaseColumn from '../../models/grid-base-column';
import { CommonIndents } from '../../../shared/enums/common-indents.enum';
import { GridStatusBar } from '../grid-status-bar/grid-status-bar';

@UntilDestroy()
@Component({
  selector: 'nx-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class GridComponent implements OnInit, OnDestroy, OnChanges {

  static DEFAULT_NO_ROWS_TEMPLATE = '<span class="ag-overlay-no-rows-center">No Data</span>';
  static DEFAULT_THEME_CLASSES = 'ag-theme-balham ag-theme-balham_live-nx';

  @Input() data: GridData<any> = new GridData();
  @Input() columns: Array<GridBaseColumn>;
  @Input() columnSortKey: string;
  @Input() sortDescending = true;
  @Input() filterRowHeight;
  @Input() getIdFromDataItem: (any) => any;
  @Input() columnFilterDebounceTime = 200;
  @Input() errorMessage: string;
  /** This can also be a basic HTML template. */
  @Input() noDataMessage: string = GridComponent.DEFAULT_NO_ROWS_TEMPLATE;
  @Input() isRowSelectable: (rowNode: RowNode) => boolean;
  @Input() suppressRowClickSelection = true;
  @Input() height = '354px';
  @Input() fullHeight: boolean;
  @Input() selectedIds: Array<string | number> = [];
  @Input() theme: GridTheme = GridTheme.DEFAULT;
  @Input() noRowsDivider: boolean;
  @Input() highlightIds: Array<string | number>;
  @Input() suppressHorizontalScroll = false;
  @Input() autoSizeColsSkipHeader: boolean;
  @Input() offsetBottom: CommonIndents = CommonIndents.BOTTOM_CONTAINER;
  @Input() statusBarData: GridStatusBar;

  @Output() rowsSelected = new EventEmitter<any>();
  @Output() columnFilterChanged = new EventEmitter<Array<FilterChange>>();
  @Output() columnSortChanged = new EventEmitter<GridColumnSort>();

  @ViewChild('defaultHeaderTpl') defaultHeaderTpl: TemplateRef<any>;

  DEFAULT_FILTER_ROW_HEIGHT = 41;
  DEFAULT_STATUS_BAR_HEIGHT = 27;
  LIGHTWEIGHT_ROW_HEIGHT = 19;
  LIGHTWEIGHT_ROW_HEIGHT_NO_DIVIDER = 24;
  LIGHTWEIGHT_HEADER_HEIGHT = 16;
  DEFAULT_GROUPING_HEADER_HEIGHT = 22;
  /**
   * Component map used for dynamic component rendering in the grid.
   */
  gridFrameworkComponents: Record<string, Type<any>> = {
    /// Wrapper component for filters.
    columnFilter: AgGridColumnFilterComponent,
    customTooltip: GridTooltipComponent
  };

  _columns: Array<ColDef | ColGroupDef>;
  gridApi: GridApi;
  gridOptions: GridOptions = {
    rowHeight: 27,
    headerHeight: 41,
    suppressDragLeaveHidesColumns: true,
    suppressRowClickSelection: this.suppressRowClickSelection,
    suppressColumnVirtualisation: true,
    suppressPropertyNamesCheck: true, // Removes warnings caused by us overloading colDef
    postSort: (nodes: RowNode[]) => {
      this.checkSelected(nodes);
    },
    rowClassRules: {
      'ag-grid_row-highlight': (params) => this.setRowHighlight(params)
    },
    autoSizePadding: 1
  };

  defaultColDef = {
    tooltipComponent: 'customTooltip',
  };

  columnFilterDebouncer: Subject<Array<FilterChange>> = new Subject<Array<FilterChange>>();
  columnResetSubject = new Subject<void>();
  columnFilterCount = 0;
  columnFilterStreams: Array<Observable<FilterChange>> = [];

  noRowsTemplate = GridComponent.DEFAULT_NO_ROWS_TEMPLATE;
  fullHeightValue: string;
  themeClasses: string;

  @HostListener('window:resize') setFullHeightValue(): void {
    if (this.fullHeight) {
      const gridContainer = this.elementRef.nativeElement.querySelector('ag-grid-angular');
      const statusBarHeight = this.statusBarData ? this.DEFAULT_STATUS_BAR_HEIGHT : 0;
      this.fullHeightValue =
        gridContainer ? `${window.innerHeight - this.offsetBottom - statusBarHeight - gridContainer.getBoundingClientRect().top}px` : '0';
    }
  }

  constructor(
    private elementRef: ElementRef,
    private commonService: CommonService
  ) {
    this.columnFilterDebouncer
      .pipe(
        untilDestroyed(this),
        debounceTime(this.columnFilterDebounceTime)
      )
      .subscribe((value) => this.columnFilterChanged.emit(value));
  }

  ngOnInit() {
    this.themeClasses = `${GridComponent.DEFAULT_THEME_CLASSES} nx-grid-${this.theme}${this.theme === GridTheme.GROUPED_DEFAULT ? ' nx-grid-default' : ''}${!!this.noRowsDivider ? ' nx-grid_no-rows-divider' : ''}`;
    if (this.theme === GridTheme.LIGHTWEIGHT) {
      this.gridOptions = {
        ...this.gridOptions,
        headerHeight: this.LIGHTWEIGHT_HEADER_HEIGHT,
        rowHeight: this.noRowsDivider ? this.LIGHTWEIGHT_ROW_HEIGHT_NO_DIVIDER : this.LIGHTWEIGHT_ROW_HEIGHT
      };
    } else if (this.theme === GridTheme.GROUPED_DEFAULT) {
      this.gridOptions = {
        ...this.gridOptions,
        headerHeight: this.DEFAULT_GROUPING_HEADER_HEIGHT,
      };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.errorMessage != null) {
      if (this.errorMessage == null) {
        this.noRowsTemplate = this.noDataMessage;
      } else {
        this.noRowsTemplate = `<span class="ag-overlay-no-rows-center error">${this.errorMessage}</span>`;
      }
    }

    if (changes?.highlightIds?.currentValue &&
      !this.commonService.isEqual(changes.highlightIds.currentValue, changes.highlightIds.previousValue)) {
      if (this.gridApi) {
        this.gridApi.redrawRows();
      }
    }

    if (changes.columns?.currentValue != null) {
      const columns: Array<GridBaseColumn> = changes.columns.currentValue;
      // reset and clear
      this.columnFilterCount = 0;
      this.columnFilterStreams = [];
      this.columnResetSubject.next();

      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column instanceof GridGroupColumn) {
          column.children.forEach((col: GridColumn) => {
            this.setFilter(col.filter);
          });
        } else {
          const gridColumn = <GridColumn>column;
          this.setFilter(gridColumn.filter);
        }
      }
      this.filterRowHeight = this.columnFilterCount === 0 ? 0 : this.filterRowHeight || this.DEFAULT_FILTER_ROW_HEIGHT;
      this._columns = this.columns.map((column) => column.toAgColumnDef());
    }
  }

  handleRowSelectionChanged(event) {
    this.rowsSelected.emit(event.api.getSelectedNodes());
  }

  handleGridReady(params: GridReadyEvent) {
    if (this.autoSizeColsSkipHeader !== void 0) {
      params.columnApi.autoSizeAllColumns(this.autoSizeColsSkipHeader);
    }
    this.setFullHeightValue();
    this.gridApi = params.api;
  }

  handleGridColumnsChanged(params: GridColumnsChangedEvent) {
    if (this.autoSizeColsSkipHeader !== void 0) {
      params.columnApi.autoSizeAllColumns(this.autoSizeColsSkipHeader);
    }
  }

  handleSortChanged(change: SortChangedEvent) {
    const sortModel: GridColumnSort[] = change.api.getSortModel();
    if (!!sortModel[0]) {
      const colDef: GridColumnCustom = change.columnApi.getColumn(sortModel[0].colId).getColDef();
      this.columnSortChanged.emit({...sortModel[0], customSortFn: colDef.sortFn});
    } else {
      // restore original unsorted state
      this.columnSortChanged.emit();
    }
  }

  ngOnDestroy(): void {
    this.columnResetSubject.complete();
  }

  checkSelected(nodes: RowNode[]): void {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const id = this.getIdFromDataItem ? this.getIdFromDataItem(node.data) : node.data.id;
      if (id !== void 0 && !node.isSelected() && this.selectedIds?.includes(id)) {
        node.setSelected(true, false, true);
      }
    }
  }

  setRowHighlight(params): boolean {
    if (this.highlightIds === void 0 || this.highlightIds.length === 0) {
      return false;
    }
    const id = this.getIdFromDataItem ? this.getIdFromDataItem(params.node.data) : params.node.data.id;
    return this.highlightIds.includes(id);
  }

  private setFilter(columnFilter): void {
    if (columnFilter) {
      this.columnFilterCount++;
      columnFilter.subscribeToFilterEvents = (filter$) => {
        this.columnFilterStreams.push(filter$);
        if (this.columnFilterCount === this.columnFilterStreams.length) {
          combineLatest(this.columnFilterStreams)
            .pipe(
              takeUntil(this.columnResetSubject.asObservable()),
              untilDestroyed(this)
            )
            .subscribe((latest: Array<FilterChange>) => {
              this.columnFilterDebouncer.next(latest);
            });
        }
      };
    }
  }
}
