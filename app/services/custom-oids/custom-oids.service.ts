import { Injectable, Optional } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CustomOid } from './models/custom-oid';
import { catchError, map, tap } from 'rxjs/operators';
import { applyTransaction, EntityStore, QueryEntity } from '@datorama/akita';
import { CustomOidsState } from './models/custom-oid-state';
import { CommonService } from '../../utils/common/common.service';
import {Logger} from '../../modules/logger/logger';

@Injectable({
  providedIn: 'root'
})
export class CustomOidsService {
  static readonly CUSTOM_OIDS_URL = '/api/nx/polling/oid/configurations';
  static readonly INITIAL_STATE = {};
  static readonly STORE_NAME = 'customOids';

  constructor(private http: HttpClient,
              private logger: Logger,
              private commonService: CommonService,
              @Optional() private readonly store: EntityStore<CustomOidsState>,
              @Optional() private readonly query: QueryEntity<CustomOidsState>) {
    if (commonService.isNil(store)) {
      this.store = new EntityStore(CustomOidsService.INITIAL_STATE, {
        name: CustomOidsService.STORE_NAME,
        resettable: true
      });
    }

    if (commonService.isNil(query)) {
      this.query = new QueryEntity<CustomOidsState>(this.store);
    }
  }

  reset(): void {
    this.store.reset();
  }

  selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  selectError(): Observable<Error> {
    return this.query.selectError();
  }

  selectCustomOids(): Observable<Array<CustomOid>> {
    return this.query.selectAll();
  }

  getCustomOids(): Observable<Array<CustomOid>> {
    applyTransaction(() => {
      this.store.setLoading(true);
      this.store.setError(void 0);
    });
    return this.http.get<{ meta: Object, configurations: Array<CustomOid> }>(CustomOidsService.CUSTOM_OIDS_URL)
      .pipe(
        map((resp: { meta: Object, configurations: Array<CustomOid> }) => {
          return resp.configurations;
        }),
        tap((customOids: Array<CustomOid>) => {
          applyTransaction(() => {
            this.store.set(customOids);
            this.store.setLoading(false);
          });
        }),
        catchError((err: HttpErrorResponse): Observable<never> => {
          applyTransaction(() => {
            this.store.setError(err);
            this.store.setLoading(false);
          });
          this.logger.error(err.message);
          return throwError(err);
        })
      );
  }

  addCustomOid(customOid: CustomOid): Observable<CustomOid> {
    return this.http.post<CustomOid>(CustomOidsService.CUSTOM_OIDS_URL, customOid);
  }

  editCustomOid(customOid: CustomOid): Observable<CustomOid> {
    return this.http.put<CustomOid>(`${CustomOidsService.CUSTOM_OIDS_URL}/${customOid.id}`, customOid);
  }

  deleteCustomOid(id: string) {
    return this.http.delete(CustomOidsService.CUSTOM_OIDS_URL + '/' + id)
      .pipe(
        map(() => id),
        catchError((err: HttpErrorResponse): Observable<never> => {
          this.logger.error(err.message);
          return throwError(err);
        })
      );
  }
}
