import { TestBed } from '@angular/core/testing';

import { ValueStringFilterService } from './value-string-filter.service';

describe('ValueStringFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValueStringFilterService = TestBed.get(ValueStringFilterService);
    expect(service).toBeTruthy();
  });

  it('should return true if an object contains a string in its values', () => {
    const service: ValueStringFilterService = TestBed.get(ValueStringFilterService);
    const testObj = {a: 'findme', b: 'another'};
    const result = service.doesEntityContainStringParts(testObj, 'findme');
    expect(result).toBeTruthy();
  });

  it('should return false if an object doesn\'t contain a give string as one of its values',() => {
    const service: ValueStringFilterService = TestBed.get(ValueStringFilterService);
    const testObj = {a: 'findme', b: 'another'};
    const result = service.doesEntityContainStringParts(testObj, 'notfind');
    expect(result).toBeFalsy();
  });

  it('should not throw an exception if one of the test values is an object', () => {
    const service: ValueStringFilterService = TestBed.get(ValueStringFilterService);
    const testObj = {a: 'findme', b: 'another', c: {}};
    const result = service.doesEntityContainStringParts(<any>testObj, 'findme');
    expect(result).toBeTruthy();
  });

  it('should return true if a word in the test string is contained in the object', () => {
    const service: ValueStringFilterService = TestBed.get(ValueStringFilterService);
    const testObj = {a: 'findme', b: 'another'};
    const result = service.doesEntityContainStringParts(<any>testObj, 'findme');
    expect(result).toBeTruthy();
  });

  it('should provide a filtered list of objects based on search string', () => {
    const service: ValueStringFilterService = TestBed.get(ValueStringFilterService);
    const testObjArray = [
      { a: 'findme', b: 'another' },
      { a: 'not it', b: 'another' }
  ];
    const result = service.filterEntitiesContainsStringParts(testObjArray, 'findme');
    expect(result.length).toBe(1);
  });

  it('should determine if entity should filter based on global string', () => {
    const service: ValueStringFilterService = TestBed.get(ValueStringFilterService);
    const entityToTest = {
      a: 'test this',
      b: 'this not important'
    };
    const globalFilter = 'important';
    const result = service.shouldFilterEntity(entityToTest, globalFilter);
    expect(result).toBeTruthy();
  });

  it('should determine if entity should filter based on field map', () => {
    const service: ValueStringFilterService = TestBed.get(ValueStringFilterService);
    const entityToTest = {
      a: 'test this',
      b: 'this not important'
    };
    const globalFilter = 'aaa';
    const fieldMap = {
      a: '',
      b: 'not'
    };
    const falseResult = service.shouldFilterEntity(entityToTest, globalFilter, fieldMap);
    expect(falseResult).toBeFalsy();
  });

  it('should be true for matching global and field maps', () => {
    const service: ValueStringFilterService = TestBed.get(ValueStringFilterService);
    const entityToTest = {
      a: 'test this',
      b: 'this not important'
    };
    const fieldMap = {
      a: '',
      b: 'not'
    };

    const trueGlobalFilter = 'important';
    const trueResult = service.shouldFilterEntity(entityToTest, trueGlobalFilter, fieldMap);
    expect(trueResult).toBeTruthy();
  });

});
