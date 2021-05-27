import { moduleMetadata } from '@storybook/angular';
import { ApicemFormComponent } from './apicem-form.component';
import IValidateIntegrations from '../../../../../../../project_typings/api/integrations/IIntegrationsValidate';
import ConfigurationEnum from '../../../../../../../project_typings/enums/configuration.enum';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { BasicIntegrationFormComponent } from '../basic-integration-form/basic-integration-form.component';

export default {
  title: 'Integrations/ApicemFormComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [ApicemFormComponent, BasicIntegrationFormComponent],
    }),
  ],
};

export const Default = () => {
  return {
    template: `<nx-apicem-form [apicem]="apicem"></nx-apicem-form>`,
    props: {
      apicem: {
        config: { hostname: '', username: '' },
        status: ConfigurationEnum.UNCONFIGURED,
      } as IValidateIntegrations,
    },
  };
};
