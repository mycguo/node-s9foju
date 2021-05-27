import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {merge, Observable, throwError, timer} from 'rxjs';
import {catchError, filter, finalize, flatMap, switchMap, take, tap} from 'rxjs/operators';
import {QueueReportGroupRequest} from '../../models/api/request/queue-report-group-request';
import QueueReportGroupResponse from '../../models/api/request/queue-report-group-response';
import ReportResponse from '../../models/api/response/report-response';
import {SocketService} from '../../../../services/socket/socket.service';
import ReportSocketEvents from '../../../../services/socket/report-socket-events.enum';
import SocketMessage from '../../../../services/socket/socket-message';
import {ReportQueueState} from '../../models/enums/report-queue-state';
import {ReportQueueResponse} from '../../models/api/queue/report-queue-response';
import {ReportQueueItem} from '../../models/api/queue/report-queue-item';
import {CommonService} from '../../../../utils/common/common.service';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})

/**
 * This service is meant to have all report functionality that involves API calls.
 * Formatting of results should be done in ReportResultFormatter.service
 */
export class ReportService {
  static readonly REPORT_QUEUE_ENDPOINT = '/api/la-reports/queue';
  static readonly REPORT_RESULT_BY_ID_ENDPOINT = '/api/nx/reports/results';
  static readonly REPORT_CANCEL_BY_ID_ENDPOINT = '/api/la-reports/cancel';

  readonly REPORT_POLL_INTERVAL_MILLIS = 30000; // 30 seconds

  constructor(private http: HttpClient,
              private socketService: SocketService,
              private commonService: CommonService,
              private logger: Logger) {
  }

  /**
   * Given a report request, queues the report and asynchronously waits for the results via long polling and sockets.
   * This should be the standard way to execute reports.
   * If the observable is terminated before the report finishes running (through unsubscribe or other means) the report
   * will be cancelled to preserve server report processing resources.
   * @param queueRequest - The report request to be made.
   */
  public executeReport(queueRequest: QueueReportGroupRequest): Observable<ReportResponse> {
    let reportCancellationId;
    return this.queueReport(queueRequest)
      .pipe(
        tap((requestResponse: QueueReportGroupResponse) => {
          // Save the job id so we can cancel it upon early observable termination
          reportCancellationId = requestResponse.jobId;
        }),
        flatMap(requestResponse => this.getReportResult(requestResponse.jobId)),
        tap((requestResponse) => {
          // Report has successfully completed, we no longer need to cancel
          reportCancellationId = void 0;
        }),
        finalize(() => {
          // Cancel reports that have no completed when this observable is completed/errors
          if (reportCancellationId !== void 0) {
            this.cancelReport(reportCancellationId, queueRequest)
              .pipe(take(1))
              .subscribe();
          }
        }),
        catchError(this.errorHandler.bind(this))
      );
  }

  /**
   * Queues a report.  In most cases, executeReport should be used rather than this method.  ExecuteReport will queue
   * a report and wait for the result asynchronously in a single method call.
   */
  public queueReport(queueRequest: QueueReportGroupRequest): Observable<QueueReportGroupResponse> {
    return this.http.post<QueueReportGroupResponse>(ReportService.REPORT_QUEUE_ENDPOINT, queueRequest)
      .pipe(
        catchError(this.errorHandler.bind(this))
      );
  }

  /**
   * Get a report result as soon as the report is completed.  We should know when a result is completed by either receiving
   * a notification via webhook/socket or long polling and checking the actively running report queue.
   * @param resultId - the result id of the report we are looking for.  This is returned from API after queueing a report.
   */
  public getReportResult(resultId: string): Observable<ReportResponse> {
    return merge(
      // First observable will poll to check the queue to see if the report is done.  If it is, make result request
      timer(0, this.REPORT_POLL_INTERVAL_MILLIS)
        .pipe(
          switchMap(_ => this.checkIfReportComplete(resultId)),
          flatMap(_ => this.requestResult(resultId)),
          catchError(this.errorHandler.bind(this))
        ),
      // Second observable listens for any socket events.  If a valid socket event comes through, make result request
      this.socketService.reportSubject$
        .pipe(
          filter(reportSocketMessage => this.checkIfValidSocketMessage(reportSocketMessage, resultId)),
          flatMap(reportSocketMessage => this.requestResult(reportSocketMessage.data.id)),
          catchError(this.errorHandler.bind(this))
        )
    ).pipe(
      take(1)
    );
  }

  public cancelReport(resultId: string, originalRequest: QueueReportGroupRequest): Observable<void> {
    return this.http.post(`${ReportService.REPORT_CANCEL_BY_ID_ENDPOINT}/${resultId}`, originalRequest)
      .pipe(
        catchError(this.errorHandler.bind(this))
      );
  }

  /**
   * Make an HTTP call to retrieve results
   */
  private requestResult(resultId: string): Observable<ReportResponse> {
    return this.http.get<ReportResponse>(`${ReportService.REPORT_RESULT_BY_ID_ENDPOINT}/${resultId}`)
      .pipe(
        catchError(this.errorHandler.bind(this))
      );
  }


  /**
   * Check socket message to see if it's valid.
   * A valid socket message has an id matching the param resultId and an eventType of READY
   * @param reportSocketMessage - The socket message to be determined valid/invalid
   * @param resultId - the id that the socket message must match to be valid
   */
  private checkIfValidSocketMessage(reportSocketMessage: SocketMessage<ReportQueueResponse>, resultId: string): boolean {
    if (this.commonService.isNil(reportSocketMessage)) {
      return false;
    } else {
      // If the ID matches and the report is read, this is a valid message
      return reportSocketMessage.data.id === resultId && reportSocketMessage.eventType === ReportSocketEvents.READY.toString();
    }
  }

  /**
   * Check an array of queue items to see if any item is valid.
   * A valid queue item will have a matching id and be in the READY state OR the report does not exist in queue
   * (completed items are removed from queue)
   * @param queuedItems -List of queue items
   * @param resultId - The result id required for a valid queue item
   */
  private checkQueueForReadyReport(queuedItems: Array<ReportQueueItem>, resultId: string): boolean {
    const matchingQueueItem = queuedItems.find(item => item.id === resultId);
    if (this.commonService.isNil(matchingQueueItem)) {
      return true;
    } else {
      return matchingQueueItem.status === ReportQueueState.READY;
    }
  }

  /**
   * We check if a report is completed by verifying that it's result id is not in the report queue (completed reports
   * are removed from queue).  If it is in the queue, it must be in the READY state (it could be pending removal)
   * @param resultId - The result id of the report we want to check if it is compelted
   */
  private checkIfReportComplete(resultId: string) {
    return this.http.get<{ queue: Array<ReportQueueItem> }>(ReportService.REPORT_QUEUE_ENDPOINT)
      .pipe(
        filter(response => this.checkQueueForReadyReport(response.queue, resultId))
      );
  }

  /**
   * error handler
   * @param err Http Error
   */
  private errorHandler(err: HttpErrorResponse): Observable<never> {
    this.logger.error(err.message);
    return throwError(err);
  }
}
