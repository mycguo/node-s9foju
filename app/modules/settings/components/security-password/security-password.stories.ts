import { moduleMetadata } from '@storybook/angular';
import { SecurityPasswordComponent } from './security-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { action } from '@storybook/addon-actions';
import { PasswordOptions } from './interfaces/password-options';

export default {
  title: 'Settings/SecurityPasswordComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [SecurityPasswordComponent],
    }),
  ],
};

export const Default = () => ({
  props: {
    passwordOptions: <PasswordOptions>{
      minimumRequiredLength: 5,
      requiredUpperCase: 0,
      requiredLowerCase: 0,
      requiredNumeric: 0,
      requiredNonAlphaNumeric: 0,
      passwordLifetime: 60,
      passwordChangeRestrictionPeriod: 0,
      maxStoredPreviousPasswords: 0,
    },
    submit: (submitValue) => {
      action('submitting')(JSON.stringify(submitValue));
    },
  },
  component: SecurityPasswordComponent,
});

Default.story = {
  name: 'default',
};
