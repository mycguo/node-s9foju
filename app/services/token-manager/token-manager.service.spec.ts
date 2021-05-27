import { TestBed } from '@angular/core/testing';

import { TokenManagerService } from './token-manager.service';
import {CookieService} from 'ngx-cookie-service';
import {Injectable} from '@angular/core';

const authToken = 'this is the token';

@Injectable()
class MockCookieService extends CookieService {
  get(key: string) {
    if (key === 'token') {
      return authToken;
    }
  }
}

describe('TokenManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: CookieService, useClass: MockCookieService }
    ]
  }));

  it('should be created', () => {
    const service: TokenManagerService = TestBed.get(TokenManagerService);
    expect(service).toBeTruthy();
  });

  it('should get return a stored auth token', () => {
    const service: TokenManagerService = TestBed.get(TokenManagerService);
    const tokenString = service.getAuthToken();
    expect(tokenString).toBe(authToken);
  });
});
