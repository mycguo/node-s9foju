import { moduleMetadata } from '@storybook/angular';
import { WebUiSharingComponent } from './web-ui-sharing.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../shared/shared.module';
import { WebUiCourier } from '../../../../services/couriers/models/web-ui-courier';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Alerts/Sidebar/Sharing/WebUiSharingComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [WebUiSharingComponent],
    }),
  ],
};

export const Default = () => ({
  template: `
      <nx-web-ui-sharing
        [(ngModel)]="ngModel"
        [ngModelOptions]="{ standalone: true }"
        (ngModelChange)="modelChanged($event)"
        ></nx-web-ui-sharing>`,
  props: {
    ngModel: new WebUiCourier(void 0),
    modelChanged: (model) => {
      action('model')(`changed to ${model}`);
    },
  },
});

Default.story = {
  name: 'default',
};
