import { Injectable } from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {TokenManagerService} from '../token-manager/token-manager.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserService} from '../user/user.service';
import {filter, take} from 'rxjs/operators';
import SocketMessage from './socket-message';
import { IAlertNotification } from '../../../../../server/services/notification/IAlertNotification';
import { INotification } from '../../../../../server/services/notification/INotification';
import ReportSocketEvents from './report-socket-events.enum';
import AlertNotificationSocketEvents from './alert-notification-socket-events.enum';
import GeneralNotificationSocketEvents from './general-notification-socket-events.enum';
import {ReportQueueResponse} from '../../modules/reporting/models/api/queue/report-queue-response';
import {Logger} from '../../modules/logger/logger';

const REPORTS_NAMESPACE = '/la-reports';
const ALERT_NOTIFICATIONS_NAMESPACE = '/la-alert-notifications';
const GENERAL_NOTIFICATIONS_NAMESPACE = '/la-notifications';

const REPORT_EVENTS = [
  ReportSocketEvents.CANCELLED,
  ReportSocketEvents.FAILED,
  ReportSocketEvents.QUEUED,
  ReportSocketEvents.READY,
  ReportSocketEvents.RUNNING,
  ReportSocketEvents.TIMEOUT,
];

const ALERT_NOTIFICATIONS_EVENTS = [
  AlertNotificationSocketEvents.CREATED,
];

const GENERAL_NOTIFICATION_EVENTS = [
  GeneralNotificationSocketEvents.CACHE_RETURNED,
  GeneralNotificationSocketEvents.CREATED,
  GeneralNotificationSocketEvents.CREATED_BATCH,
];

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public readonly reportSubject$: Observable<SocketMessage<ReportQueueResponse>>;
  public readonly alertNotificationsSubject$: Observable<SocketMessage<IAlertNotification>>;
  public readonly generalNotificationsSubject$: Observable<SocketMessage<Array<INotification>>>;

  constructor(
    private tokenManagerService: TokenManagerService,
    private userService: UserService,
    private logger: Logger
  ) {
    const authToken = tokenManagerService.getAuthToken();
    if (authToken !== void 0) {
      this.reportSubject$ = this.generateSocketSubject<ReportQueueResponse>(REPORTS_NAMESPACE, authToken, REPORT_EVENTS);
      this.alertNotificationsSubject$ = this.generateSocketSubject(ALERT_NOTIFICATIONS_NAMESPACE, authToken, ALERT_NOTIFICATIONS_EVENTS);
      this.generalNotificationsSubject$ = this.generateSocketSubject(GENERAL_NOTIFICATIONS_NAMESPACE, authToken,
          GENERAL_NOTIFICATION_EVENTS);
    }
  }

  private generateSocketSubject<T>(namespace: string, authToken: string, socketEvents: Array<string>): Observable<SocketMessage<T>> {
    const socket = this.buildAuthenticatedSocket(namespace, authToken);
    return this.generateNamespaceObservable<T>(socket, socketEvents);
  }

  private buildAuthenticatedSocket(namespace: string, authToken: string): Socket {
    const authQuery = {
      extraHeaders: {Authorization: `Bearer ${authToken}`}
    };
    const socket = io(namespace, authQuery);
    socket.on('connect', () => {
      this.logger.info('connected ' + namespace);
      this.userService.getLoggedInUser()
          .pipe(
            filter( user => user !== null),
            take(1),
          )
          .subscribe((user) => {
            if (!!user) {
              socket.emit('connect user', { id: user._id, token: authToken });
            }
          });
      })
      .on('connect_error', (error) => {
        this.logger.error(error);
      })
      .on('disconnected', () => {
        this.logger.warn('Disconnected socket');
      });
    return socket;
  }

  private generateNamespaceObservable<T>(socket: Socket, events: Array<string>): Observable<SocketMessage<T>> {
    const subject = new BehaviorSubject<SocketMessage<T>>(null);
    return this.registerEventsForObservable<T>(events, socket, subject);
  }

  private registerEventsForObservable<T>(events: Array<string>, socket: Socket, subject: BehaviorSubject<SocketMessage<T>>) {
    events.map((event) => {
      socket.on(event, (resp) => {
        subject.next(new SocketMessage<T>(event, resp));
      });
    });
    return subject;
  }

}
