import { TestBed } from '@angular/core/testing';

import { CommonService } from './common.service';

describe('CommonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonService = TestBed.get(CommonService);
    expect(service).toBeTruthy();
  });

  it('isNil should return true for undefined', () => {
    const service: CommonService = TestBed.get(CommonService);
    const isNil = service.isNil(undefined);
    expect(isNil).toBeTruthy();
  });

  it('isNil should return false for defined value', () => {
    const service: CommonService = TestBed.get(CommonService);
    const isNil = service.isNil('IDDQD');
    expect(isNil).toBeFalsy();
  });

  it('capitalize should return capitalized string', () => {
    const service: CommonService = TestBed.get(CommonService);
    const capitalized = service.capitalize('IDDQD');
    expect(capitalized).toBe('Iddqd');
  });

  it('capitalize should return empty string', () => {
    const service: CommonService = TestBed.get(CommonService);
    const capitalized = service.capitalize(undefined);
    expect(capitalized).toBe('');
  });

  it('compact should return object without null and undefined properties', () => {
    const service: CommonService = TestBed.get(CommonService);
    const compact = service.compact({a: 1, b: null, c: undefined, d: false});
    expect(compact).toEqual({a: 1, d: false});
  });

  it('removeNil should return an array without nil values', () => {
    const service: CommonService = TestBed.get(CommonService);
    const result = service.removeNil([0, null, 4, undefined, false]);
    expect(result).toEqual([0, 4, false]);
  });
});
