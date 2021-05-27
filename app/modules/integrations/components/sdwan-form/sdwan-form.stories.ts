import { moduleMetadata } from '@storybook/angular';
import IValidateIntegrations from '../../../../../../../project_typings/api/integrations/IIntegrationsValidate';
import ConfigurationEnum from '../../../../../../../project_typings/enums/configuration.enum';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { BasicIntegrationFormComponent } from '../basic-integration-form/basic-integration-form.component';
import { SdwanFormComponent } from './sdwan-form.component';

export default {
  title: 'Integrations/SD-WAN Form',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [SdwanFormComponent, BasicIntegrationFormComponent],
    }),
  ],
};

export const Default = () => {
  return {
    template: `<nx-sdwan-form [sdwan]="sdwan"></nx-sdwan-form>`,
    props: {
      sdwan: {
        config: { hostname: '', username: '' },
        status: ConfigurationEnum.UNCONFIGURED,
      } as IValidateIntegrations,
    },
  };
};
