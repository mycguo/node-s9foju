import {Injectable} from '@angular/core';
import {Store, StoreConfig} from '@datorama/akita';

export interface NotificationSidebarState {
  isOpen: boolean;
  tileOpenCount: {[tileGroupKey: string]: number };
  isPopupActive: boolean;
}

function createInitialState(): NotificationSidebarState {
  return {
    isOpen: false,
    tileOpenCount: {},
    isPopupActive: true
  };
}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'notificationSidebar' })
export class NotificationSidebarStore extends Store<NotificationSidebarState> {
  constructor() {
    super(createInitialState());
  }

  setIsSidebarOpen(isOpen: boolean) {
    this.update({ isOpen });
  }

  setTileOpenCount(tileGroupKey: string, tileOpenCount: number) {
    const tileGroupState = this._value().tileOpenCount;
    const updatedTileGroupState = {...tileGroupState};
    updatedTileGroupState[tileGroupKey] = tileOpenCount;
    this.update({ tileOpenCount: updatedTileGroupState });
  }

  setIsPopupActive(isActive: boolean) {
    this.update({ isPopupActive: isActive });
  }
}
