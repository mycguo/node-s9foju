import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import {CookieService} from 'ngx-cookie-service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import User from './user.model';
import {UserStore} from '../../store/user/user.store';
import {UserQuery} from '../../store/user/user.query';


describe('UserService', () => {
  let userService: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CookieService,
        UserStore,
        UserQuery
      ]
    });
    userService = TestBed.get(UserService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });

  it('should return user data', (done) => {
    userService.getLoggedInUser()
      .subscribe((res: User) => {
        if (!!res) {
          expect(res.name).toBe('userName');
          done();
        }
      });
    const userRequest = httpMock.expectOne('/api/users/me');
    userRequest.flush({
      name: 'userName',
      role: {
        capabilities: [
          {
            resourceTypeId: 'test',
            permissions: [
              'read',
              'update'
            ]
          }
        ]
      }
    });
  });
});
