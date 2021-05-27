import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowRefService {

  constructor() { }

  get nativeWindow(): Window {
    return window;
  }

  public generateServerBaseUrl() {
    return `${window.location.protocol}//${window.location.hostname}`;
  }
}
