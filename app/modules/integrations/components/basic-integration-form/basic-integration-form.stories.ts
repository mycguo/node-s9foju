import { moduleMetadata } from '@storybook/angular';
import { BasicIntegrationFormComponent } from './basic-integration-form.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

export default {
  title: 'Integrations/BasicIntegrationFormComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [BasicIntegrationFormComponent],
    }),
  ],
};

export const Default = () => {
  return {
    template: `
          <nx-basic-integration-form [formControl]="formControl"></nx-basic-integration-form>
        `,
    props: {
      formControl: new FormControl(),
    },
  };
};

export const WithValues = () => {
  return {
    template: `
          <nx-basic-integration-form [formControl]="formControl"></nx-basic-integration-form>
        `,
    props: {
      formControl: new FormGroup({
        [BasicIntegrationFormComponent.USERNAME_KEY]: new FormControl(
          '192.168.1.1'
        ),
        [BasicIntegrationFormComponent.HOSTNAME_KEY]: new FormControl(
          'Hostname'
        ),
      }),
    },
  };
};
