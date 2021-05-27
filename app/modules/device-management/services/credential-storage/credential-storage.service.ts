import { Injectable } from '@angular/core';
import { CredentialStorageStore, CredentialStorageState } from './credential-storage.store';
import { NgEntityService, NgEntityServiceConfig } from '@datorama/akita-ng-entity-service';
import { CredentialStorageQuery } from './credential-storage.query';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { applyTransaction } from '@datorama/akita';
import { tap } from 'rxjs/internal/operators/tap';
import DetailedError from '../../../shared/components/loading/detailed-error';
import ProfileSnmpCredentials from '../device-management-data/interfaces/profile-snmp-credentials';
import {Logger} from '../../../logger/logger';

@NgEntityServiceConfig({
  resourceName: 'nx/snmpCredentials',
})
@Injectable({ providedIn: 'root' })
export class CredentialStorageService extends NgEntityService<CredentialStorageState> {

  constructor(
    protected store: CredentialStorageStore,
    private query: CredentialStorageQuery,
    private logger: Logger
    ) {
    super(store);
  }

  getSnmpCredentials(): Observable<ProfileSnmpCredentials[]> {
    this.store.setLoading(true);
    return this.get( {
      urlPostfix: 'profiles',
      mapResponseFn: (resp: { credentials: ProfileSnmpCredentials[] }) => resp.credentials
    })
      .pipe(
        tap(() => {
          this.store.setLoading(false);
        }),
        catchError(this.errorHandler.bind(this))
      );
  }

  selectAll(): Observable<ProfileSnmpCredentials[]> {
    return this.query.selectAll();
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

  private errorHandler(err: HttpErrorResponse): Observable<never> {
    applyTransaction(() => {
      this.store.setError<DetailedError>(Object.assign({title: void 0}, err));
      this.store.setLoading(false);
    });
    this.logger.error(err.message);
    return throwError(err);
  }

}
