import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FilterChangedEvent, IAfterGuiAttachedParams, IFloatingFilter} from 'ag-grid-community';
import {AgFrameworkComponent} from 'ag-grid-angular';
import {GridColumnFilterParams} from '../../../models/grid-column-filter-params';
import {GridColumnFilter} from '../grid-column-filter';

@Component({
  selector: 'nx-ag-grid-column-filter',
  templateUrl: './ag-grid-column-filter.component.html',
  styleUrls: ['./ag-grid-column-filter.component.less']
})
export class AgGridColumnFilterComponent implements
  IFloatingFilter, // To support ag-grid floating filter
  AgFrameworkComponent<GridColumnFilterParams<any, any>> {

  @ViewChild('filter', { read: ViewContainerRef, static: true }) filterTemplate;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  }

  /***
   * Initialize the configuration for the grid column filter component.
   * @param config GridColumnFilterParams should include all options required for initializing the column filter.
   */
  agInit(config: GridColumnFilterParams<any, any>): void {
    const componentRef = this._injectFilterComponent(config, this.componentFactoryResolver, this.filterTemplate);
    const gridColumnFilter = <GridColumnFilter<any, any>>componentRef.instance;
    config.subscribeToFilterEvents(gridColumnFilter.filterChanged$);
    gridColumnFilter.onFilterInit(config);
  }

  onParentModelChanged(parentModel: any, filterChangedEvent?: FilterChangedEvent): void {
  }

  _injectFilterComponent(filterConfig: GridColumnFilterParams<any, any>,
                         componentFactoryResolver: ComponentFactoryResolver,
                         filterTemplateRef: ViewContainerRef): ComponentRef<any> {
    const componentFactory = componentFactoryResolver.resolveComponentFactory(filterConfig.componentType);
    const viewContainerRef = filterTemplateRef;
    viewContainerRef.clear();
    return viewContainerRef.createComponent(componentFactory);
  }

}
