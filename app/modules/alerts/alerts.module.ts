import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlertManagementNxTableComponent} from './components/alert-management-nx-table/alert-management-nx-table.component';
import {GridModule} from '../grid/grid.module';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AlertManagementNxTableContainer} from './containers/alert-management-nx-table/alert-management-nx-table.container';
import {AlertManagementSdwanTableComponent} from './components/alert-management-sdwan-table/alert-management-sdwan-table.component';
import {AlertManagementSdwanTableContainer} from './containers/alert-management-sdwan-table/alert-management-sdwan-table.container';
import { ServiceNowAlertOptionsContainer } from './containers/side-bar/sharing/service-now-alert-options/service-now-alert-options.container';
import {ServiceNowAlertOptionsComponent} from './components/side-bar/sharing/service-now/service-now-alert-options/service-now-alert-options.component';
import {AlertManagementPageComponent} from './components/alert-management-page/alert-management-page.component';
import { AlertManagementPageContainer } from './containers/alert-management-page/alert-management-page.container';
import { AlertManagementSidebarNxSingleComponent } from './components/side-bar/alert-management-sidebar-nx-single/alert-management-sidebar-nx-single.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { AlertManagementSidebarThresholdConfigFormComponent } from './components/side-bar/thresholds/alert-management-sidebar-threshold-config-form/alert-management-sidebar-threshold-config-form.component';
import {AlertManagementSidebarThresholdSingleComponent} from './components/side-bar/thresholds/alert-management-sidebar-threshold-single/alert-management-sidebar-threshold-single.component';
import { AlertManagementSidebarThresholdMultipleComponent } from './components/side-bar/thresholds/alert-management-sidebar-threshold-multiple/alert-management-sidebar-threshold-multiple.component';
import { AlertManagementSidebarThresholdQosComponent } from './components/side-bar/thresholds/alert-management-sidebar-threshold-qos/alert-management-sidebar-threshold-qos.component';
import { AlertManagementSidebarNxSingleContainer } from './containers/alert-management-sidebar-nx-single/alert-management-sidebar-nx-single.container';
import { AlertManagementSidebarSharingComponent } from './components/side-bar/sharing/alert-management-sidebar-sharing/alert-management-sidebar-sharing.component';
import { ServiceNowSharingComponent } from './components/side-bar/sharing/service-now/service-now-sharing/service-now-sharing.component';
import { WebUiSharingComponent } from './components/side-bar/sharing/web-ui-sharing/web-ui-sharing.component';
import { SyslogSharingComponent } from './components/side-bar/sharing/syslog-sharing/syslog-sharing.component';
import { SnmpTrapSharingComponent } from './components/side-bar/sharing/snmp-trap-sharing/snmp-trap-sharing.component';
import { EmailSharingComponent } from './components/side-bar/sharing/email-sharing/email-sharing.component';
import { AlertManagementSidebarSdwanContainer } from './containers/alert-management-sidebar-sdwan/alert-management-sidebar-sdwan.container';
import { AlertManagementSidebarSdwanComponent } from './components/side-bar/alert-management-sidebar-sdwan/alert-management-sidebar-sdwan.component';
import { AlertManagementSidebarSharingContainer } from './containers/side-bar/sharing/alert-management-sidebar-sharing/alert-management-sidebar-sharing.container';
import {IntegrationsModule} from '../integrations/integrations.module';
import { ServiceNowSharingContainer } from './containers/side-bar/sharing/service-now-sharing/service-now-sharing.container';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    IntegrationsModule
  ],
  declarations: [
    AlertManagementNxTableComponent,
    AlertManagementNxTableContainer,
    AlertManagementSdwanTableComponent,
    AlertManagementSdwanTableContainer,
    ServiceNowAlertOptionsComponent,
    ServiceNowAlertOptionsContainer,
    AlertManagementSdwanTableContainer,
    AlertManagementPageComponent,
    AlertManagementPageContainer,
    AlertManagementSidebarNxSingleComponent,
    AlertManagementSidebarThresholdConfigFormComponent,
    AlertManagementSidebarThresholdSingleComponent,
    AlertManagementSidebarThresholdMultipleComponent,
    AlertManagementSidebarThresholdQosComponent,
    AlertManagementSidebarNxSingleContainer,
    AlertManagementSidebarSharingComponent,
    ServiceNowSharingComponent,
    WebUiSharingComponent,
    SyslogSharingComponent,
    SnmpTrapSharingComponent,
    EmailSharingComponent,
    AlertManagementSidebarSdwanContainer,
    AlertManagementSidebarSdwanComponent,
    AlertManagementSidebarSharingContainer,
    ServiceNowSharingContainer
  ],
  exports: [
    ServiceNowAlertOptionsContainer,
    AlertManagementPageContainer
  ]
})
export class AlertsModule {
}
