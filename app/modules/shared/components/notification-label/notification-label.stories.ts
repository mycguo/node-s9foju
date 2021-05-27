import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata } from '@storybook/angular';

import { NotificationLabelStatus } from './enums/notification-label-status.enum';
import { NotificationLabelComponent } from './notification-label.component';

const defaultMarkdown = require('./notes/default.note.md');
const statusWarningMarkdown = require('./notes/warning.note.md');
const statusCriticalMarkdown = require('./notes/critical.note.md');
const statusGoodMarkdown = require('./notes/good.note.md');

export default {
  title: 'Shared/Notification Label',

  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
      declarations: [NotificationLabelComponent],
    }),
  ],
};

export const InfoBase = () => ({
  template: `<nx-notification-label>The application from another Group was selected.<br/>It will be reassigned.</nx-notification-label>`,
});

InfoBase.story = {
  name: 'Info (base)',
  parameters: { notes: { markdown: defaultMarkdown } },
};

export const Warning = () => ({
  template: `<nx-notification-label [status]="status">The application from another Group was selected.<br/>It will be reassigned.</nx-notification-label>`,
  props: { status: NotificationLabelStatus.WARNING },
});

Warning.story = {
  parameters: { notes: { markdown: statusWarningMarkdown } },
};

export const Critical = () => ({
  template: `<nx-notification-label [status]="status">The application from another Group was selected.<br/>It will be reassigned.</nx-notification-label>`,
  props: { status: NotificationLabelStatus.CRITICAL },
});

Critical.story = {
  parameters: { notes: { markdown: statusCriticalMarkdown } },
};

export const Good = () => ({
  template: `<nx-notification-label [status]="status">The application from another Group was selected.<br/>It will be reassigned.</nx-notification-label>`,
  props: { status: NotificationLabelStatus.GOOD },
});

Good.story = {
  parameters: { notes: { markdown: statusGoodMarkdown } },
};
