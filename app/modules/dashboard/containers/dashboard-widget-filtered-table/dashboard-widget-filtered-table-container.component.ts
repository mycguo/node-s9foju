import {Component, Input, OnDestroy, OnInit, Self} from '@angular/core';
import GridData from '../../../grid/models/grid-data.model';
import {DashboardWidgetTableConfig} from '../../components/dashboard-widget-table/dashboard-widget-table-config';
import {DashboardWidgetTableService} from '../../services/dashboard-widget-table/dashboard-widget-table.service';
import {CommonService} from '../../../../utils/common/common.service';
import FilterChange from '../../../grid/components/filters/filter-change';
import {GridColumnSort} from '../../../grid/models/grid-column-sort';
import {WidgetVisualComponent} from '../dashboard-widget/widget-visual.component';
import {VisualDataGenerator} from '../dashboard-widget/visual-data-generator';
import {ReportTableDataGeneratorService} from '../../services/report-table-config-generator/report-table-data-generator.service';
import {Observable} from 'rxjs';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {map} from 'rxjs/operators';
import {guid} from '@datorama/akita';
import {DashboardWidgetFilteredTableConfig} from '../../components/dashboard-widget-filtered-table/dashboard-widget-filtered-table-config';

@UntilDestroy()
@Component({
  selector: 'nx-dashboard-widget-table-container',
  template: `
    <nx-dashboard-widget-filtered-table
      [data]="filteredTableData$ | async"
      [config]="config"
      (globalSearchChanged)="globalSearchFilterHandler($event)"
      (columnFilterChanged)="columnFilterHandler($event)"
      (columnSortChanged)="columnSortHandler($event)">
    </nx-dashboard-widget-filtered-table>
  `,
  styles: [],
  providers: [
    DashboardWidgetTableService,
    ReportTableDataGeneratorService
  ]
})
export class DashboardWidgetFilteredTableContainer implements OnInit, OnDestroy,
  WidgetVisualComponent<Array<{ [key: string]: string }>, DashboardWidgetTableConfig> {
  // This allows data to still be set through inputs while allowing behavior set for data field on interface.
  // tslint:disable-next-line:no-input-rename
  @Input('data') dataInternal: Array<{ [key: string]: any }>;
  // tslint:disable-next-line:no-input-rename
  @Input('config') configInternal: DashboardWidgetTableConfig;

  filteredTableData$: Observable<GridData<{ [key: string]: string }>>;

  constructor(private commonService: CommonService,
              private dashboardWidgetTableService: DashboardWidgetTableService,
              @Self() private tableConfigGenerator: ReportTableDataGeneratorService) {
  }

  get data(): Array<{ [key: string]: any }> {
    return this.dataInternal;
  }

  set data(data: Array<{ [key: string]: any }>) {
    if (data != null) {
      this.dataInternal = data;
      this.dashboardWidgetTableService.updateStore(this.data.map((row) => {
        if (!row.hasOwnProperty('id')) {
          return {...row, id: guid()};
        } else {
          return row;
        }
      }));
    }
  }

  get config(): DashboardWidgetFilteredTableConfig {
    return this.configInternal;
  }

  set config(config: DashboardWidgetFilteredTableConfig) {
    if (config != null) {
      // clear filters if config (ie columns) change
      this.dashboardWidgetTableService.clearFilters();
      this.dashboardWidgetTableService.updateFilterableFields(config.filterableColumns ?? []);
      this.configInternal = config;
    }
  }

  ngOnInit(): void {
    this.filteredTableData$ = this.dashboardWidgetTableService.selectedFilteredItems()
      .pipe(
        untilDestroyed(this),
        map((gridData: Array<{ [key: string]: string }>) => {
          return new GridData(gridData);
        })
      );
  }

  ngOnDestroy() {
    this.dashboardWidgetTableService.reset();
  }

  get dataGenerator(): VisualDataGenerator {
    return this.tableConfigGenerator;
  }

  columnFilterHandler(filterChanges: Array<FilterChange>): void {
    filterChanges.forEach((filter: FilterChange) => {
      if (filter.field !== void 0) {
        this.dashboardWidgetTableService.setFilter(filter.field, filter.term);
      }
    });
  }

  columnSortHandler(sort: GridColumnSort): void {
    if (sort === void 0) {
      this.dashboardWidgetTableService.clearSort();
    } else {
      this.dashboardWidgetTableService.setSortBy(sort.colId, sort.sort, sort.customSortFn);
    }
  }

  globalSearchFilterHandler(globalSearchTerm: string): void {
    this.dashboardWidgetTableService.setGlobalFilter(globalSearchTerm);
  }
}
