import {Injectable, Optional} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {applyTransaction, EntityStore, QueryEntity} from '@datorama/akita';
import {TimeRangeRestrictionState} from './models/time-range-restriction-state';
import {TimeRangeRestrictionOption} from '../../components/time-range-restriction-setting/models/time-range-restriction-option';
import {CommonService} from '../../../../utils/common/common.service';
import {TimeRangeRestrictionApiResponse} from './models/time-range-restriction-api-response';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class TimeRangeRestrictionService {
  public static readonly TIME_RANGE_RESTRICTION_URL = '/api/nx/timeRangeRestriction/analysisReports';

  constructor(private http: HttpClient,
              private commonService: CommonService,
              private logger: Logger,
              @Optional() private readonly store: EntityStore<TimeRangeRestrictionState>,
              @Optional() private readonly query: QueryEntity<TimeRangeRestrictionState>) {
    if (this.commonService.isNil(store)) {
      this.store = new EntityStore<TimeRangeRestrictionState>({},
        {name: 'TimeRangeRestrictionStore', idKey: 'id', resettable: true});
    }
    if (this.commonService.isNil(query)) {
      this.query =
        new QueryEntity<TimeRangeRestrictionState>(this.store);
    }
  }

  /**
   * observable error handler
   * @param err Http Error
   */
  private errorHandler$(err: HttpErrorResponse): Observable<never> {
    applyTransaction(() => {
      this.store.setError<DetailedError>(Object.assign({title: void 0}, err));
      this.store.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(err);
  }


  /**
   * Get selected time range
   */
  public selectSelectedTimeRange(): Observable<TimeRangeRestrictionOption> {
    return this.query.selectActive();
  }

  /**
   * Listen for all time range options
   */
  public selectTimeRangeOptions(): Observable<Array<TimeRangeRestrictionOption>> {
    return this.query.selectAll();
  }

  /**
   * Subscribe to errors on store
   */
  public selectError(): Observable<DetailedError> {
    return this.query.selectError();
  }

  /**
   * Subscribe to loading state
   */
  public selectLoading() {
    return this.query.selectLoading();
  }

  /**
   * Get possible time ranges
   */
  public getTimeRangeOptions(): Observable<Array<TimeRangeRestrictionOption>> {
    this.store.setLoading(true);
    return this.http.get<TimeRangeRestrictionApiResponse>(TimeRangeRestrictionService.TIME_RANGE_RESTRICTION_URL).pipe(
      tap((data: TimeRangeRestrictionApiResponse) => {
        applyTransaction(() => {
          this.store.setError(void 0);
          this.store.set(data.timeRanges);
          this.store.setActive(data.selectedTimeRangeId);
          this.store.setLoading(false);
        });
      }),
      map((data: TimeRangeRestrictionApiResponse) => data.timeRanges),
      catchError(this.errorHandler$.bind(this))
    );
  }

  /**
   * Get possible time ranges
   */
  public setSelectedTimeRangeRestriction(updatedTimeRangeOption: TimeRangeRestrictionOption):
    Observable<string> {
    this.store.setLoading(true);
    return this.http.put<TimeRangeRestrictionApiResponse>(TimeRangeRestrictionService.TIME_RANGE_RESTRICTION_URL,
      {timeRangeId: updatedTimeRangeOption.id}).pipe(
      tap((data: TimeRangeRestrictionApiResponse) => {
        applyTransaction(() => {
          this.store.setError(void 0);
          this.store.setActive(data.selectedTimeRangeId);
          this.store.setLoading(false);
        });
      }),
      map((data: TimeRangeRestrictionApiResponse) => data.selectedTimeRangeId),
      catchError(this.errorHandler$.bind(this))
    );
  }

}
