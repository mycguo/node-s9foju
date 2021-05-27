import {Store, StoreConfig} from '@datorama/akita';
import {DataSourceState} from './data-source-state';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@StoreConfig({
  name: 'dataSource',
  resettable: true
})
export class DataSourceStore extends Store<DataSourceState> {
  constructor() {
    super({flexFilter: ''});
  }
}
