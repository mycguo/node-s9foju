import {Injectable, Optional} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CommonService} from '../../../../utils/common/common.service';
import {applyTransaction, EntityStore, QueryEntity} from '@datorama/akita';
import {ServiceNowCourierConfigsState} from './models/service-now-courier-configs-state';
import ServiceNowCourierConfig from './models/service-now-courier-config';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize, map, tap} from 'rxjs/operators';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {ClientErrorHandler} from '../../../../utils/client-error-handler/client-error-handler';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class ServiceNowCourierConfigService {
  static readonly SERVICE_NOW_COURIER_CONFIG_URL = '/api/nx/serviceNow/global/courierConfig ';
  static readonly INITIAL_STATE = {
    loading: false,
    active: null
  };
  static readonly STORE_NAME = 'serviceNowCourierConfigs';

  constructor(private http: HttpClient,
              private commonService: CommonService,
              private logger: Logger,
              @Optional() private readonly store: EntityStore<ServiceNowCourierConfigsState, ServiceNowCourierConfig>,
              @Optional() private readonly query: QueryEntity<ServiceNowCourierConfigsState>) {
    if (this.commonService.isNil(store)) {
      this.store = new EntityStore<ServiceNowCourierConfigsState>(ServiceNowCourierConfigService.INITIAL_STATE, {
        name: ServiceNowCourierConfigService.STORE_NAME,
        idKey: 'fieldName',
        resettable: true
      });
    }
    if (this.commonService.isNil(query)) {
      this.query = new QueryEntity<ServiceNowCourierConfigsState, ServiceNowCourierConfig, string>(this.store);
    }
  }

  selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  selectError(): Observable<DetailedError> {
    return this.query.selectError();
  }

  public reset(): void {
    this.store.reset();
  }

  findValue(fieldName: string): ServiceNowCourierConfig {
    return this.query.getAll()
      .find((config: ServiceNowCourierConfig) => {
        return config.fieldName === fieldName;
      });
  }

  selectConfigCouriers(): Observable<Array<ServiceNowCourierConfig>> {
    return this.query.selectAll()
      .pipe(
        // ensure configs can be edited (not readonly)
        map((configs: Array<ServiceNowCourierConfig>) => {
          return configs.map((config: ServiceNowCourierConfig): ServiceNowCourierConfig => {
            return {...config};
          });
        })
      );
  }

  getConfigCouriers(): Observable<Array<ServiceNowCourierConfig>> {
    applyTransaction(() => {
      this.store.setLoading(true);
      this.store.setError(void 0);
    });

    return this.http.get<{ fieldOptions: Array<ServiceNowCourierConfig> }>(ServiceNowCourierConfigService.SERVICE_NOW_COURIER_CONFIG_URL)
      .pipe(
        map((resp: { fieldOptions: Array<ServiceNowCourierConfig> }) => {
          return resp.fieldOptions;
        }),
        tap(options => {
          applyTransaction(() => {
            this.store.set(options);
            this.store.setLoading(false);
          });
        }),
        catchError(this.errorHandler.bind(this)),
        finalize(() => this.store.setLoading(false))
      );
  }

  updateConfigCouriers(couriers: Array<ServiceNowCourierConfig>): Observable<Array<ServiceNowCourierConfig>> {
    applyTransaction(() => {
      this.store.setLoading(true);
      this.store.setError(void 0);
    });

    return this.http.put<{ fieldOptions: Array<ServiceNowCourierConfig> }>(ServiceNowCourierConfigService.SERVICE_NOW_COURIER_CONFIG_URL,
      {
        fieldOptions: couriers
      })
      .pipe(
        map((resp: { fieldOptions: Array<ServiceNowCourierConfig> }) => {
          return resp.fieldOptions;
        }),
        tap(options => {
          applyTransaction(() => {
            this.store.set(options);
            this.store.setLoading(false);
          });
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          this.store.setLoading(false);
          this.logger.error(err.message);
          return throwError(err);
        }),
        finalize(() => this.store.setLoading(false))
      );
  }

  /**
   * transforms array to map
   */
  transformConfigToObj(serviceNowCourierConfigs: Array<ServiceNowCourierConfig>): { [key: string]: ServiceNowCourierConfig } {
    const values: { [key: string]: ServiceNowCourierConfig } = {};
    serviceNowCourierConfigs.forEach((config: ServiceNowCourierConfig) => {
      values[config.fieldName] = config;
    });
    return values;
  }

  private errorHandler(err: HttpErrorResponse): Observable<DetailedError> {
    const error = ClientErrorHandler.buildDetailedError(err);
    applyTransaction(() => {
      this.store.setError<DetailedError>(error);
      this.store.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(error);
  }
}
