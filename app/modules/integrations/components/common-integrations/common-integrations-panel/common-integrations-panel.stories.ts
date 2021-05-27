import { moduleMetadata } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { CommonIntegrationsDisplayComponent } from '../common-integrations-display/common-integrations-display.component';
import { CommonIntegrationsPanelComponent } from './common-integrations-panel.component';
import { CommonIntegrationsFormComponent } from '../common-integrations-form/common-integrations-form.component';
import { ButtonModel } from '../../../../shared/components/button/button.model';
import { ByteFormattingPipe } from '../../../../shared/pipes/byte-formatting/byte-formatting.pipe';
import { Component, Input } from '@angular/core';
import ConfigurationEnum from '../../../../../../../../project_typings/enums/configuration.enum';
import IntegrationDisplayStateEnum from '../../../enums/integration-display-state.enum';
import { LoadingState } from '../../../../shared/components/loading/enums/loading-state.enum';

@Component({
  selector: 'nx-mock-integrations-container',
  template: `
    <nx-common-integrations-panel
      [displayState]="displayState"
      [integrationData]="integrationData"
      [status]="status"
      [baseTitle]="'Base Title'"
      [actionButtonModels]="actionButtons"
      [formTemplate]="formTemplate"
      (edit)="editHandler()"
      (delete)="deleteHandler()"
    >
      <ng-template #formTemplate>
        <p>add form component here</p>
      </ng-template>
    </nx-common-integrations-panel>
  `,
})
class MockIntegrationsContainer {
  @Input() displayState = IntegrationDisplayStateEnum.VIEW;
  state = IntegrationDisplayStateEnum.VIEW;
  status = ConfigurationEnum.VALID;
  integrationData = [
    { name: 'Test label', value: 'Test label' },
    { name: 'Test label 2', value: 'Test label 2' },
  ];
  actionButtons = [
    <ButtonModel>{
      label: 'Check Connection',
      onClick: () => {},
      isPrimary: false,
    },
    <ButtonModel>{
      label: 'Primary',
      onClick: () => {},
      isPrimary: true,
    },
  ];

  editHandler = () => {
    console.log('Edit has been pressed');
  };

  deleteHandler = () => {
    console.log('Delete has been pressed');
  };
}

export default {
  title: 'Integrations/CommonIntegrationsPanelComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, FormsModule, SharedModule],
      declarations: [
        CommonIntegrationsPanelComponent,
        CommonIntegrationsDisplayComponent,
        CommonIntegrationsFormComponent,
        MockIntegrationsContainer,
      ],
      providers: [ByteFormattingPipe],
    }),
  ],
};

export const View = () => {
  return {
    props: {},
    template: `
        <nx-mock-integrations-container>
        </nx-mock-integrations-container>
      `,
  };
};

export const Edit = () => {
  return {
    props: {
      state: IntegrationDisplayStateEnum.EDIT,
    },
    template: `
      <nx-mock-integrations-container [displayState]="state">
        </nx-mock-integrations-container>
      `,
  };
};
