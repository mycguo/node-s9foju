import {TestBed} from '@angular/core/testing';

import {UnitFormatterService} from './unit-formatter.service';

describe('UnitFormatterService', () => {
  let service: UnitFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test conversion logic', () => {
    it('should work with powers of ten greater than 0 (microseconds to milliseconds)', () => {
      const factor = service.determineConversionRate('us', Math.pow(10, 6));
      expect(factor.factor).toEqual(Math.pow(10, -6));
      expect(factor.units).toEqual('s');
    });

    it('should work with powers of ten greater than 0 (bytes to GB)', () => {
      const factor = service.determineConversionRate('bytes', 2 * Math.pow(10, 11)); // 200 GB worth of bytes
      expect(factor.factor).toEqual(Math.pow(10, -9)); // 10^6 represents GB
      expect(factor.units).toEqual('GB');
    });

    it('should work with a power of ten equal to 0', () => {
      const factor = service.determineConversionRate('bytes', 5);
      expect(factor.factor).toEqual(1);
      expect(factor.units).toEqual('bytes');
    });

    it('should allow for easy formatting with getScaledValue()', () => {
      const factor = service.determineConversionRate('bytes', 2 * Math.pow(10, 11)); // 200 GB worth of bytes
      expect(factor.factor).toEqual(Math.pow(10, -9)); // 10^6 represents GB
      expect(factor.units).toEqual('GB');
      expect(factor.getScaledValue(Math.pow(10, 10))).toEqual(10);
    });
  });

});
