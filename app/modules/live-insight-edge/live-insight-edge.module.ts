import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IntegrationsModule} from '../integrations/integrations.module';
import { LiveInsightEdgePageComponent } from './components/live-insight-edge-page/live-insight-edge-page.component';
import { LiveInsightEdgeConfigModalComponent } from './components/live-insight-edge-config-modal/live-insight-edge-config-modal.component';
import { LiveInsightEdgeConfigDisplayComponent } from './components/live-insight-edge-config-display/live-insight-edge-config-display.component';
import { LiveInsightEdgeDeviceListComponent } from './components/live-insight-edge-device-list/live-insight-edge-device-list.component';
import {LiveInsightEdgeConfigModalContainer} from './containers/live-insight-edge-config-modal-container/live-insight-edge-config-modal.container';
import {GridModule} from '../grid/grid.module';
import { LiveInsightEdgeMonitoredDevicesComponent } from './components/live-insight-edge-monitored-devices/live-insight-edge-monitored-devices.component';
import { LiveInsightEdgeAddDeviceModalComponent } from './components/live-insight-edge-add-device-modal/live-insight-edge-add-device-modal.component';
import {LiveInsightEdgeMonitoredDevicesContainer} from './containers/live-insight-edge-monitored-devices/live-insight-edge-monitored-devices.container';
import { LiveInsightEdgeMonitoredDeviceCellRendererComponent } from './components/live-insight-edge-monitored-device-cell-renderer/live-insight-edge-monitored-device-cell-renderer.component';
import {LiveInsightEdgeAddDeviceModalContainer} from './containers/live-insight-edge-add-device-modal/live-insight-edge-add-device-modal.container';
import UpgradeComponent from '../../utils/UpgradeComponent.interface';
import {CustomElementDefinerService} from '../../services/custom-element-definer/custom-element-definer.service';
import {LiveInsightEdgePageDowngradeContainer} from './containers/downgrades/live-insight-edge-page-downgrade/live-insight-edge-page-downgrade.container';
import {LiveInsightEdgePageContainer} from './containers/live-insight-edge-page/live-insight-edge-page.container';
import {LiveInsightEdgeConfigDisplayContainer} from './containers/live-insight-edge-config-display/live-insight-edge-config-display.container';
import { LiveInsightEdgeReportsComponent } from './components/live-insight-edge-reports/live-insight-edge-reports.component';
import {LiveInsightEdgeReportsContainer} from './containers/live-insight-edge-reports-container/live-insight-edge-reports.container';
import {LiveInsightEdgeReportsDowngradeContainer} from './containers/downgrades/live-insight-edge-reports-downgrade-container/live-insight-edge-reports-downgrade.container';
import { LiveInsightEdgeReportsListComponent } from './components/live-insight-edge-reports-list/live-insight-edge-reports-list.component';
import { LiveInsightEdgeSummaryComponent } from './components/live-insight-edge-summary/live-insight-edge-summary.component';
import {DashboardModule} from '../dashboard/dashboard.module';
import { LiveInsightEdgeSummaryContainer } from './containers/live-insight-edge-summary-container/live-insight-edge-summary.container';
import { LiveInsightEdgeApplicationGroupListComponent } from './components/live-insight-edge-application-group-list/live-insight-edge-application-group-list.component';
import {LiveInsightEdgeMonitoredApplicationGroupsComponent} from './components/live-insight-edge-monitored-application-groups/live-insight-edge-monitored-application-groups.component';
import { LiveInsightEdgeMonitoredApplicationGroupsContainer } from './containers/live-insight-edge-monitored-application-groups/live-insight-edge-monitored-application-groups.container';
import { LiveInsightEdgeAddApplicationGroupModalContainer } from './containers/live-insight-edge-add-application-group-modal/live-insight-edge-add-application-group-modal.container';
import { LiveInsightEdgeAddAppGroupModalComponent } from './components/live-insight-edge-add-app-group-modal/live-insight-edge-add-app-group-modal.component';
import {LiveInsightEdgeReportsPageDowngradeContainer} from './containers/downgrades/live-insight-edge-reports-page-downgrade/live-insight-edge-reports-page-downgrade.container';
import {FilterModule} from '../filter/filter.module';
import {LiveInsightEdgeDataSourceModalComponent} from './components/live-insight-edge-data-source-modal/live-insight-edge-data-source-modal.component';
import { LiveInsightEdgePredictionsPageDowngradeContainer } from './containers/downgrades/live-insight-edge-predictions-page-downgrade/live-insight-edge-predictions-page-downgrade.container';
import { LiveInsightEdgePredictionsPageContainer } from './containers/live-insight-edge-predictions-page/live-insight-edge-predictions-page.container';
import { LiveInsightEdgePredictionsReportsListComponent } from './components/live-insight-edge-predictions-reports-list/live-insight-edge-predictions-reports-list.component';
import { LiveInsightEdgeSnmpImportModalComponent } from './components/live-insight-edge-snmp-import-modal/live-insight-edge-snmp-import-modal.component';

const upgradeElements: Array<UpgradeComponent> = [
  { component: LiveInsightEdgePageDowngradeContainer, elementName: 'nxu-live-insight-edge-page' },
  { component: LiveInsightEdgeReportsPageDowngradeContainer, elementName: 'nxu-live-insight-edge-reports' },
  { component: LiveInsightEdgePredictionsPageDowngradeContainer, elementName: 'nxu-live-insight-edge-predictions'}
];

@NgModule({
  declarations: [
    LiveInsightEdgePageComponent,
    LiveInsightEdgeConfigModalContainer,
    LiveInsightEdgeConfigModalComponent,
    LiveInsightEdgeConfigDisplayComponent,
    LiveInsightEdgeDeviceListComponent,
    LiveInsightEdgeMonitoredDevicesComponent,
    LiveInsightEdgeAddDeviceModalComponent,
    LiveInsightEdgeMonitoredDevicesContainer,
    LiveInsightEdgeMonitoredDeviceCellRendererComponent,
    LiveInsightEdgeAddDeviceModalContainer,
    LiveInsightEdgePageDowngradeContainer,
    LiveInsightEdgePageContainer,
    LiveInsightEdgeConfigDisplayContainer,
    LiveInsightEdgeReportsComponent,
    LiveInsightEdgeReportsContainer,
    LiveInsightEdgeReportsDowngradeContainer,
    LiveInsightEdgeReportsListComponent,
    LiveInsightEdgeSummaryComponent,
    LiveInsightEdgeSummaryContainer,
    LiveInsightEdgeMonitoredApplicationGroupsComponent,
    LiveInsightEdgeApplicationGroupListComponent,
    LiveInsightEdgeMonitoredApplicationGroupsContainer,
    LiveInsightEdgeAddApplicationGroupModalContainer,
    LiveInsightEdgeAddAppGroupModalComponent,
    LiveInsightEdgeReportsPageDowngradeContainer,
    LiveInsightEdgePredictionsPageDowngradeContainer,
    LiveInsightEdgePredictionsPageContainer,
    LiveInsightEdgeDataSourceModalComponent,
    LiveInsightEdgePredictionsReportsListComponent,
    LiveInsightEdgeSnmpImportModalComponent,
  ],
  exports: [
    LiveInsightEdgeSummaryComponent,
    LiveInsightEdgeSummaryContainer
  ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        IntegrationsModule,
        GridModule,
        DashboardModule,
        FilterModule,
    ]
})
export class LiveInsightEdgeModule {
  static defineCustomElements = true;
  static forRoot(defineCustomElements: boolean) {
    LiveInsightEdgeModule.defineCustomElements = defineCustomElements;
    IntegrationsModule.defineCustomElements = defineCustomElements;
    return LiveInsightEdgeModule;
  }
  constructor(private customElementDefiner: CustomElementDefinerService) {
    if (LiveInsightEdgeModule.defineCustomElements) {
      this.customElementDefiner.defineCustomElements(upgradeElements);
    }
  }
}
