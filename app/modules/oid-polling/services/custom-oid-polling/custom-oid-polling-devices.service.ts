import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SimpleFilterService } from '../../../../services/table-filter/simple-filter.service';
import { applyTransaction, EntityState, EntityStore, QueryEntity } from '@datorama/akita';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';
import { CustomOidPollingDevicesState } from './models/custom-oid-polling-devices-state';
import ILaDeviceResponse from '../../../../../../../project_typings/api/laDevice/ILaDeviceResponse';
import DetailedError from '../../../shared/components/loading/detailed-error';
import CustomOidPollingDevices from './models/custom-oid-polling-devices';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class CustomOidPollingDevicesService extends SimpleFilterService<EntityState<CustomOidPollingDevices>, CustomOidPollingDevices> {

  static readonly DEVICES_ENDPOINT = '/api/la-devices';
  static readonly ALLOWABLE_GLOBAL_FILTER_KEYS = [
    'description',
    'deviceName',
    'ipAddress',
    'model',
    'siteName',
    'tagsString',
    'vendor'
  ];
  static readonly CUSTOM_OID_POLLING_DEVICES_STORE_NAME = 'customOidPollingDevices';

  static readonly devicesStore: EntityStore<CustomOidPollingDevicesState> =
    new EntityStore<CustomOidPollingDevicesState>(
      {
        active: []
      },
      {
        name: CustomOidPollingDevicesService.CUSTOM_OID_POLLING_DEVICES_STORE_NAME,
        idKey: 'serial',
        resettable: true
      }
    );
  static readonly devicesQuery: QueryEntity<CustomOidPollingDevicesState> =
    new QueryEntity<CustomOidPollingDevicesState>(
      CustomOidPollingDevicesService.devicesStore
    );

  constructor(
    private http: HttpClient,
    private logger: Logger,
  ) {
    super(
      CustomOidPollingDevicesService.devicesQuery,
      void 0,
      'serial',
      CustomOidPollingDevicesService.ALLOWABLE_GLOBAL_FILTER_KEYS
    );
  }

  /**
   * Get the list of devices. Use Akita cache to reduce the number of requests to devices endpoint
   */
  getDevices(): Observable<CustomOidPollingDevices[]> {
    CustomOidPollingDevicesService.devicesStore.setLoading(true);
    const devices$ = this.http.get<ILaDeviceResponse[]>(
      CustomOidPollingDevicesService.DEVICES_ENDPOINT,
      {
        params: {
          isCompactResponse: 'true',
          includeNonSnmp: 'false'
        }
      }
    )
      .pipe(
        map(devices => devices?.map(device => new CustomOidPollingDevices(device))),
        tap(customOidDevices => {
          applyTransaction(() => {
            CustomOidPollingDevicesService.devicesStore.set(customOidDevices);
            CustomOidPollingDevicesService.devicesStore.setLoading(false);
          });
        }),
        catchError(this.errorHandler.bind(this))
      );

    if (CustomOidPollingDevicesService.devicesQuery.getHasCache()) {
      CustomOidPollingDevicesService.devicesStore.setLoading(false);
      return CustomOidPollingDevicesService.devicesQuery.selectAll();
    }
    return devices$;
  }

  /**
   * Devices grid store handlers
   */
  selectFilteredGroups(): Observable<CustomOidPollingDevices[]> {
    return super.selectedFilteredItems();
  }

  selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  selectError(): Observable<DetailedError> {
    return this.query.selectError();
  }

  selectFilteredActiveRows(): Observable<string[]> {
    return super.selectActive()
      .pipe(
        map(devices => devices.map(device => device.serial))
      );
  }

  setActiveRows(ids: string[]): void {
    super.selectActiveItemIds(ids)
      .subscribe((selectedIds: Array<string>) => {
        CustomOidPollingDevicesService.devicesStore.setActive(selectedIds);
      });
  }

  // returns all active rows without any applied filters
  selectAllActiveId(): Observable<string[]> {
    return CustomOidPollingDevicesService.devicesQuery.selectActiveId();
  }

  getSelectedActiveIds(): string[] {
    return CustomOidPollingDevicesService.devicesQuery.getActive().map(({ serial}) => serial);
  }

  reset(): void {
    CustomOidPollingDevicesService.devicesStore.reset();

  }

  resetFilters(): void {
    super.clearFilters();
    super.clearSort();
  }

  /**
   * error handler
   * @param err Http Error
   */
  private errorHandler(err: HttpErrorResponse): Observable<never> {
    applyTransaction(() => {
      CustomOidPollingDevicesService.devicesStore.setError<DetailedError>(Object.assign({title: void 0}, err));
      CustomOidPollingDevicesService.devicesStore.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(err);
  }

}
