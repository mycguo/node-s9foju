import { moduleMetadata } from '@storybook/angular';
import { StatusAlertsComponent } from './status-alerts.component';
import { SharedModule } from '../../../shared/shared.module';
import { StatusAlertsItemComponent } from '../status-alerts-item/status-alerts-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import SeverityTypes from '../../../../../../../project_typings/api/alerting/alerts/SeverityTypes';
import { StatusTimePipe } from '../../pipes/status-time.pipe';
import { StatusAlertDetailsDrawerComponent } from '../status-alert-details-drawer/status-alert-details-drawer.component';
import { StatusAlertDetailsParametersGroupComponent } from '../status-alert-details-parameters-group/status-alert-details-parameters-group.component';
import { StatusAlertsService } from '../../services/status-alerts/status-alerts.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import StatusAlertItem from '../status-alerts-item/interfaces/status-alert-item';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import StatusAlertsState from '../../containers/status-alerts-container/interfaces/status-alerts-state';
import { MatSidenavModule } from '@angular/material/sidenav';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

const alertsProps: any[] = [
  {
    alertId: 'critical-1234-4567-7890-1234',
    severity: SeverityTypes.CRITICAL,
    sourceSite: { siteId: '1234-5678', siteName: 'LondonEdge' },
    description: {
      title: 'Interface Errors (CRC, Frame, Overruns, Ignore, Abort)',
      summary:
        'GigabitEthernet1/0/48 on SW3750_2.gbsfo.com was no longer exceeding drop threshold in the Output direction.',
    },
    dateCreated: '2019-10-25T06:20:35.331Z',
  },
  {
    alertId: 'warning-1234-4567-7890-1234',
    severity: SeverityTypes.WARNING,
    sourceSite: { siteId: '1234-5678', siteName: 'NewYorkEdge' },
    description: {
      title: ' Media Jitter Max',
      summary:
        'LDN-SwitchV1.liveaction.com running application rtp had 63.49 ms of jitter for traffic with a DSCP value of 0 (BE)',
    },
    dateCreated: '2019-10-24T09:30:35.331Z',
  },
  {
    alertId: 'info-1234-4567-7890-1234',
    severity: SeverityTypes.INFO,
    sourceSite: { siteId: '1234-5678', siteName: 'VANCOUVER-VE-03' },
    description: {
      title: 'Cisco IWAN Path Change',
      // tslint:disable-next-line:max-line-length
      summary:
        'Traffic from 192.168.200.4 (Milky Way) with a DSCP value of 20 (AF22) and a destination of 192.168.100.0/24 (Constelation) for application 0:0 has changed paths. The service provider for this traffic has changed to ISP-200.',
    },
    dateCreated: '2019-10-22T10:45:35.331Z',
  },
];

@Injectable()
class MockStatusAlertsService {
  setActiveAlert(alertId): StatusAlertItem {
    return alertsProps.find((alert) => alert.alertId === alertId);
  }
}

export default {
  title: 'Topology/AlertContainerComponent',

  decorators: [
    moduleMetadata({
      imports: [
        SharedModule,
        MatSidenavModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        LoggerTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      declarations: [
        StatusAlertsItemComponent,
        StatusAlertDetailsDrawerComponent,
        StatusAlertDetailsParametersGroupComponent,
        StatusAlertsComponent,
        StatusTimePipe,
      ],
      providers: [
        { provide: StatusAlertsService, useClass: MockStatusAlertsService },
      ],
    }),
  ],
};

export const Default = () => {
  return {
    template: `<div style="width: 358px;">
                  <nx-status-alerts [alerts]="alerts"
                                    [isloading]="isLoading"
                                    [error]="error"
                                    [alertsLimit]="alertsLimit"
                                    (closeDrawer)="onCloseDrawer()"></nx-status-alerts>
                  </div>`,
    component: StatusAlertsComponent,
    props: <StatusAlertsState>{
      alerts: alertsProps,
      isLoading: false,
      error: undefined,
      alertsLimit: {
        limit: 3,
        isReached: true,
      },
    },
  };
};

Default.story = {
  name: 'default',
};
