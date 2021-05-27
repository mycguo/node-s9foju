import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {Observable, of} from 'rxjs';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CookieService} from 'ngx-cookie-service';
import {UserService} from '../user/user.service';
import User from '../user/user.model';
import {UserStore} from '../../store/user/user.store';
import UserRole from '../user/serverModel/userRole.model';
import {WindowRefService} from '../windowRef/windowRef.service';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      CookieService,
      UserService,
      UserStore,
      WindowRefService
    ]
  }));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });


  it('should get if the current user is logged in', (done) => {
    const userService: UserService = TestBed.get(UserService);
    const userSource = of(new User());
    spyOn(userService, 'getLoggedInUser').and.returnValue(userSource);
    const service: AuthService = TestBed.get(AuthService);
    const loggedInState: Observable<boolean> = service.isUserLoggedIn$();
    loggedInState.subscribe((isLoggedin) => {
      expect(isLoggedin).toBeTruthy();
      done();
    });
  });

  it('should logout a user', (done) => {
    const userStore: UserStore = TestBed.get(UserStore);
    const httpMock = TestBed.get(HttpTestingController);
    const service: AuthService = TestBed.get(AuthService);
    const loggedInState: Observable<boolean> = service.isUserLoggedIn$();
    userStore.setUserState({ _id: '0', name: 'testUser', role: new UserRole(), access: null })
    service.logout(true);
    const logoutRequest = httpMock.expectOne('/auth/oauth/logout');
    logoutRequest.flush({});
    loggedInState.subscribe((isLoggedin) => {
      expect(isLoggedin).not.toBeTruthy();
      done();
    });
  });
});
