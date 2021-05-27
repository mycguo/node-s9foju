import NxNotificationDateGroup from '../../../../services/nx-notifications/nx-notification-date-group.model';
import { NotificationTilesDateGroupComponent } from './notification-tiles-date-group.component';
import { NotificationTileAlertComponent } from '../notification-tile-alert/notification-tile-alert.component';
import { NotificationTileGeneralComponent } from '../notification-tile-general/notification-tile-general.component';
import { SharedModule } from '../../../shared/shared.module';
import { NotificationTileWrapperComponent } from '../notification-tile-wrapper/notification-tile-wrapper.component';
import { RouterModule } from '@angular/router';
import { NotificationsListDirective } from '../../directives/notifications-list/notifications-list.directive';

export default {
  title: 'Notifications/NotificationTilesDateGroupComponent',
};

export const Default = () => {
  const currentDate = new Date();
  const dateGroup: NxNotificationDateGroup = {
    date: currentDate,
    id: currentDate.toDateString(),
    notifications: [
      {
        _id: '1',
        externalId: '1',
        created: currentDate,
        type: 'info',
        body: 'Notification body',
        dataRaw: null,
        title: 'Notification Title',
        wasDisplayed: false,
      },
    ],
  };
  return {
    props: {
      dateGroup,
    },
    template: `
        <nx-notification-tiles-date-group
          [notificationGroup]="dateGroup"
        >
        </nx-notification-tiles-date-group>
      `,
    moduleMetadata: {
      imports: [SharedModule, RouterModule],
      declarations: [
        NotificationTilesDateGroupComponent,
        NotificationTileGeneralComponent,
        NotificationTileAlertComponent,
        NotificationTileWrapperComponent,
        NotificationsListDirective,
      ],
    },
  };
};
