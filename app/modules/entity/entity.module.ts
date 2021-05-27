import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeviceCurrentFlowsTabComponent} from './components/device-current-flows-tab/device-current-flows-tab.component';
import {DeviceCurrentFlowTabContainer} from './containers/device-current-flow-tab/device-current-flow-tab.container';
import {DashboardModule} from '../dashboard/dashboard.module';
import {SharedModule} from '../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {FilterModule} from '../filter/filter.module';


@NgModule({
    imports: [
        CommonModule,
        DashboardModule,
        SharedModule,
        ReactiveFormsModule,
        FilterModule
    ],
  declarations: [
    DeviceCurrentFlowsTabComponent,
    DeviceCurrentFlowTabContainer
  ],
  exports: [
    DeviceCurrentFlowTabContainer
  ]
})
export class EntityModule {
}
