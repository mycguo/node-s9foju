import NxNotificationBody from './nx-notification-body.model';
import { INotification } from '../../../../../server/services/notification/INotification';

export default class NxNotification {
  // body: string;
  // type: string;
  // linkText: string;
  // onLinkClickFunction?: () => {};
  // show = true;
  _id: string;
  externalId: string;
  url?: string;
  created: Date;
  type: string;
  body: string;
  dataRaw: INotification;
  title: string;
  drilldownUrl?: string;
  wasDisplayed = false;
}
