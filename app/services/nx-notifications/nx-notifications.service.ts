import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import NxNotification from './nx-notification.model';
import {SocketService} from '../socket/socket.service';
import {HttpClient} from '@angular/common/http';
import {NotificationsStore} from '../../store/notifications/notifications.store';
import { INotification } from '../../../../../server/services/notification/INotification';
import {bufferTime, catchError, filter, map, tap} from 'rxjs/operators';
import SocketMessage from '../socket/socket-message';
import {NotificationsQuery} from '../../store/notifications/notifications.query';
import * as _ from 'lodash';
import {Logger} from '../../modules/logger/logger';

@Injectable({
  providedIn: 'root'
})
export class NxNotificationsService implements OnDestroy {

  static readonly NOTIFICATION_BUFFER_TIME_MS = 2000;

  static readonly NOTIFIACTIONS_ROUTE = '/notifications';

  /** error keys */
  static readonly MARK_GROUP_NOTIFICATIONS_READ = 'MARK_GROUP_NOTIFICATIONS_READ';

  notificationSocketSubscription: Subscription;

  socketNotifcationCacheRecieved = false;

  constructor(
    private socketService: SocketService,
    private http: HttpClient,
    private notificationsStore: NotificationsStore,
    private notificationsQuery: NotificationsQuery,
    private logger: Logger
  ) {
    this.subscribeToSocketNotifications(socketService);
  }

  subscribeToSocketNotifications(socketService: SocketService) {
    socketService.generalNotificationsSubject$
      .pipe(
        bufferTime(NxNotificationsService.NOTIFICATION_BUFFER_TIME_MS),
        filter((buffered: Array<SocketMessage<Array<INotification>>>) => buffered.length > 0),
        map((buffered: Array<SocketMessage<Array<INotification>>>) => {
          const mergedData = [];
          for (const message of buffered) {
            if (message !== null) {
              if (message.eventType !== 'cacheReturned' || !this.socketNotifcationCacheRecieved) {
                mergedData.push(...message.data);
                this.socketNotifcationCacheRecieved = true;
              }
            }
          }
          return mergedData;
        }),
        map(this.mapServerNotifications),
        catchError((e) => {
          this.logger.error('Notification websocket subscription has error.');
          this.logger.error(e);
          throw e;
        })
      )
      .subscribe(
      (notifications: Array<NxNotification>) => {
        const fullNotificationState = Object.assign([], this.getNotificationsSnapshot());
        fullNotificationState.push(...notifications);
        this.notificationsStore.setNotificationsState(fullNotificationState);
      }
    );
  }

  getNotificationsSnapshot(): Array<NxNotification> {
    return this.notificationsQuery.getValue().notifications;
  }

  getNotifications(): Observable<Array<NxNotification>> {
    return this.notificationsQuery.select((notificationsState) => notificationsState.notifications);
  }


  markNotificationsAsRead(notifications: Array<NxNotification>) {
    const notificationIds = notifications.map((notification) => notification._id);
    return this.apiRequestToMarkNotificationsAsRead(notificationIds)
      .pipe(
        tap(() => {
          /// on successful response remove notifications from store
          const fullNotificationState = Object.assign([], this.getNotificationsSnapshot());
          const updatedNotificationList = this.removeNotificationsByIds(fullNotificationState, notificationIds);
          this.notificationsStore.setNotificationsState(updatedNotificationList);
        }),
        // catchError((err) => {
        //
        // })
      ).subscribe();
  }

  apiRequestToMarkNotificationsAsRead(notificationIds: Array<string>): Observable<any> {
    return this.http.post(`${NxNotificationsService.NOTIFIACTIONS_ROUTE}/read-notifications`, notificationIds);
  }

  // markSingleAsRead(noti)

  removeNotificationsByIds(notifications: Array<NxNotification>, notificationIdsToRemove: Array<string>): Array<NxNotification> {
    const mapOfIds = _.mapKeys(notificationIdsToRemove);
    const filteredNotifications = [...notifications];
    _.remove(filteredNotifications, (notification) => mapOfIds[notification._id] !== void 0);
    return filteredNotifications;
  }

  ngOnDestroy(): void {
    this.notificationSocketSubscription.unsubscribe();
  }

  private mapServerNotifications(serverNotifications: Array<INotification>): Array<NxNotification> {
    const nxNotifications: Array<NxNotification> = [];
    if (serverNotifications === null) {
      return nxNotifications;
    }
    const notifications = serverNotifications;
    for (const notification of notifications) {
      const newNxNotification = Object.assign(new NxNotification(), {
        _id: notification._id,
        externalId: notification.externalId,
        created: new Date(notification.createdAt),
        type: notification.type,
        body: notification.data.message ? notification.data.message : 'Error reading notification body',
        dataRaw: notification,
        title: notification.data.title ? notification.data.title : 'Error reading notification title',
      });
      nxNotifications.push(newNxNotification);
    }
    return nxNotifications;
  }

  // hideNotification(notification: Notification) {
  //
  // }
  //
  // hideAllNotifications() {
  //
  // }

}
