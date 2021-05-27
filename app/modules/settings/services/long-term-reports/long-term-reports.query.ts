import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { LongTermReportsStore, LongTermReportsState } from './long-term-reports.store';

@Injectable({ providedIn: 'root' })
export class LongTermReportsQuery extends QueryEntity<LongTermReportsState> {

  constructor(protected store: LongTermReportsStore) {
    super(store);
  }

}
