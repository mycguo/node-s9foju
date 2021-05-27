import {Injectable} from '@angular/core';
import {AlertsSummaryState, AlertsSummaryStore} from './alertsSummary.store';
import {Query} from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
export class AlertsSummaryQuery extends Query<AlertsSummaryState> {
  constructor(protected store: AlertsSummaryStore) {
    super(store);
  }
}
