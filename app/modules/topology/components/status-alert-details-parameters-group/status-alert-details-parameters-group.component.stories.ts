import { moduleMetadata } from '@storybook/angular';
import { KeyValueListComponent } from '../../../shared/components/key-value-list/key-value-list.component';
import { KeyValueListItemDirective } from '../../../shared/components/key-value-list/key-value-list-item/key-value-list-item.directive';
import { SeverityIndicatorComponent } from '../../../shared/components/severity-indicator/severity-indicator.component';
import { StatusAlertDetailsParametersGroupComponent } from './status-alert-details-parameters-group.component';
import { Group } from './models/group/group';
import { RouterTestingModule } from '@angular/router/testing';
import LinkParameter from './models/parameter/parameter-type/link-parameter';
import SeverityParameter from './models/parameter/parameter-type/severity-parameter';
import SeverityTypes from '../../../../../../../project_typings/api/alerting/alerts/SeverityTypes';
import StringParameter from './models/parameter/parameter-type/string-parameter';

export default {
  title: 'Topology/StatusAlertDetailsParametersGroupComponent',

  decorators: [
    moduleMetadata({
      declarations: [
        KeyValueListComponent,
        KeyValueListItemDirective,
        SeverityIndicatorComponent,
        StatusAlertDetailsParametersGroupComponent,
      ],
      imports: [RouterTestingModule],
    }),
  ],
};

export const String = () => {
  return {
    template: `<nx-status-alert-details-parameters-group [group]="group" style="width: 354px"></nx-status-alert-details-parameters-group>`,
    props: {
      group: new Group('Status & Time', [
        new StringParameter('State', 'Active'),
        new StringParameter('Time Opened', '10 Sep 2019, 10:02AM'),
      ]),
    },
  };
};

export const Link = () => {
  return {
    template: `<nx-status-alert-details-parameters-group [group]="group" style="width: 354px"></nx-status-alert-details-parameters-group>`,
    props: {
      group: new Group('Source Info', [
        new LinkParameter('Site', { title: 'New York', link: 'New_York' }),
        new LinkParameter('Device', {
          title: 'RTR_Seattle',
          link: 'RTR_Seattle',
        }),
      ]),
    },
  };
};

export const Severity = () => {
  return {
    template: `<nx-status-alert-details-parameters-group [group]="group" style="width: 354px"></nx-status-alert-details-parameters-group>`,
    props: {
      group: new Group('Details', [
        new SeverityParameter('Status', SeverityTypes.WARNING),
      ]),
    },
  };
};

export const Description = () => {
  return {
    template: `<nx-status-alert-details-parameters-group [group]="group" style="width: 354px"></nx-status-alert-details-parameters-group>`,
    props: {
      group: new Group(
        'Description',
        void 0,
        'GigabitEthernet2 on RTR_Seattle was over utilized at 100.78% in the Outbound direction.',
        { link: 'some_link', params: undefined }
      ),
    },
  };
};
