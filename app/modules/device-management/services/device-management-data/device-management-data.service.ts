import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { applyTransaction, transaction } from '@datorama/akita';
import { DeviceManagementDataStore } from './device-management-data.store';
import { DeviceManagementDataQuery } from './device-management-data.query';
import { CommonService } from '../../../../utils/common/common.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import SnmpVersionsEnum from './enums/snmp-versions';
import DeviceSnmpCredentials from './interfaces/device-snmp-credentials';
import SnmpCredentialsTypesEnum from './enums/snmp-credentials-types';
import DeviceCredentialsRequest from './interfaces/device-credentials-request';
import DeviceCredentialsResponse from './interfaces/device-credentials-response';
import {Logger} from '../../../logger/logger';

@Injectable({
  providedIn: 'root'
})
export class DeviceManagementDataService {
  readonly DEVICE_SNMP_CREDENTIAL_URL = '/api/nx/devices';

  constructor(
    private http: HttpClient,
    private logger: Logger,
    private commonService: CommonService,
    protected store: DeviceManagementDataStore,
    private query: DeviceManagementDataQuery
  ) { }

  private getSnmpCredentialForDevice(deviceId: string): Observable<DeviceSnmpCredentials> {
    const url = `${this.DEVICE_SNMP_CREDENTIAL_URL}/${deviceId}/snmpCredentials`;
    return this.http.get<DeviceSnmpCredentials>(url);
  }

  @transaction()
  public getCredentials(devices: {systemName: string, serial: string}[]): Observable<DeviceSnmpCredentials[]> {
    const batchObservables: Observable<DeviceSnmpCredentials>[] = [];

    devices.forEach(({serial}) => {
      batchObservables.push(this.getSnmpCredentialForDevice(serial));
    });

    this.store.setLoading(true);
    return forkJoin(batchObservables)
      .pipe(
        map((credentials) => {
          this.store.update(this.getActualDeviceCredentials(credentials));
          return credentials;
        }),
        catchError(this.errorHandler.bind(this)),
        finalize(() => {
          this.store.setLoading(false);
        })
      );
  }

  public bulkApplySnmpCredentials(
    devices: DeviceCredentialsRequest[],
    credential: DeviceSnmpCredentials
  ): Observable<DeviceCredentialsResponse> {
    const url = `${this.DEVICE_SNMP_CREDENTIAL_URL}/credentials`;
    applyTransaction(() => {
      this.store.update(credential);
      this.store.setLoading(true);
    });
    return this.http.put<DeviceCredentialsResponse>(url, { deviceCredentialRequests: devices })
      .pipe(
        catchError(this.errorHandler.bind(this)),
        finalize(() => {
          this.store.setLoading(false);
        })
      );
  }

  selectCredential(): Observable<DeviceSnmpCredentials> {
    return this.query.select();
  }

  selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  selectError(): Observable<DetailedError> {
    return this.query.selectError();
  }

  resetStore(): void {
    this.store.reset();
  }

  /**
   * observable error handler
   * @param err Http Error
   */
  private errorHandler(err: HttpErrorResponse): Observable<never> {
    applyTransaction(() => {
      this.store.setError<DetailedError>(
        Object.assign({}, {title: void 0}, err)
      );
    });
    this.logger.error(err.message);
    return throwError(err);
  }

  /**
   * Take list of device credentials, compare them and return one credentials object
   */
  private getActualDeviceCredentials(credentials: DeviceSnmpCredentials[]): DeviceSnmpCredentials {
    return credentials.reduce((acc, currentCredentials, index) => {
      if (index === 0) {
        return acc;
      }
      if (this.commonService.isEqual(acc, currentCredentials)) {
        return currentCredentials;
      }
      return {
        snmpVersion : SnmpVersionsEnum.V2C,
        port : 161,
        settings : {},
        type : SnmpCredentialsTypesEnum.MANUAL
      };
    }, credentials[0]);
  }
}
