import { Injectable } from '@angular/core';
import { SimpleFilterService } from '../../../../services/table-filter/simple-filter.service';
import { applyTransaction, EntityState, EntityStore, QueryEntity } from '@datorama/akita';
import { PreConfiguredOidPollingModel } from './models/pre-configured-oid-polling-model';
import { PreConfiguredOidPollingState } from './models/pre-configured-oid-polling-state';
import { CustomOidPollingDevicesService } from '../custom-oid-polling/custom-oid-polling-devices.service';
import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import CustomOidPollingDevices from '../custom-oid-polling/models/custom-oid-polling-devices';
import { tap } from 'rxjs/internal/operators/tap';
import { PreConfiguredOid } from './models/pre-configured-oid';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import DetailedError from '../../../shared/components/loading/detailed-error';
import { PreConfiguredOidPollingSettings } from './models/pre-configured-oid-polling-settings';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class PreConfiguredOidPollingService
  extends SimpleFilterService<EntityState<PreConfiguredOidPollingModel>, PreConfiguredOidPollingModel> {

  static readonly PRE_DEFINED_OID_POLLING_STORE_NAME = 'PreDefinedOidPolling';
  static readonly PRE_DEFINED_OID_POLLING_ENDPOINT = '/api/nx/polling/predefinedOid/configurations';

  static readonly ALLOWABLE_GLOBAL_FILTER_KEYS = [
    'pollingTypeName',
    'oidNamesString',
    'deviceNamesString',
  ];

  static readonly store: EntityStore<PreConfiguredOidPollingState> =
    new EntityStore<PreConfiguredOidPollingState>({}, {
        name: PreConfiguredOidPollingService.PRE_DEFINED_OID_POLLING_STORE_NAME,
        resettable: true
      }
    );

  static readonly query: QueryEntity<PreConfiguredOidPollingState> =
    new QueryEntity<PreConfiguredOidPollingState>(
      PreConfiguredOidPollingService.store
    );

  constructor(
    private logger: Logger,
    private http: HttpClient,
    private customOidPollingDevices: CustomOidPollingDevicesService,
  ) {
    super(
      PreConfiguredOidPollingService.query,
      void 0,
      'id',
      PreConfiguredOidPollingService.ALLOWABLE_GLOBAL_FILTER_KEYS
    );
  }

  getPreConfiguredOidPolling(): Observable<PreConfiguredOidPollingModel[]> {
    const preConfiguredOids$ = this.getPreConfiguredOid();
    const preConfiguredOidDevices$ = this.customOidPollingDevices.getDevices();

    PreConfiguredOidPollingService.store.setLoading(true);
    return combineLatest([preConfiguredOids$, preConfiguredOidDevices$])
      .pipe(
        map(([preConfiguredOids, devices]: [PreConfiguredOid[], CustomOidPollingDevices[]]) =>
          preConfiguredOids?.map(preConfiguredOid => {
            const oidDevices: CustomOidPollingDevices[] = this.mapDevices(preConfiguredOid.settings.association.deviceSerials, devices);
            return new PreConfiguredOidPollingModel({
              preConfiguredOid: {
                ...preConfiguredOid,
                settings: {
                  ...preConfiguredOid.settings,
                  association: {
                    deviceSerials: oidDevices.map(device => device.serial)
                  }
                }
              },
              deviceNames: oidDevices.map(device => device.deviceName)
            });
          })
        ),
        tap(preConfiguredOids => {
          applyTransaction(() => {
            if (preConfiguredOids.length === 0) {
              PreConfiguredOidPollingService.store.setError(new Error()); // set error to force Loading component show NoDataMessage
            }
            PreConfiguredOidPollingService.store.set(preConfiguredOids);
            PreConfiguredOidPollingService.store.setLoading(false);
          });
        }),
        catchError(this.errorHandler.bind(this))
      );
  }

  updatePreConfiguredOidPolling(id: string, settings: PreConfiguredOidPollingSettings): Observable<PreConfiguredOid> {
    PreConfiguredOidPollingService.store.setLoading(true);
    return this.http.put<PreConfiguredOid>(
      `${PreConfiguredOidPollingService.PRE_DEFINED_OID_POLLING_ENDPOINT}/${id}?includesMetaData=true`,
      settings
    ).pipe(
      tap(() => {
        PreConfiguredOidPollingService.store.setLoading(false);
      }),
      catchError(this.errorHandler.bind(this))
    );
  }

  /**
   * Custom OIDs grid store handlers
   */
  selectFilteredGroups(): Observable<PreConfiguredOidPollingModel[]> {
    return super.selectedFilteredItems();
  }

  selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  selectError(): Observable<DetailedError> {
    return this.query.selectError();
  }

  resetError(): void {
    PreConfiguredOidPollingService.store.setError(null);
  }

  reset(): void {
    PreConfiguredOidPollingService.store.reset();
    super.clearFilters();
    this.customOidPollingDevices.reset();
  }

  private mapDevices(customOidSerials: string[], devices: CustomOidPollingDevices[]): CustomOidPollingDevices[] {
    return devices != null ? devices.filter(device => customOidSerials?.includes(device.serial)) : [];
  }

  private getPreConfiguredOid(): Observable<Array<PreConfiguredOid>> {
    return this.http.get<{ meta: Object, configurations: Array<PreConfiguredOid> }>
    (`${PreConfiguredOidPollingService.PRE_DEFINED_OID_POLLING_ENDPOINT}?includesMetaData=true`)
      .pipe(
        map((resp: { meta: Object, configurations: Array<PreConfiguredOid> }) => resp.configurations),
      );
  }

  /**
   * error handler
   * @param err Http Error
   */
  private errorHandler(err: HttpErrorResponse): Observable<never> {
    applyTransaction(() => {
      PreConfiguredOidPollingService.store.setError<DetailedError>(Object.assign({title: void 0}, err));
      PreConfiguredOidPollingService.store.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(err);
  }
}
