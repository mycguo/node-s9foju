import { Injectable } from '@angular/core';
import { SimpleFilterService } from '../../../../services/table-filter/simple-filter.service';
import { applyTransaction, EntityState, EntityStore, QueryEntity, transaction } from '@datorama/akita';
import { CustomOidPollingState } from './models/custom-oid-polling-state';
import { combineLatest, forkJoin, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomOidPollingDevicesService } from './custom-oid-polling-devices.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import CustomOidPolling from './models/custom-oid-polling';
import CustomOidPollingDevices from './models/custom-oid-polling-devices';
import { CustomOidsService } from '../../../../services/custom-oids/custom-oids.service';
import { CustomOid } from '../../../../services/custom-oids/models/custom-oid';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class CustomOidPollingService extends SimpleFilterService<EntityState<CustomOidPolling>, CustomOidPolling> {

  static readonly ALLOWABLE_GLOBAL_FILTER_KEYS = [
    'name',
    'oidValue',
    'units',
    'processingType',
    'deviceNamesString',
  ];
  static readonly CUSTOM_OID_POLLING_STORE_NAME = 'customOidPolling';

  static readonly store: EntityStore<CustomOidPollingState> =
    new EntityStore<CustomOidPollingState>(
      {
        active: []
      },
      {
        name: CustomOidPollingService.CUSTOM_OID_POLLING_STORE_NAME,
        resettable: true
      }
    );
  static readonly query: QueryEntity<CustomOidPollingState> =
    new QueryEntity<CustomOidPollingState>(
      CustomOidPollingService.store
    );

  constructor(
    private customOidsService: CustomOidsService,
    private customOidPollingDevices: CustomOidPollingDevicesService,
    private logger: Logger,
  ) {
    super(
      CustomOidPollingService.query,
      void 0,
      'id',
      CustomOidPollingService.ALLOWABLE_GLOBAL_FILTER_KEYS
    );
  }

  /**
   * Get the list of Custom OIDs and map device names to OID associated device serials
   */
  getCustomOidPolling(): Observable<CustomOidPolling[]> {
    const customOids$ = this.customOidsService.getCustomOids();
    const customOidDevices$ = this.customOidPollingDevices.getDevices();

    CustomOidPollingService.store.setLoading(true);
    return combineLatest([customOids$, customOidDevices$])
      .pipe(
        map(([customOids, devices]: [CustomOid[], CustomOidPollingDevices[]]) =>
          customOids?.map(customOid => {
            const oidDevices: CustomOidPollingDevices[] = this.mapDevices(customOid.association.deviceSerials, devices);
            return new CustomOidPolling({
              customOid: {
                ...customOid, association: {
                  deviceSerials: oidDevices.map(device => device.serial)
                }
              },
              deviceNames: oidDevices.map(device => device.deviceName)
            });
          })
        ),
        tap(customOids => {
          applyTransaction(() => {
            if (customOids.length === 0) {
              CustomOidPollingService.store.setError(new Error()); // set error to force Loading component show NoDataMessage
            }
            CustomOidPollingService.store.set(customOids);
            CustomOidPollingService.store.setLoading(false);
          });
        }),
        catchError(this.errorHandler.bind(this))
      );
  }

  addCustomOid(customOid: CustomOid): Observable<CustomOid> {
    CustomOidPollingService.store.setLoading(true);
    CustomOidPollingService.store.setError(null);
    return this.customOidsService.addCustomOid(customOid)
      .pipe(
        tap(() => {
          CustomOidPollingService.store.setLoading(false);
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          const error = err.error?.message !== void 0 ? err.error : err;
          return this.errorHandler(error);
        })
      );
  }

  editCustomOid(customOid: CustomOid): Observable<CustomOid> {
    CustomOidPollingService.store.setLoading(true);
    CustomOidPollingService.store.setError(null);
    return this.customOidsService.editCustomOid(customOid)
      .pipe(
        tap(() => {
          CustomOidPollingService.store.setLoading(false);
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          const error = err.error?.message !== void 0 ? err.error : err;
          return this.errorHandler(error);
        })
      );
  }

  @transaction()
  deleteCustomOids(): Observable<string[]> {
    const batchObservables: Observable<string>[] = [];

    CustomOidPollingService.store.setLoading(true);
    CustomOidPollingService.query.getActiveId().forEach(id => {
      batchObservables.push(this.customOidsService.deleteCustomOid(id));
    });
    return forkJoin(batchObservables)
      .pipe(
        finalize(() => {
          CustomOidPollingService.store.setLoading(false);
        })
      );
  }

  /**
   * Custom OIDs grid store handlers
   */
  selectFilteredGroups(): Observable<CustomOidPolling[]> {
    return super.selectedFilteredItems();
  }

  selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  selectError(): Observable<DetailedError> {
    return this.query.selectError();
  }

  resetError(): void {
    CustomOidPollingService.store.setError(null);
  }

  selectFilteredActiveRows(): Observable<string[]> {
    return super.selectActive()
      .pipe(
        map(oids => oids.map(oid => oid.id))
      );
  }

  setActiveRows(ids: string[]): void {
    super.selectActiveItemIds(ids)
      .subscribe((selectedIds: Array<string>) => {
        CustomOidPollingService.store.setActive(selectedIds);
      });
  }

  // get first selected row
  getActiveRow(): CustomOidPolling {
    return CustomOidPollingService.query.getActive()[0];
  }

  getEntity(id): CustomOidPolling {
    return CustomOidPollingService.query.getEntity(id);
  }

  reset(): void {
    CustomOidPollingService.store.reset();
    this.customOidPollingDevices.reset();
    this.customOidsService.reset();
  }

  resetDevicesSelection(): void {
    this.customOidPollingDevices.setActiveRows([]);
    this.customOidPollingDevices.clearFilters();
    this.customOidPollingDevices.clearSort();
    CustomOidPollingService.store.setLoading(false);
  }

  setDevicesActiveRows(rows) {
    this.customOidPollingDevices.setActiveRows(rows);
  }

  private mapDevices(customOidSerials: string[], devices: CustomOidPollingDevices[]): CustomOidPollingDevices[] {
    return devices.filter(device => customOidSerials?.includes(device.serial));
  }

  /**
   * error handler
   * @param err Http Error
   */
  private errorHandler(err: HttpErrorResponse): Observable<never> {
    applyTransaction(() => {
      CustomOidPollingService.store.setError<DetailedError>(Object.assign({title: void 0}, err));
      CustomOidPollingService.store.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(err);
  }
}
