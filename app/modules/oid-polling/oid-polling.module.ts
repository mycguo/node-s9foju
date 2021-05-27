import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GridModule } from '../grid/grid.module';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomOidPollingDevicesComponent } from './components/custom-oid-polling-devices/custom-oid-polling-devices.component';
import { CustomOidPollingDevicesContainer } from './containers/custom-oid-polling-devices/custom-oid-polling-devices.container';
import { CustomOidPollingSettingsComponent } from './components/custom-oid-polling-settings/custom-oid-polling-settings.component';
import { CustomOidPollingPageContainer } from './containers/custom-oid-polling-page/custom-oid-polling-page.container';
import { CustomOidPollingModalComponent } from './components/custom-oid-polling-modal/custom-oid-polling-modal.component';
import { CustomOidPollingPageComponent } from './components/custom-oid-polling-page/custom-oid-polling-page.component';
import { OidPollingPageContainer } from './containers/oid-polling-page/oid-polling-page.container';
import { PreConfiguredOidPollingPageContainer } from './containers/pre-configured-oid-polling-page/pre-configured-oid-polling-page.container';
import { PreConfiguredOidPollingPageComponent } from './components/pre-configured-oid-polling-page/pre-configured-oid-polling-page.component';
import { PreConfiguredOidPollingModalComponent } from './components/pre-configured-oid-polling-modal/pre-configured-oid-polling-modal.component';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    GridModule,
    MatListModule,
  ],
  declarations: [
    CustomOidPollingDevicesComponent,
    CustomOidPollingDevicesContainer,
    CustomOidPollingSettingsComponent,
    CustomOidPollingPageContainer,
    CustomOidPollingModalComponent,
    CustomOidPollingPageComponent,
    OidPollingPageContainer,
    PreConfiguredOidPollingPageContainer,
    PreConfiguredOidPollingPageComponent,
    PreConfiguredOidPollingModalComponent,
  ],
})
export class OidPollingModule { }
