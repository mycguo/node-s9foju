import {TestBed} from '@angular/core/testing';

import {FilterExpressionsService} from './filter-expressions.service';
import {FilterExpression} from '../page-filter/filter-expression.model';
import LaFilterSupportEnums from '../../../../../project_typings/enums/laFilterSupportEnums';

describe('FilterExpressionsService', () => {
  let service: FilterExpressionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterExpressionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not add duplicate filters', () => {
    const list1: Array<FilterExpression> = [
      { key: LaFilterSupportEnums.SITE, values: ['Site 1'] }
    ];
    const list2: Array<FilterExpression> = [
      { key: LaFilterSupportEnums.SITE, values: ['Site 1', 'Site 2'] }
    ];
    const combinedFilters = service.combineFilterExpressions(list1, list2);
    const filterValueArray = combinedFilters[0].values;
    expect(filterValueArray.length).toBe(2);
    expect(filterValueArray.indexOf('Site 1')).toBeGreaterThan(-1);
    expect(filterValueArray.indexOf('Site 2')).toBeGreaterThan(-1);
  });
});
