import { moduleMetadata } from '@storybook/angular';
import { AnalyticsPlatformComponent } from './analytics-platform.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CommonIntegrationsPanelComponent } from '../common-integrations/common-integrations-panel/common-integrations-panel.component';
import { CommonIntegrationsDisplayComponent } from '../common-integrations/common-integrations-display/common-integrations-display.component';
import { CommonIntegrationsFormComponent } from '../common-integrations/common-integrations-form/common-integrations-form.component';
import { ByteFormattingPipe } from '../../../shared/pipes/byte-formatting/byte-formatting.pipe';
import IIntegrationForm from '../../services/integrations-form/IIntegrationForm';
import AnalyticsPlatformModel from './analytics-platform.model';
import IntegrationDisplayStateEnum from '../../enums/integration-display-state.enum';

export default {
  title: 'Integrations/AnalyticsPlatformComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, FormsModule, SharedModule],
      declarations: [
        CommonIntegrationsPanelComponent,
        CommonIntegrationsDisplayComponent,
        CommonIntegrationsFormComponent,
        AnalyticsPlatformComponent,
      ],
      providers: [ByteFormattingPipe],
    }),
  ],
};

export const View = () => {
  return {
    props: {
      state: IntegrationDisplayStateEnum.VIEW,
      data: new AnalyticsPlatformModel(),
    },
    template: `
        <nx-analytics-platform
            [state]="state"
            [data]="data"
            [isLoading]="false"
        >
        </nx-analytics-platform>
      `,
  };
};

export const Edit = () => {
  return {
    props: {
      state: IntegrationDisplayStateEnum.EDIT,
      formSubmit: (formValues: IIntegrationForm) => {
        console.log(formValues);
      },
    },
    template: `
        <nx-analytics-platform
            [state]="state"
            [isLoading]="false"
            (submitForm)="formSubmit($event)"
        >
        </nx-analytics-platform>
      `,
  };
};
