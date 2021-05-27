import {TestBed} from '@angular/core/testing';

import {PageInterlinkService} from './page-interlink.service';
import {FilterExpression} from '../page-filter/filter-expression.model';
import LaFilterSupportEnums from '../../../../../project_typings/enums/laFilterSupportEnums';

describe('PageInterlinkService', () => {
  let service: PageInterlinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageInterlinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a valid link for filter expression', () => {
    const filterExpressions = <Array<FilterExpression>> [
      {key: LaFilterSupportEnums.SITE, values: ['siteId_1']}
    ];
    const href = service.createHref('page-url', filterExpressions);
    expect(href).toBe('/page-url?site=siteId_1');
  });

  it ('should create a valid link for multiple filter expression', () => {
    const filterExpressions = <Array<FilterExpression>> [
      {key: LaFilterSupportEnums.SITE, values: ['siteId_1', 'siteId_2']},
      {key: LaFilterSupportEnums.DEVICE, values: ['deviceId_1']}
    ];
    const href = service.createHref('page-url', filterExpressions);
    expect(href).toBe('/page-url?site=siteId_1&site=siteId_2&device=deviceId_1');
  });
});
