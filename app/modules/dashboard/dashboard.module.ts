import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardWidgetComponent } from './components/dashboard-widget/dashboard-widget.component';
import { DashboardWidgetTableComponent } from './components/dashboard-widget-table/dashboard-widget-table.component';
import {GridModule} from '../grid/grid.module';
import {SharedModule} from '../shared/shared.module';
import { WidgetVisualDirective } from './directives/widget-visual.directive';
import { DashboardWidgetVisualComponent } from './components/dashboard-widget-visual/dashboard-widget-visual.component';
import WidgetDataProvider from './containers/dashboard-widget/widget-data-provider';
import {NullWidgetDataProviderService} from './services/null-widget-data-provider/null-widget-data-provider.service';
import {DashboardWidgetContainer} from './containers/dashboard-widget/dashboard-widget.container';
import { DashboardWidgetFilteredTableContainer } from './containers/dashboard-widget-filtered-table/dashboard-widget-filtered-table-container.component';
import { DashboardWidgetStackedBarComponent } from './components/dashboard-widget-stacked-bar/dashboard-widget-stacked-bar.component';
import { DashboardWidgetMapComponent } from './components/dashboard-widget-map/dashboard-widget-map.component';
import { DashboardWidgetFilteredTableComponent } from './components/dashboard-widget-filtered-table/dashboard-widget-filtered-table.component';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    DashboardWidgetContainer,
    DashboardWidgetComponent,
    DashboardWidgetTableComponent,
    WidgetVisualDirective,
    DashboardWidgetVisualComponent,
    DashboardWidgetFilteredTableContainer,
    DashboardWidgetStackedBarComponent,
    DashboardWidgetMapComponent,
    DashboardWidgetFilteredTableComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GridModule,
    FormsModule,
  ],
  entryComponents: [
    DashboardWidgetVisualComponent,
    DashboardWidgetTableComponent,
    DashboardWidgetStackedBarComponent,
  ],
  exports: [
    DashboardWidgetContainer,
    DashboardWidgetTableComponent,
    DashboardWidgetStackedBarComponent,
  ],
  providers: [
    {provide: WidgetDataProvider, useExisting: NullWidgetDataProviderService}
  ]
})
export class DashboardModule { }
