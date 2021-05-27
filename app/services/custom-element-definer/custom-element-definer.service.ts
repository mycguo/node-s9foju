import {Injectable, Injector} from '@angular/core';
import UpgradeComponent from '../../utils/UpgradeComponent.interface';
import {ElementZoneStrategyFactory} from 'elements-zone-strategy';
import {createCustomElement} from '@angular/elements';

@Injectable({
  providedIn: 'root'
})
export class CustomElementDefinerService {

  constructor(private injector: Injector) { }

  public defineCustomElements(upgradeElements: Array<UpgradeComponent>): void {
    for (const upgradeElement of upgradeElements) {
      const strategyFactory = new ElementZoneStrategyFactory(upgradeElement.component, this.injector);
      const el = createCustomElement(upgradeElement.component, { injector: this.injector, strategyFactory });
      // check that an element hasn't already been registered
      if (!customElements.get(upgradeElement.elementName)) {
        customElements.define(upgradeElement.elementName, el);
      }
    }
  }
}
