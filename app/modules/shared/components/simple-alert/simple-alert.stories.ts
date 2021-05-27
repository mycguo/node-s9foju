import { moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import SimpleAlert from './model/simple-alert';
import { SimpleAlertComponent } from './simple-alert.component';
import { SIMPLE_ALERT_TYPE_ENUM } from './model/simple-alert-type.enum';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, Input } from '@angular/core';
import { CommonService } from '../../../../utils/common/common.service';

@Component({
  selector: 'nx-simple-alert-story',
  template: `
    <nx-simple-alert
      [style.width]="width"
      style="margin: 0 auto"
      [alert]="alert"
      (closed)="closeCallbackFn()"
    ></nx-simple-alert>
  `,
})
// @ts-ignore
export class SimpleAlertStoryComponent {
  // @ts-ignore
  @Input() alert: SimpleAlert;
  // @ts-ignore
  @Input() width = 'auto';

  closeCallbackFn(): void {
    action('Changes')('closed');
  }
}

export default {
  title: 'Shared/Simple Alert',

  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
      declarations: [SimpleAlertStoryComponent, SimpleAlertComponent],
      providers: [CommonService],
    }),
  ],

  excludeStories: ['SimpleAlertStoryComponent'],
};

export const Success = () => ({
  component: SimpleAlertStoryComponent,
  props: {
    alert: new SimpleAlert(
      'Success: ',
      `Success Alert Text`,
      SIMPLE_ALERT_TYPE_ENUM.SUCCESS,
      999999
    ),
  },
});

export const Error = () => ({
  component: SimpleAlertStoryComponent,
  props: {
    alert: new SimpleAlert(
      'Error: ',
      `Error Alert Text`,
      SIMPLE_ALERT_TYPE_ENUM.ERROR,
      999999
    ),
  },
});

export const ShowMore = () => ({
  component: SimpleAlertStoryComponent,
  props: {
    alert: new SimpleAlert(
      'Error: ',
      `Show more button will be displayed if the message is larger than the defined bounds of the host element`,
      SIMPLE_ALERT_TYPE_ENUM.ERROR,
      999999
    ),
    width: '400px',
  },
});
