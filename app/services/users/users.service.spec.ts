import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {UsersStore} from './store/users.store';
import {UsersQuery} from './store/users.query';
import UsersServiceFixtures from './users.service.fixtures';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  let storeSpy: UsersStore;
  const querySpy: UsersQuery = new UsersQuery(new UsersStore());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        UsersStore,
        {provide: UsersQuery, useValue: querySpy}
      ]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
    storeSpy = TestBed.inject(UsersStore);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllUsers', () => {
    it('should return users list and set the store', (done) => {
      spyOn(storeSpy, 'set').and.callThrough();
      service.getAllUsers()
        .subscribe(data => {
          expect(storeSpy.set).toHaveBeenCalled();
          expect(data).toBeDefined();
          expect(data).toEqual(UsersServiceFixtures.USERS_RESPONSE.users);
          done();
        });

      const req = httpMock.expectOne(UsersService.USERS_ENDPOINT);
      expect(req.request.method).toEqual('GET');
      req.flush(UsersServiceFixtures.USERS_RESPONSE);
      expect(storeSpy.set).toHaveBeenCalledWith(jasmine.objectContaining(UsersServiceFixtures.USERS_RESPONSE.users));
    });

    it('should call api and store the error', (done) => {
      spyOn(storeSpy, 'setError').and.callThrough();
      service.getAllUsers().subscribe(
        data => {
          expect(storeSpy.set).toHaveBeenCalled();
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(UsersServiceFixtures.ERROR_RESPONSE));
          done();
        });
      const req = httpMock.expectOne(UsersService.USERS_ENDPOINT);
      expect(req.request.method).toEqual('GET');
      req.flush({}, UsersServiceFixtures.ERROR_RESPONSE);
      expect(storeSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(UsersServiceFixtures.ERROR_RESPONSE));
    });
  });
});
