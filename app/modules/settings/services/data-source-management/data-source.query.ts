import {DataSourceState} from './data-source-state';
import {Query} from '@datorama/akita';
import {DataSourceStore} from './data-source.store';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSourceQuery extends Query<DataSourceState> {

  selectFlexFilter$ = this.select('flexFilter');

  constructor(protected store: DataSourceStore) {
    super(store);
  }
}
