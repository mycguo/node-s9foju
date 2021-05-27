import {Injectable, Optional} from '@angular/core';
import ApplicationGroup from '../../models/application-group';
import {Observable, throwError} from 'rxjs';
import {QueryEntity, EntityStore, applyTransaction} from '@datorama/akita';
import {ApplicationSuggestionsState} from './application-suggestions-state.interface';
import {CommonService} from 'src/app/utils/common/common.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ApplicationSuggestion} from '../../models/application-suggestion';
import {ApplicationGroupsService} from '../application-groups/application-groups.service';
import {map, catchError, tap} from 'rxjs/operators';
import LaErrorResponse from 'src/app/modules/live-insight-edge/services/live-insight-edge-report-page/reports-services/la-error-response';
import {ApplicationGroupRequest} from '../../models/application-group-request';
import {ApplicationGroupResponse} from '../../models/application-group-response';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class ApplicationGroupsModalService {
  static readonly APPLICATION_SUGGESTIONS = ApplicationGroupsService.APPLICATION_GROUPS_ENDPOINT + '/suggestions';
  static readonly INITIAL_SUGGEST_STORE_STATE = [];
  static readonly SUGGEST_STORE_NAME = 'application-suggestions';

  constructor(
    private http: HttpClient,
    private logger: Logger,
    private commonService: CommonService,
    @Optional() private readonly store: EntityStore<ApplicationSuggestionsState, ApplicationSuggestion>,
    @Optional() private readonly query: QueryEntity<ApplicationSuggestionsState>
  ) {
    if (this.commonService.isNil(store)) {
      this.store = new EntityStore<ApplicationSuggestionsState>(ApplicationGroupsModalService.INITIAL_SUGGEST_STORE_STATE, {
        name: ApplicationGroupsModalService.SUGGEST_STORE_NAME,
        idKey: 'name',
        resettable: true
      });
    }
    if (this.commonService.isNil(query)) {
      this.query = new QueryEntity<ApplicationSuggestionsState>(this.store);
    }
  }

  addApplicationGroup(appGroup: ApplicationGroupRequest): Observable<ApplicationGroup> {
    this.store.setLoading(true);
    return this.http.post<ApplicationGroupRequest>(ApplicationGroupsService.APPLICATION_GROUPS_ENDPOINT, appGroup)
      .pipe(
        map((resp: ApplicationGroupResponse) => {
          applyTransaction(() => {
            // this.store.set(appGroups);
            this.store.setError(void 0);
            this.store.setLoading(false);
          });
          return resp;
        }),
        catchError(this.errorHandler.bind(this))
      );
  }

  getApplicationSuggestions(): Observable<ApplicationSuggestion[]> {
    this.store.setLoading(true);
    return this.http.get<{meta: Object, applicationMembers: ApplicationSuggestion[]}>
      (ApplicationGroupsModalService.APPLICATION_SUGGESTIONS)
      .pipe(
        map((resp: {meta: Object, applicationMembers: ApplicationSuggestion[]}) => {
          applyTransaction(() => {
            this.store.set(resp.applicationMembers);
            this.store.setError(void 0);
            this.store.setLoading(false);
          });
          return resp.applicationMembers;
        }),
        catchError(this.errorHandler.bind(this))
      );
  }

  public selectSuggestions(): Observable<ApplicationSuggestion[]> {
    return this.query.selectAll();
  }

  public selectSuggestionsLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  public selectSuggestionsError(): Observable<DetailedError> {
    return this.query.selectError();
  }

  public reset(): void {
    this.store.reset();
  }

  public updateApplicationGroup(id: string, payload: ApplicationGroupRequest): Observable<ApplicationGroupResponse> {
    this.store.setLoading(true);
    return this.http.put<ApplicationGroupResponse>(ApplicationGroupsService.APPLICATION_GROUPS_ENDPOINT + '/' + id, payload)
      .pipe(
        tap(() => {
          applyTransaction(() => {
            this.store.setError(void 0);
            this.store.setLoading(false);
          });
        }),
        catchError(this.errorHandler.bind(this))
      );
  }

  /**
   * suggestions error handler
   * @param err Http Error
   */
  private errorHandler(err: HttpErrorResponse | LaErrorResponse): Observable<never> {
    applyTransaction(() => {
      this.store.setError<DetailedError>(Object.assign({title: void 0}, err));
      this.store.set([]);
      this.store.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(err);
  }
}
