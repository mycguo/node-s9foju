import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {applyTransaction} from '@datorama/akita';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {UsersStore} from './store/users.store';
import {UsersQuery} from './store/users.query';
import Users from './user.model';
import DetailedError from '../../modules/shared/components/loading/detailed-error';
import {Logger} from '../../modules/logger/logger';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  static readonly USERS_ENDPOINT = '/api/la-user-management/users';

  constructor(
    private http: HttpClient,
    private logger: Logger,
    private store: UsersStore,
    public query: UsersQuery
  ) {
  }

  getAllUsers(includeDeviceAccess?: boolean): Observable<Users> {
    this.store.setLoading(true);
    const params = new HttpParams();
    if (includeDeviceAccess !== void 0) {
      params.set('includeDeviceAccess', includeDeviceAccess?.toString());
    }

    return this.http.get<{meta: Object, users: Users}>(UsersService.USERS_ENDPOINT, {params})
      .pipe(
        map((resp: {meta: Object, users: Users}) => {
          applyTransaction(() => {
            this.store.set(resp.users);
            this.store.setError(void 0);
            this.store.setLoading(false);
          });
          return resp.users;
        }),
        catchError(this.errorHandler.bind(this))
      );

  }

  public selectLoading(): Observable<boolean> {
    return this.query.selectLoading();
  }

  public selectError(): Observable<DetailedError> {
    return this.query.selectError();
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
