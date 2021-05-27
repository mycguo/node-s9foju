import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ServerTimeResponse} from './server-time-response';
import {Logger} from '../../modules/logger/logger';

@Injectable({
  providedIn: 'root'
})
export class ServerTimeService {
  static readonly SERVER_TIME_URL = 'api/poll/currentTime';

  constructor(private http: HttpClient,
              private logger: Logger) {
  }

  /**
   * gets server time to nearest 5min unless specified by truncatedPeriod
   * ie 1589916105270 (5/19/2020 9:21:45) will be 1589916000000 (5/19/2020 9:20:00)
   * @param truncatedPeriod time in milliseconds that should be rounded to
   */
  getServerTime(truncatedPeriod?: number): Observable<number> {
    let params = new HttpParams();
    if (truncatedPeriod != null) {
      params = params.set('truncatedPeriod', truncatedPeriod.toString());
    }
    return this.http.get<ServerTimeResponse>(ServerTimeService.SERVER_TIME_URL, {params})
      .pipe(
        map((resp: ServerTimeResponse) => resp.time),
        catchError((err) => {
          this.logger.error(err.message);
          return throwError(err);
        })
      );
  }
}
