import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './components/grid/grid.component';
import { SelectFilterComponent } from './components/filters/select-filter/select-filter.component';
import { AgGridColumnFilterComponent } from './components/filters/ag-grid-column-filter/ag-grid-column-filter.component';
import { TextFilterComponent } from './components/filters/text-filter/text-filter.component';
import {AgGridModule} from 'ag-grid-angular';
import {FormsModule} from '@angular/forms';
import { TableStringFilterComponent } from './components/filters/table-string-filter/table-string-filter.component';
import { GridCheckMarkCellRendererComponent } from './components/cell-renders/grid-check-mark-cell-renderer/grid-check-mark-cell-renderer.component';
import {SharedModule} from '../shared/shared.module';
import {SeverityCellRendererComponent} from './components/cell-renders/severity-cell-renderer/severity-cell-renderer.component';
import { StatusCellRendererComponent } from './components/cell-renders/status-cell-renderer/status-cell-renderer.component';
import {AlertTypeCellRendererComponent} from './components/cell-renders/alert-type-cell-renderer/alert-type-cell-renderer.component';
import { LinkCellRendererComponent } from './components/cell-renders/link-cell-renderer/link-cell-renderer.component';
import { DatetimeCellRendererComponent } from './components/cell-renders/datetime-cell-renderer/datetime-cell-renderer.component';
import {GridTooltipComponent} from './components/grid-tooltip/grid-tooltip.component';
import { UnitCellRendererComponent } from './components/cell-renders/unit-cell-renderer/unit-cell-renderer.component';
import { PeekCellRendererComponent } from './components/cell-renders/peek-cell-renderer/peek-cell-renderer.component';
import { ErrorCellRendererComponent } from './components/cell-renders/error-cell-renderer/error-cell-renderer.component';
import { DrillDownCellRenderComponent } from './components/cell-renders/drill-down-cell-render/drill-down-cell-render.component';
import { GridStatusBarComponent } from './components/grid-status-bar/grid-status-bar.component';

@NgModule({
  imports: [
    CommonModule,
    AgGridModule.withComponents([
      AgGridColumnFilterComponent,
      TextFilterComponent,
      SelectFilterComponent,
      GridCheckMarkCellRendererComponent,
      StatusCellRendererComponent,
      SeverityCellRendererComponent,
      PeekCellRendererComponent,
      ErrorCellRendererComponent,
      AlertTypeCellRendererComponent,
      UnitCellRendererComponent
    ]),
    FormsModule,
    SharedModule,
  ],
    exports: [
        GridComponent,
        TextFilterComponent,
        TableStringFilterComponent,
        StatusCellRendererComponent,
        GridStatusBarComponent
    ],
  declarations: [
    GridComponent,
    SelectFilterComponent,
    AgGridColumnFilterComponent,
    TextFilterComponent,
    TableStringFilterComponent,
    GridCheckMarkCellRendererComponent,
    SeverityCellRendererComponent,
    PeekCellRendererComponent,
    StatusCellRendererComponent,
    ErrorCellRendererComponent,
    AlertTypeCellRendererComponent,
    LinkCellRendererComponent,
    GridTooltipComponent,
    DatetimeCellRendererComponent,
    UnitCellRendererComponent,
    DrillDownCellRenderComponent,
    GridStatusBarComponent
  ]
})
export class GridModule { }
