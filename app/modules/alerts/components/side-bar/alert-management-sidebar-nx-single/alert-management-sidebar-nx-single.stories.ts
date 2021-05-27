import { moduleMetadata } from '@storybook/angular';
import { AlertManagementSidebarNxSingleComponent } from './alert-management-sidebar-nx-single.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import NxAlertManagement from '../../../services/nx-alert-management/models/nx-alert-management';
import { ALERT_CATEGORIES } from '../../../services/nx-alert-management/enums/alert-categories.enum';
import { AlertSeverity } from '../../../services/enums/alert-severity.enum';
import { ServiceNowCourier } from '../../../services/couriers/models/service-now-courier';
import { AlertManagementSidebarThresholdConfigFormComponent } from '../thresholds/alert-management-sidebar-threshold-config-form/alert-management-sidebar-threshold-config-form.component';
import { AlertManagementSidebarSharingComponent } from '../sharing/alert-management-sidebar-sharing/alert-management-sidebar-sharing.component';
import { ServiceNowSharingComponent } from '../sharing/service-now/service-now-sharing/service-now-sharing.component';
import { ServiceNowAlertOptionsContainer } from '../../../containers/side-bar/sharing/service-now-alert-options/service-now-alert-options.container';
import { ServiceNowAlertOptionsComponent } from '../sharing/service-now/service-now-alert-options/service-now-alert-options.component';
import { WebUiSharingComponent } from '../sharing/web-ui-sharing/web-ui-sharing.component';
import { SyslogSharingComponent } from '../sharing/syslog-sharing/syslog-sharing.component';
import { SnmpTrapSharingComponent } from '../sharing/snmp-trap-sharing/snmp-trap-sharing.component';
import { EmailSharingComponent } from '../sharing/email-sharing/email-sharing.component';
import { AlertManagementSidebarThresholdSingleComponent } from '../thresholds/alert-management-sidebar-threshold-single/alert-management-sidebar-threshold-single.component';
import { ThresholdComponentOption } from '../thresholds/threshold-component-option.enum';
import { AlertSharingConfig } from '../sharing/alert-sharing-config';

export default {
  title: 'Alerts/Sidebar/AlertManagementSidebarNxSingleComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [
        AlertManagementSidebarNxSingleComponent,
        AlertManagementSidebarThresholdConfigFormComponent,
        AlertManagementSidebarThresholdSingleComponent,
        AlertManagementSidebarSharingComponent,
        ServiceNowSharingComponent,
        ServiceNowAlertOptionsContainer,
        ServiceNowAlertOptionsComponent,
        WebUiSharingComponent,
        SyslogSharingComponent,
        SnmpTrapSharingComponent,
        EmailSharingComponent,
      ],
    }),
  ],
};

export const Default = () => ({
  template: `<nx-alert-management-sidebar-nx-single
                [isLoading]="isLoading"
                [sharingConfig]="sharingConfig"
                [alert]="alert"
    ></nx-alert-management-sidebar-nx-single>`,
  props: {
    isLoading: false,
    sharingConfig: {
      email: false,
      serviceNow: false,
      snmpTrap: false,
      webUi: true,
      syslog: false,
    },
    alert: new NxAlertManagement({
      useDefaultSharingConfig: false,
      id: 'id',
      name: 'Alert Name',
      type: 'alert_type',
      category: ALERT_CATEGORIES.APPLICATION,
      severity: AlertSeverity.CRITICAL,
      enabled: true,
      contributesToStatus: true,
      rank: -1,
      description:
        'Monitor performance of RTP based Voice, Video applications. An alert will be triggered if either threshold is crossed',
      coolDownMinutes: 0,
      instanceName: 'Instance Name',
      filterName: 'Filter Name',
      config: {
        timeOverMinutes: 0,
        thresholds: [],
        thresholdComponent: ThresholdComponentOption.DEFAULT,
      },
      sharing: {
        useDefaultSharingConfig: true,
        email: void 0,
        serviceNow: new ServiceNowCourier(void 0),
        syslog: void 0,
        snmpTrap: void 0,
        webUi: void 0,
      },
    }),
  },
});

Default.story = {
  name: 'default',
};
