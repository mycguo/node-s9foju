import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {forkJoin, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {applyTransaction, EntityState} from '@datorama/akita';
import {ReportsManagement} from './models/reports-management';
import {ReportsManagementStore} from './store/reports-management.store';
import {ReportsManagementQuery} from './store/reports-management.query';
import {SimpleFilterService} from '../../../../services/table-filter/simple-filter.service';
import {ReportsManagementResponse} from './models/reports-management-response';
import {ReportOwnerStatus} from './enums/report-owner-status.enum';
import {UsersService} from '../../../../services/users/users.service';
import Users from '../../../../services/users/user.model';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class ReportsManagementService extends SimpleFilterService<EntityState<ReportsManagement>, ReportsManagement> {

  static readonly REPORTS_TEMPLATES_ENDPOINT = '/api/nx/reports/templates';
  static readonly REPORTS_TEMPLATES_REASSIGN_ENDPOINT = ReportsManagementService.REPORTS_TEMPLATES_ENDPOINT + '/bulkAssign';

  constructor(
    private http: HttpClient,
    private logger: Logger,
    private usersService: UsersService,
    private store: ReportsManagementStore,
    query: ReportsManagementQuery
  ) {
    super(query, void 0, 'id');
  }

  getReportsManagementList(): Observable<ReportsManagement[]> {
    this.store.setLoading(true);

    return forkJoin({
      groups: this.getAllReportTemplates(),
      users: this.usersService.getAllUsers()
    })
      .pipe(
        map((resp: { groups: ReportsManagementResponse[], users: Users }) => {
          const reports = resp.groups?.map(report => {
            const ownerStatus = this.getOwnerStatus(report, resp.users);
            return new ReportsManagement({
              id: report.id,
              isScheduled: report.scheduleConfig !== null,
              reportName: report.name,
              reportOwner: report.owner,
              reportOwnerStatus: ownerStatus
            });
          }) || [];
          applyTransaction(() => {
            this.store.set(reports);
            this.store.setError(void 0);
            this.store.setLoading(false);
          });
          return reports;
        }),
        catchError(this.errorHandler.bind(this))
      );

  }

  /**
   * Figure out the owner status.  If the user name is not in the list of current users then the owner must be removed.
   * @param report - The report we are trying to find out the owner status for
   * @param existingUsers - The list of all users known by LiveNX
   *
   */
  getOwnerStatus(report: ReportsManagementResponse, existingUsers: Users): ReportOwnerStatus {
    const reportOwnerUser = existingUsers?.find(user => user.userName === report.owner);
    if (reportOwnerUser === void 0) {
      return ReportOwnerStatus.REMOVED;
    } else if (reportOwnerUser.activated !== true) {
      return ReportOwnerStatus.DISABLED;
    } else {
      return ReportOwnerStatus.ACTIVE;
    }
  }

  getAllReportTemplates(): Observable<ReportsManagementResponse[]> {
    return this.http.get<{ meta: Object, groups: ReportsManagementResponse[] }>(
      ReportsManagementService.REPORTS_TEMPLATES_ENDPOINT
    )
      .pipe(
        map((resp: { meta: Object, groups: ReportsManagementResponse[] }) => resp.groups),
        catchError(this.errorHandler.bind(this))
      );
  }

  deleteTemplates(templateIds: string[]): Observable<void> {
    return this.http.put<void>(ReportsManagementService.REPORTS_TEMPLATES_ENDPOINT, {
      templateList: templateIds.map(templateId => ({templateId: templateId}))
    });
  }

  reassignTemplates(templateIds: string[], owner: string): Observable<ReportsManagementResponse[]> {
    return this.http.post<ReportsManagementResponse[]>(ReportsManagementService.REPORTS_TEMPLATES_REASSIGN_ENDPOINT, {
      templateList: templateIds.map(templateId => ({
        templateId: templateId,
        owner: owner
      }))
    });
  }

  /**
   * table store handlers
   */
  public selectFilteredGroups(): Observable<ReportsManagement[]> {
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

  public getActiveRows(): ReportsManagement[] {
    return <ReportsManagement[]>this.query.getActive();
  }

  public getEntity(id): ReportsManagement {
    return this.query.getEntity(id);
  }

  public setActiveRows(ids: string[]): void {
    super.selectActiveItemIds(ids)
      .subscribe((selectedIds: Array<string>) => {
        this.store.setActive(selectedIds);
      });
  }

  // reset table state on destroy
  public reset(): void {
    this.store.reset();
    super.clearFilters();
    super.clearSort();
  }

  /**
   * error handler
   * @param err Http Error
   */
  private errorHandler(err: HttpErrorResponse): Observable<never> {
    applyTransaction(() => {
      this.store.setError<DetailedError>(Object.assign({title: void 0}, err));
      this.store.set([]);
      this.store.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(err);
  }
}
