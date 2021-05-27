import { action } from '@storybook/addon-actions';
import { StatusAlertsItemComponent } from './status-alerts-item.component';
import SeverityTypes from '../../../../../../../project_typings/api/alerting/alerts/SeverityTypes';
import { StatusTimePipe } from '../../pipes/status-time.pipe';

export default {
  title: 'Topology/AlertItemComponent',
};

export const Default = () => {
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

  return {
    template: `<div style="width: 358px;">
                <nx-status-alerts-item [alert]="alert" (alertClick)="onClick($event)" *ngFor="let alert of alerts"></nx-status-alerts-item>
               </div>`,
    props: {
      alerts: alertsProps,
      onClick: action('Selected alert id'),
    },
    moduleMetadata: {
      declarations: [StatusAlertsItemComponent, StatusTimePipe],
    },
  };
};
