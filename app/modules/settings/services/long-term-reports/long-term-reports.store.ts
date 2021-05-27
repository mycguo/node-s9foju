import { Injectable } from '@angular/core';
import { LongTermReport } from './long-term-report.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface LongTermReportsState extends EntityState<LongTermReport> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: LongTermReportsStore.STORE_NAME, idKey: 'reportKey', resettable: true })
export class LongTermReportsStore extends EntityStore<LongTermReportsState> {

  static readonly STORE_NAME = 'LongTermReports';

  constructor() {
    super();
  }

}

