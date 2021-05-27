import { Injectable } from '@angular/core';
import {Store, StoreConfig} from '@datorama/akita';
import {UserPreferenceState} from './user-preference.state';

@Injectable({
  providedIn: 'root'
})
@StoreConfig({name: 'user-preferences'})
export class UserPreferencesStoreService extends Store<UserPreferenceState> {

  static readonly defaultState: UserPreferenceState = {
    useDeviceSystemName: false
  };

  constructor() {
    super(UserPreferencesStoreService.defaultState);
  }
}
