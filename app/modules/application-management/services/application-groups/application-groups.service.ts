import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {forkJoin, Observable, throwError} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {applyTransaction, EntityState, transaction} from '@datorama/akita';
import ApplicationGroup from '../../models/application-group';
import {SimpleFilterService} from '../../../../services/table-filter/simple-filter.service';
import {ApplicationGroupStore} from '../../stores/application-groups/application-group.store';
import {ApplicationGroupQuery} from '../../stores/application-groups/application-group.query';
import LaErrorResponse from '../../../live-insight-edge/services/live-insight-edge-report-page/reports-services/la-error-response';
import {ApplicationGroupResponse} from '../../models/application-group-response';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class ApplicationGroupsService extends SimpleFilterService<EntityState<ApplicationGroup>, ApplicationGroup> {
  static readonly APPLICATION_GROUPS_ENDPOINT = '/api/nx/applicationGroups';
  static readonly ALLOWABLE_GLOBAL_FILTER_KEYS = ['name', 'applicationsString'];


  constructor(
    private http: HttpClient,
    private logger: Logger,
    private store: ApplicationGroupStore,
    query: ApplicationGroupQuery
  ) {
    super(query, void 0, 'id', ApplicationGroupsService.ALLOWABLE_GLOBAL_FILTER_KEYS);
  }

  /**
   * Get the list of application groups
   */
  getApplicationGroups(): Observable<ApplicationGroup[]> {
    this.store.setLoading(true);

    return this.http.get<{meta: Object, applicationGroups: ApplicationGroupResponse[]}>
    (ApplicationGroupsService.APPLICATION_GROUPS_ENDPOINT)
      .pipe(
      map((resp: {meta: Object, applicationGroups: ApplicationGroupResponse[]}) => {
        const appGroups: ApplicationGroup[] = resp.applicationGroups?.map(appGroup => (new ApplicationGroup({...appGroup})));
        if (appGroups === void 0) {
          applyTransaction(() => {
            this.store.set([]);
            this.store.setError(new Error());
            this.store.setLoading(false);
          });
          return void 0;
        }
        applyTransaction(() => {
          this.store.set(appGroups);
          this.store.setError(void 0);
          this.store.setLoading(false);
        });
        return appGroups;
      }),
        catchError(this.errorHandler.bind(this))
    );
  }

  @transaction()
  deleteApplicationGroups(): Observable<string[]> {
    const batchObservables: Observable<string>[] = [];

    this.store.setLoading(true);
    this.query.getActiveId().forEach(id => {
      batchObservables.push(this.deleteApplicationGroup(id));
    });
    return forkJoin(batchObservables)
      .pipe(
        finalize(() => {
          this.store.setLoading(false);
        })
      );
  }

  /**
   * application group store handlers
   */
  public selectFilteredGroups(): Observable<ApplicationGroup[]> {
    return super.selectedFilteredItems();
  }

  public selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  public selectError(): Observable<DetailedError> {
    return this.query.selectError();
  }

  public selectFilteredActiveRows(): Observable<string[]> {
    return super.selectActiveId();
  }

  public getActiveRow(): ApplicationGroup {
    return this.query.getActive()[0];
  }

  public getEntity(id): ApplicationGroup {
    return this.query.getEntity(id);
  }

  public setActiveRows(ids: string[]): void {
    super.selectActiveItemIds(ids)
      .subscribe((selectedIds: Array<string>) => {
        this.store.setActive(selectedIds);
      });
  }

  public getAllGroupNames(): string[] {
    return this.query.getAll().map(group => group.name);
  }

  /**
   * reset table state on destroy
   */
  public reset(): void {
    this.store.reset();
    super.clearFilters();
    super.clearSort();
  }

  private deleteApplicationGroup(id: string): Observable<string> {
    return this.http.delete(ApplicationGroupsService.APPLICATION_GROUPS_ENDPOINT + '/' + id)
      .pipe(
        map(() => {
          return id;
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          this.logger.error(err.message);
          return throwError(err);
        })
      );
  }

  /**
   * error handler
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
