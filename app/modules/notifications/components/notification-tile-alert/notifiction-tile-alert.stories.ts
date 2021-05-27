import NxNotification from '../../../../services/nx-notifications/nx-notification.model';
import { RouterModule } from '@angular/router';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago/time-ago.pipe';
import { NotificationTileGeneralComponent } from '../notification-tile-general/notification-tile-general.component';
import { NotificationTileWrapperComponent } from '../notification-tile-wrapper/notification-tile-wrapper.component';
import { NotificationTileAlertComponent } from './notification-tile-alert.component';

export default {
  title: 'Notifications/NotificationTileAlertComponent',
};

export const Default = () => {
  const notification: NxNotification = {
    _id: '1',
    externalId: '1',
    created: new Date(),
    type: 'general',
    body: 'Notification body text',
    title: 'Notification Title',
    wasDisplayed: false,
    dataRaw: null,
  };
  return {
    moduleMetadata: {
      imports: [RouterModule],
      declarations: [
        NotificationTileAlertComponent,
        NotificationTileWrapperComponent,
        TimeAgoPipe,
      ],
    },
    props: {
      notification,
    },
    template: `
        <nx-notification-tile-alert
          [notification]="notification"
        ></nx-notification-tile-alert>
      `,
  };
};
