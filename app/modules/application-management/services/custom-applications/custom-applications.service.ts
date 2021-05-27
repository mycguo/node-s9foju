import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { combineLatest, forkJoin, Observable, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { applyTransaction, EntityState, EntityStore, QueryEntity } from '@datorama/akita';
import { SimpleFilterService } from '../../../../services/table-filter/simple-filter.service';
import { CustomApplicationStore } from '../../stores/custom-applications/custom-application.store';
import { CustomApplicationQuery } from '../../stores/custom-applications/custom-application.query';
import LaErrorResponse from '../../../live-insight-edge/services/live-insight-edge-report-page/reports-services/la-error-response';
import CustomApplication from '../../models/custom-application';
import CustomApplicationModel from '../../models/custom-application-model';
import { NbarApplication } from '../../models/nbar-application';
import { NbarApplicationState } from '../../models/nbar-application-state';
import { CustomApplicationRequest } from '../../models/custom-application-request';
import { ApplicationMoveDirection } from '../../enums/application-move-direction.enum';
import DetailedError from '../../../shared/components/loading/detailed-error';
import { DscpType } from '../../models/dscp-type';
import { DscpTypeState } from '../../models/dscp-type-state';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class CustomApplicationsService extends SimpleFilterService<EntityState<CustomApplicationModel>, CustomApplicationModel> {
  static readonly CUSTOM_APPLICATIONS_ENDPOINT = '/api/custom-applications';
  static readonly NBAR_APPLICATIONS_ENDPOINT = '/api/nx/applications/nbar';
  static readonly DSCP_TYPES_ENDPOINT = '/api/nx/applications/customAppDscpTypes';
  static readonly NBAR_APPLICATIONS_STORE_NAME = 'NbarApplications';
  static readonly DSCP_TYPES_STORE_NAME = 'DscpTypes';
  static readonly CUSTOM_APP_PROTOCOLS = '/api/nx/applications/customAppProtocols';
  static readonly ALLOWABLE_GLOBAL_FILTER_KEYS = [
    'name',
    'description',
    'protocol',
    'ipRangesString',
    'portRangesString',
    'nbarAppsString',
    'urlsString',
    'dscpTypesString'
  ];

  static readonly nbarAppsStore: EntityStore<NbarApplicationState> =
    new EntityStore<NbarApplicationState>({},
      {
        name: CustomApplicationsService.NBAR_APPLICATIONS_STORE_NAME,
        resettable: true
      }
    );
  static readonly nbarAppsQuery: QueryEntity<NbarApplicationState> =
    new QueryEntity<NbarApplicationState>(CustomApplicationsService.nbarAppsStore,
      {
        sortBy: 'name'
      });

  static readonly dscpTypesStore: EntityStore<DscpTypeState> =
    new EntityStore<DscpTypeState>({},
      {
        name: CustomApplicationsService.DSCP_TYPES_STORE_NAME,
        idKey: 'value',
        resettable: true
      }
    );
  static readonly dscpTypesQuery: QueryEntity<DscpTypeState> =
    new QueryEntity<DscpTypeState>(CustomApplicationsService.dscpTypesStore,
      {
        sortBy: 'value'
      });

  appProtocols: Array<string>;

  constructor(
    private http: HttpClient,
    private logger: Logger,
    private store: CustomApplicationStore,
    query: CustomApplicationQuery

  ) {
    super(query, void 0, 'id', CustomApplicationsService.ALLOWABLE_GLOBAL_FILTER_KEYS);
  }

  getCustomApplications(): Observable<CustomApplicationModel[]> {
    this.store.setLoading(true);
    return combineLatest([
      this.getCustomAppsRequest(),
      this.getNbarApplications(),
      this.getDscpTypes()
    ])
      .pipe(
        map(([customAppsResp, nbarApps, dscpTypes]) => {
          const customApps: CustomApplicationModel[] =
            customAppsResp?.map(customApp => {
              return new CustomApplicationModel({
                ...customApp,
                nbarApps: this.mapNbarApplications(customApp, nbarApps),
                dscpTypesString: this.mapDscpTypes(customApp, dscpTypes)?.map(dscpType => dscpType.name).join(', ')
              });
            });
          if (customApps === void 0) {
            applyTransaction(() => {
              this.store.set([]);
              this.store.setError(new Error());
              this.store.setLoading(false);
            });
            return [];
          }
          applyTransaction(() => {
            this.store.set(customApps);
            this.store.setError(void 0);
            this.store.setLoading(false);
          });
          return customApps;
        }),
        catchError(this.errorHandler.bind(this))
      );
  }

  getCustomAppsRequest(): Observable<CustomApplication[]> {
    return this.http.get<{ meta: Object, applications: CustomApplication[] }>
    (CustomApplicationsService.CUSTOM_APPLICATIONS_ENDPOINT)
      .pipe(
        map((resp: {meta: Object, applications: CustomApplication[]}) => resp.applications)
      );
  }

  getNbarApplications(): Observable<NbarApplication[]> {
    const nbarApps$ = this.http.get<{meta: Object, applications: NbarApplication[]}>
    (CustomApplicationsService.NBAR_APPLICATIONS_ENDPOINT)
      .pipe(
        map((resp: {meta: Object, applications: NbarApplication[]}) => {
          CustomApplicationsService.nbarAppsStore.set(resp.applications);
          return resp.applications;
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          applyTransaction(() => {
            CustomApplicationsService.nbarAppsStore.setError(err);
          });
          this.logger.error(err.message);
          return throwError(err);
        })
      );

    return CustomApplicationsService.nbarAppsQuery.getHasCache() ? CustomApplicationsService.nbarAppsQuery.selectAll() : nbarApps$;
  }

  mapNbarApplications(customApp: CustomApplication, nbarApps: NbarApplication[]): NbarApplication[] {
    return customApp?.nbarIds?.map(id => {
      return nbarApps?.find(app => app.id === id.toString(10));
    });
  }

  getDscpTypes(): Observable<DscpType[]> {
    const dscpTypes$ = this.http.get<{dscpTypes: DscpType[]}>
    (CustomApplicationsService.DSCP_TYPES_ENDPOINT)
      .pipe(
        map((resp: {dscpTypes: DscpType[]}) => {
          CustomApplicationsService.dscpTypesStore.set(resp.dscpTypes);
          return resp.dscpTypes;
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          applyTransaction(() => {
            CustomApplicationsService.dscpTypesStore.setError(err);
          });
          this.logger.error(err.message);
          return throwError(err);
        })
      );

    return CustomApplicationsService.dscpTypesQuery.getHasCache() ? CustomApplicationsService.dscpTypesQuery.selectAll() : dscpTypes$;
  }

  mapDscpTypes(customApp: CustomApplication, dscpTypes: DscpType[]): DscpType[] {
    return customApp?.dscpTypes?.map(dscpType => {
      return dscpTypes?.find(dscp => dscp.value === dscpType);
    });
  }

  deleteCustomApplications(): Observable<string[]> {
    const batchObservables: Observable<string>[] = [];

    this.store.setLoading(true);
    this.query.getActiveId().forEach(id => {
      batchObservables.push(this.deleteCustomApplication(id));
    });
    return forkJoin(batchObservables)
      .pipe(
        finalize(() => {
          this.store.setLoading(false);
        })
      );
  }

  /**
   * Edit application rank based on provided direction
   * @param direction - number to add to current application rank +1 -1
   */
  editApplicationRank(direction: ApplicationMoveDirection): Observable<void> {
    const customApp = this.getActiveRow();
    if (customApp === void 0) {
      return throwError('Error changing application rank');
    }
    const rank = customApp.rank + direction;

    this.store.setLoading(true);
    return this.http.put<void>(
      `${CustomApplicationsService.CUSTOM_APPLICATIONS_ENDPOINT}/${customApp.id}/rank`,
      {rank}
    )
      .pipe(
        tap(() => {
          applyTransaction(() => {
            this.store.setLoading(false);
          });
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          this.store.setLoading(false);
          this.logger.error(err.message);
          return throwError(err);
        })
      );
  }

  addCustomApplication(customApp: CustomApplicationRequest): Observable<CustomApplicationRequest> {
    CustomApplicationsService.nbarAppsStore.setLoading(true);
    return this.http.post<CustomApplicationRequest>(CustomApplicationsService.CUSTOM_APPLICATIONS_ENDPOINT, customApp)
      .pipe(
        map((resp) => {
          applyTransaction(() => {
            CustomApplicationsService.nbarAppsStore.setLoading(false);
          });
          return resp;
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          CustomApplicationsService.nbarAppsStore.setLoading(false);
          this.logger.error(err.message);
          return throwError(err);
        })
      );
  }

  editCustomApplication(appId: string, customApp: CustomApplicationRequest): Observable<CustomApplicationRequest> {
    CustomApplicationsService.nbarAppsStore.setLoading(true);
    return this.http.put<CustomApplicationRequest>(`${CustomApplicationsService.CUSTOM_APPLICATIONS_ENDPOINT}/${appId}`, customApp)
      .pipe(
        map((resp) => {
          applyTransaction(() => {
            CustomApplicationsService.nbarAppsStore.setLoading(false);
          });
          return resp;
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          CustomApplicationsService.nbarAppsStore.setLoading(false);
          this.logger.error(err.message);
          return throwError(err);
        })
      );
  }

  getAppProtocols(): Observable<Array<string>> {
    this.store.setLoading(true);
    return this.http.get<{protocols: Array<string>}>(CustomApplicationsService.CUSTOM_APP_PROTOCOLS)
      .pipe(
        map((resp: {protocols: Array<string>}) => {
          this.appProtocols = resp.protocols;
          applyTransaction(() => {
            this.store.setLoading(false);
          });
          return resp.protocols;
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          this.logger.error(err.message);
          return throwError(err);
        })
      );
  }

  /**
   * Custom applications store handlers
   */
  public selectFilteredGroups(): Observable<CustomApplicationModel[]> {
    return super.selectedFilteredItems();
  }

  public selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  public selectError(): Observable<DetailedError> {
    return this.query.selectError();
  }

  public selectFilteredActiveRows(): Observable<CustomApplicationModel[]> {
    return super.selectActive();
  }

  public setActiveRows(ids: string[]): void {
    super.selectActiveItemIds(ids)
      .subscribe((selectedIds: Array<string>) => {
        this.store.setActive(selectedIds);
      });
  }

  // get first selected row
  public getActiveRow(): CustomApplicationModel {
    return this.query.getActive()[0];
  }

  public getEntity(id): CustomApplicationModel {
    return this.query.getEntity(id);
  }

  /**
   * Nbar applications store
   */
  public selectNbarApps(): Observable<NbarApplication[]> {
    return CustomApplicationsService.nbarAppsQuery.selectAll();
  }

  public selectNbarAppsLoading(): Observable<boolean> {
    return CustomApplicationsService.nbarAppsQuery.selectLoading();
  }

  public selectNbarAppsError(): Observable<DetailedError> {
    return CustomApplicationsService.nbarAppsQuery.selectError();
  }

  public selectDscpTypes(): Observable<DscpType[]> {
    return CustomApplicationsService.dscpTypesQuery.selectAll();
  }

  public selectDscpLoading(): Observable<boolean> {
    return CustomApplicationsService.dscpTypesQuery.selectLoading();
  }

  public selectDscpError(): Observable<DetailedError> {
    return CustomApplicationsService.dscpTypesQuery.selectError();
  }

  /**
   * reset table state on destroy
   */
  public reset(): void {
    this.store.reset();
    super.clearFilters();
    super.clearSort();
    CustomApplicationsService.nbarAppsStore.reset();
  }

  private deleteCustomApplication(id: string): Observable<string> {
    return this.http.delete(`${CustomApplicationsService.CUSTOM_APPLICATIONS_ENDPOINT}/${id}`)
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
      this.store.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(err);
  }
}
