import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IpslaStoryDowngradeContainer} from './containers/downgrades/ipsla-story-downgrade/ipsla-story-downgrade.container';
import UpgradeComponent from '../../utils/UpgradeComponent.interface';
import {SharedModule} from '../shared/shared.module';
import {GridModule} from '../grid/grid.module';
import {CustomElementDefinerService} from '../../services/custom-element-definer/custom-element-definer.service';
import {IntegrationsModule} from '../integrations/integrations.module';
import { IpslaStoryComponent } from './components/ipsla-story/ipsla-story.component';
import {DashboardModule} from '../dashboard/dashboard.module';
import { IpslaStoryTabContainer } from './containers/ipsla-story-tab/ipsla-story-tab.container';
import {FormsModule} from '@angular/forms';
import { IpslaStoryContainer } from './containers/ipsla-story/ipsla-story.container';
import { IpslaStatusPopUpComponent } from './components/ipsla-status-pop-up/ipsla-status-pop-up.component';
import { IpslaStoryTabComponent } from './components/ipsla-story-tab/ipsla-story-tab.component';

const upgradeElements: Array<UpgradeComponent> = [
  {component: IpslaStoryDowngradeContainer, elementName: 'nxu-ipsla-story'},
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    GridModule,
    DashboardModule,
    FormsModule,
  ],
  exports: [],
  declarations: [
    IpslaStoryDowngradeContainer,
    IpslaStoryComponent,
    IpslaStoryTabContainer,
    IpslaStoryContainer,
    IpslaStatusPopUpComponent,
    IpslaStoryTabComponent
  ]
})
export class StoryModule {
  static defineCustomElements = true;

  static forRoot(defineCustomElements: boolean) {
    StoryModule.defineCustomElements = defineCustomElements;
    IntegrationsModule.defineCustomElements = defineCustomElements;
    return StoryModule;
  }

  constructor(private customElementDefiner: CustomElementDefinerService) {
    if (StoryModule.defineCustomElements) {
      this.customElementDefiner.defineCustomElements(upgradeElements);
    }
  }
}
