import { moduleMetadata } from '@storybook/angular';
import { StatusAlertDetailsDrawerComponent } from './status-alert-details-drawer.component';
import { KeyValueListComponent } from '../../../shared/components/key-value-list/key-value-list.component';
import { KeyValueListItemDirective } from '../../../shared/components/key-value-list/key-value-list-item/key-value-list-item.directive';
import { SeverityIndicatorComponent } from '../../../shared/components/severity-indicator/severity-indicator.component';
import { StatusAlertDetailsParametersGroupComponent } from '../status-alert-details-parameters-group/status-alert-details-parameters-group.component';
import { RouterTestingModule } from '@angular/router/testing';

export default {
  title: 'Topology/StatusAlertDetailsDrawerComponent',

  decorators: [
    moduleMetadata({
      declarations: [
        StatusAlertDetailsDrawerComponent,
        KeyValueListComponent,
        KeyValueListItemDirective,
        SeverityIndicatorComponent,
        StatusAlertDetailsParametersGroupComponent,
      ],
      imports: [RouterTestingModule],
    }),
  ],
};

export const InitialOption = () => {
  return {
    template: `<nx-status-alert-details-drawer [details]="details" style="width: 354px"></nx-status-alert-details-drawer>`,
    props: {
      details: {
        version: '1',
        alertId: 'fd5b7604-d59e-4df7-a3c4-f1b5b9380029',
        type: 'DEVICE_CPU',
        alertCategory: 'DEVICE_INTERFACE',
        alertIdentifierId: '276c4af4-1155-4ea0-b744-281eb20c6c0e',
        dateCreated: '2019-10-23T00:12:32.031Z',
        durationSinceCreatedMinutes: 10697,
        durationActiveMinutes: 10697,
        severity: 'Critical',
        userStatus: 'ACTIVE',
        alertState: 'ACTIVE',
        dateOfLastAlertStateChange: '2019-10-23T00:12:32.031Z',
        description: {
          title: 'Device CPU Utilization',
          summary:
            'NYC-SwitchV1.liveaction.com CPU utilization is above threshold',
          details: [
            {
              label: 'Device',
              value: 'NYC-SwitchV1.liveaction.com',
            },
            {
              label: 'Initial CPU Percentage',
              value: '82 %',
            },
            {
              label: 'Latest CPU Percentage',
              value: '85 %',
            },
          ],
          sourceInfo: [
            {
              type: 'DEVICE',
              label: 'Device',
              displayValue: 'NYC-SwitchV1.liveaction.com',
              rawValue: {
                deviceSerial: '9608UCQXQMU',
                deviceName: 'NYC-SwitchV1.liveaction.com',
              },
            },
          ],
        },
        alertIntegrations: {
          serviceNowAlertIntegration: null,
        },
        sourceSite: {
          siteId: 'c4d6ae82-2ff5-4491-a9f4-9e37b27c998c',
          siteName: 'MONTREAL-VE-04',
        },
      },
    },
  };
};

InitialOption.story = {
  name: 'Initial option',
};
