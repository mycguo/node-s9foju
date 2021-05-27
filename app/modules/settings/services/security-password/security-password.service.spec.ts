import {getTestBed, TestBed} from '@angular/core/testing';

import { SecurityPasswordService } from './security-password.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {PasswordOptions} from '../../components/security-password/interfaces/password-options';
import {Query, Store} from '@datorama/akita';
import {PasswordPolicy} from '../../components/security-password/interfaces/password-policy';
import {PasswordRestrictions} from '../../components/security-password/interfaces/password-restrictions';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('SecurityPasswordService', () => {
  let service: SecurityPasswordService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let passwordOptionsStoreSpy: Store<PasswordOptions>;
  let passwordOptionsQuerySpy: Query<PasswordOptions>;

  const passwdPolicyHttpResponse: PasswordPolicy = {
    passwordLifetime: 60,
    passwordChangeRestrictionPeriod: 0,
    maxStoredPreviousPasswords: 0
  };
  const passwdRestrictionsHttpResponse: PasswordRestrictions = {
    minimumRequiredLength: 5,
    requiredUpperCase: 0,
    requiredLowerCase: 0,
    requiredNumeric: 0,
    requiredNonAlphaNumeric: 0,
  };
  const httpResponse: PasswordOptions = Object.assign({}, passwdPolicyHttpResponse, passwdRestrictionsHttpResponse);

  beforeEach(() => {
    passwordOptionsStoreSpy = new Store<PasswordOptions>({}, {name: 'PasswordOptionsStore', resettable: true});
    passwordOptionsQuerySpy = new Query<PasswordOptions>(passwordOptionsStoreSpy);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        {provide: Store, useValue: passwordOptionsStoreSpy},
        {provide: Query, useValue: passwordOptionsQuerySpy}
      ]
    });
    service = TestBed.inject(SecurityPasswordService);
    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    passwordOptionsStoreSpy.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPasswordOptions', () => {
    it('should call the api and store the result', (done) => {
      spyOn(passwordOptionsStoreSpy, 'update').and.callThrough();
      spyOn(passwordOptionsStoreSpy, 'setLoading').and.callThrough();
      service.getPasswordOptions().subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(httpResponse);
        done();
      });

      const policyReq = httpMock.expectOne(SecurityPasswordService.AUTHENTICATION_OPTIONS_PASSWORD_POLICY_URL);
      const restrictionsReq = httpMock.expectOne(SecurityPasswordService.AUTHENTICATION_OPTIONS_PASSWORD_RESTRICTION_URL);
      expect(policyReq.request.method).toEqual('GET');
      expect(restrictionsReq.request.method).toEqual('GET');
      policyReq.flush(httpResponse);
      restrictionsReq.flush(httpResponse);
      expect(passwordOptionsStoreSpy.update).toHaveBeenCalledWith(jasmine.objectContaining(httpResponse));
      expect(passwordOptionsStoreSpy.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should call api and store the error', (done) => {
      const error = {status: 500, statusText: 'Server Error'};
      spyOn(passwordOptionsStoreSpy, 'setError').and.callThrough();
      spyOn(passwordOptionsStoreSpy, 'setLoading').and.callThrough();
      service.getPasswordOptions().subscribe(
        data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(error));
          done();
        });
      const policyReq = httpMock.expectOne(SecurityPasswordService.AUTHENTICATION_OPTIONS_PASSWORD_POLICY_URL);
      const restrictionsReq = httpMock.expectOne(SecurityPasswordService.AUTHENTICATION_OPTIONS_PASSWORD_RESTRICTION_URL);
      expect(policyReq.request.method).toEqual('GET');
      expect(restrictionsReq.request.method).toEqual('GET');
      policyReq.flush({}, error);
      expect(restrictionsReq.cancelled).toBeTruthy();
      expect(passwordOptionsStoreSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(error));
      expect(passwordOptionsStoreSpy.setLoading).toHaveBeenCalledTimes(2);
    });
  });

  describe('update password options setting', () => {
    it('should call the POST API endpoint', (done) => {
      const passwordOptions: PasswordOptions = httpResponse;
      spyOn(passwordOptionsStoreSpy, 'update');
      spyOn(passwordOptionsStoreSpy, 'setLoading').and.callThrough();
      service.setPasswordOptions(passwordOptions).subscribe(data => {
        expect(data).toBeDefined();
        expect(passwordOptionsStoreSpy.update).toHaveBeenCalledWith(jasmine.objectContaining(httpResponse));
        done();
      });
      const policyReq = httpMock.expectOne(SecurityPasswordService.AUTHENTICATION_OPTIONS_PASSWORD_POLICY_URL);
      const restrictionsReq = httpMock.expectOne(SecurityPasswordService.AUTHENTICATION_OPTIONS_PASSWORD_RESTRICTION_URL);
      expect(policyReq.request.method).toEqual('POST');
      expect(restrictionsReq.request.method).toEqual('POST');
      expect(policyReq.request.body).toBeTruthy();
      expect(restrictionsReq.request.body).toBeTruthy();
      policyReq.flush(passwdPolicyHttpResponse);
      restrictionsReq.flush(passwdRestrictionsHttpResponse);
      expect(passwordOptionsStoreSpy.setLoading).toHaveBeenCalledTimes(2);
    });
  });
});
