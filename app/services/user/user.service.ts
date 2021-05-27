import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {noop, Observable, Subscription} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import User from './user.model';
import {UserStore} from '../../store/user/user.store';
import {first, map, tap} from 'rxjs/operators';
import {UserQuery} from '../../store/user/user.query';
import UserServerModel from './serverModel/user.server-model';
import UserPermissionMap from './userPermissionMap';
import {UserAccess} from './userAccess';

const USER_ROUTE = '/api/users/me';
// const LOGOUT_ROUTE = '/api/la-client-session/logout';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  private authToken: string;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  private loggedInUserSub: Subscription;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private userStore: UserStore,
    private userQuery: UserQuery
  ) {
    this.authToken = this.cookieService.get('token');
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', `Bearer ${this.authToken}`);
  }

  getLoggedInUser(): Observable<User> {
    if (this.userQuery.getValue().user === null) {
      this.loggedInUserSub = this.http.get<UserServerModel>(USER_ROUTE, this.httpOptions)
        .pipe(
          map<UserServerModel, User>((userServerModel) => {
            const userAccess = new UserAccess();
            userServerModel.role.capabilities.map((capability) => {
              const capabilityPermissionMap = new UserPermissionMap();
              capability.permissions.map((permission) => {
                capabilityPermissionMap[permission] = true;
              });
              userAccess[capability.resourceTypeId] = capabilityPermissionMap;
            });
            return {
              ...userServerModel,
              access: userAccess
            };
          }),
          tap(user => {
            this.userStore.setUserState(user);
          })
        ).subscribe();
    }
    return this.userQuery.select( userState => userState.user );
  }

  logoutUser() {
    this.userStore.setUserState(null);
  }

  ngOnDestroy(): void {
    this.loggedInUserSub ? this.loggedInUserSub.unsubscribe() : noop();
  }
}
