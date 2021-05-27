import { TestBed } from '@angular/core/testing';

import { AuthHttpInterceptorService } from './auth-http-interceptor.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Observable} from 'rxjs';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

const MOCK_ENDPOINT = 'http://localhost/should-never-be-called';

@Injectable()
class MockDataService {

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(MOCK_ENDPOINT);
  }
}

describe('AuthHttpInterceptorService', () => {

  let mockDataService: MockDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CookieService,
        MockDataService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthHttpInterceptorService,
          multi: true
        }
      ]
    });
    mockDataService = TestBed.get(MockDataService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: AuthHttpInterceptorService = TestBed.get(AuthHttpInterceptorService);
    expect(service).toBeTruthy();
  });

  it('should insert a Bearer token to the header of the request', (done) => {
    mockDataService.getData().subscribe(resp => {
      expect(resp).toBeTruthy();
      done();
    });
    const httpRequest = httpMock.expectOne(MOCK_ENDPOINT);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    httpRequest.flush({});
  });
});
