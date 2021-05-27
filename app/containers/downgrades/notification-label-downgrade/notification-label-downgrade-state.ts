import {NotificationLabelStatus} from '../../../modules/shared/components/notification-label/enums/notification-label-status.enum';

export interface NotificationLabelDowngradeState {
  status: NotificationLabelStatus;
  message: string;
  messageList?: Array<string>; // Bullet item list that will be displayed below "message"
}
