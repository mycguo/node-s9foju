import {BehaviorSubject, Observable, of} from 'rxjs';
import {TimeRangeRestrictionOption} from '../../components/time-range-restriction-setting/models/time-range-restriction-option';
import {TimeRangeRestrictionApiResponse} from './models/time-range-restriction-api-response';
import {Injectable} from '@angular/core';
import {delay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
/**
 * A mock service that is only meant to be used for testing
 */
export class MockTimeRangeRestrictionService {
  mockResponse: TimeRangeRestrictionApiResponse;

  selectedOptionSubject: BehaviorSubject<TimeRangeRestrictionOption>;
  optionsSubject: BehaviorSubject<Array<TimeRangeRestrictionOption>>;

  selectedOption$: Observable<TimeRangeRestrictionOption>;
  options$: Observable<Array<TimeRangeRestrictionOption>>;

  constructor() {
    this.selectedOptionSubject = new BehaviorSubject<TimeRangeRestrictionOption>(void 0);
    this.optionsSubject = new BehaviorSubject<Array<TimeRangeRestrictionOption>>([]);

    this.selectedOption$ = this.selectedOptionSubject.asObservable();
    this.options$ = this.optionsSubject.asObservable();
  }

  private createMockResponse(): TimeRangeRestrictionApiResponse {
    return {
      selectedTimeRangeId: 'ONE_DAY',
      timeRanges: [
        {
          id: 'ONE_HOUR',
          label: '1 Hour',
          milliseconds: 1
        },
        {
          id: 'ONE_DAY',
          label: '1 Day',
          milliseconds: 100
        }, {
          id: 'NO_LIMIT',
          label: 'No Limit',
          milliseconds: 0
        }
      ]
    };
  }

  /**
   * Get selected time range
   */
  public selectSelectedTimeRange(): Observable<TimeRangeRestrictionOption> {
    return this.selectedOption$;
  }

  /**
   * Listen for all time range options
   */
  public selectTimeRangeOptions(): Observable<Array<TimeRangeRestrictionOption>> {
    return this.options$;
  }

  /**
   * Subscribe to errors on store
   */
  public selectError(): Observable<Error> {
    return of(null);
  }

  /**
   * Subscribe to loading state
   */
  public selectLoading() {
    return of(false);
  }

  /**
   * Get possible time ranges
   */
  public getTimeRangeOptions(): Observable<TimeRangeRestrictionApiResponse> {
    this.mockResponse = this.createMockResponse();
    const selectedOption = this.mockResponse.timeRanges.find((timeRange) => timeRange.id === this.mockResponse.selectedTimeRangeId);
    this.selectedOptionSubject.next(selectedOption);
    this.optionsSubject.next(this.mockResponse.timeRanges);
    return of(this.mockResponse);
  }

  /**
   * Get possible time ranges
   */
  public setSelectedTimeRangeRestriction(updatedTimeRangeOption: TimeRangeRestrictionOption): Observable<void> {
    const selectedOption = this.mockResponse.timeRanges.find((timeRange) => timeRange.id === updatedTimeRangeOption.id);
    this.selectedOptionSubject.next(selectedOption);
    return;
  }

}
