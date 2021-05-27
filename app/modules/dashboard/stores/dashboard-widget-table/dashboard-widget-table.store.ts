import { Injectable } from '@angular/core';
import {EntityStore, guid, StoreConfig} from '@datorama/akita';
import {DashboardWidgetTableState} from './dashboard-widget-table-state';



@Injectable({ providedIn: 'root' })
@StoreConfig({ name: `dashboard-widget-table-${guid()}`})
export class DashboardWidgetTableStore extends EntityStore<DashboardWidgetTableState> {

  constructor() {
    super();
  }

}

