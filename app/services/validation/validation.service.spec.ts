import { TestBed } from '@angular/core/testing';

import { ValidationService } from './validation.service';

describe('ValidationService', () => {

  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateHostname', () => {
    it('should return true if hostname is valid', () => {
      expect(service.validateHostname('domain.com')).toBeTruthy();
    });
    it('should return false if hostname is invalid', () => {
      expect(service.validateHostname('s!ome.com')).toBeFalsy();
    });
  });

  describe('validateHostnameStrict', () => {
    it('should return true if hostname is valid (strict mode)', () => {
      expect(service.validateHostnameStrict('domain.com')).toBeTruthy();
    });
    it('should return false if hostname is invalid (strict mode)', () => {
      expect(service.validateHostnameStrict('domain')).toBeFalsy();
    });
  });

  describe('validateIpAddress', () => {
    it('should return true if IP address is valid', () => {
      expect(service.validateIpAddress('255.255.255.0')).toBeTruthy();
    });
    it('should return false if IP address is invalid', () => {
      expect(service.validateIpAddress('256.256.256.0')).toBeFalsy();
    });
  });

  describe('validateIpRange', () => {
    it('should return true if IP range is valid', () => {
      expect(service.validateIpRange('255.255.255.0/16')).toBeTruthy();
    });
    it('should return false if IP range is invalid', () => {
      expect(service.validateIpRange('256.256.256.0/128')).toBeFalsy();
    });
  });

  describe('validatePort', () => {
    it('should return true if Port is valid', () => {
      expect(service.validatePort('443')).toBeTruthy();
    });
    it('should return false if Port is invalid', () => {
      expect(service.validatePort('65536')).toBeFalsy();
    });
  });

  describe('ipAddrToDecimal', () => {
    it('should return number', () => {
      expect(service.ipAddrToDecimal('1.1.1.1')).toEqual(16843009);
    });
    it('should return number if IP address invalid', () => {
      expect(service.ipAddrToDecimal('1.1.1')).toEqual(-Infinity);
    });
  });
});
