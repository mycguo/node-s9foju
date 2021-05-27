import { moduleMetadata } from '@storybook/angular';
import { EmailSharingComponent } from './email-sharing.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../shared/shared.module';
import { EmailCourier } from '../../../../services/couriers/models/email-courier';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Alerts/Sidebar/Sharing/EmailSharingComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [EmailSharingComponent],
    }),
  ],
};

export const Default = () => ({
  template: `
      <nx-email-sharing
        [isConfigured]="true"
        [(ngModel)]="ngModel"
        [ngModelOptions]="{ standalone: true }"
        (ngModelChange)="modelChanged($event)"
        ></nx-email-sharing>`,
  props: {
    ngModel: new EmailCourier(void 0),
    modelChanged: (model) => {
      action('model')(`changed to ${model}`);
    },
  },
});

Default.story = {
  name: 'default',
};

export const NotConfigured = () => ({
  template: `
      <nx-email-sharing
        [isConfigured]="false"
        [(ngModel)]="ngModel"
        [ngModelOptions]="{ standalone: true }"
        (ngModelChange)="modelChanged($event)"
        ></nx-email-sharing>`,
  props: {
    ngModel: new EmailCourier(void 0),
    modelChanged: (model) => {
      action('model')(`changed to ${model}`);
    },
  },
});

NotConfigured.story = {
  name: 'not configured',
};
