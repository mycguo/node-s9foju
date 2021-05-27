import {UpgradeStateStore, UpgradeState} from './upgradeState.store';
import {Query} from '@datorama/akita';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UpgradeStateQuery extends Query<UpgradeState> {
  constructor(protected store: UpgradeStateStore) {
    super(store);
  }
}
