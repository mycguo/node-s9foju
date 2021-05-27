import NotificationTileTypes from './notification-tile-types.enum';
import NxNotification from '../nx-notifications/nx-notification.model';

interface NotificationTileComponent {
  componentType: NotificationTileTypes;
  notification: NxNotification;
}

export default NotificationTileComponent;
