import { Injectable } from '@angular/core';
import {FilterExpression} from '../page-filter/filter-expression.model';
import {QueryParams} from './query-params';
import {Filter} from 'ag-grid-community/dist/lib/interfaces/iFilter';

@Injectable({
  providedIn: 'root'
})
export class PageInterlinkService {

  constructor() { }

  /***
   * Generates string url for page with filter expression parameters
   * @param toPage Url of page being navigated to.
   * @param filterExpressions Array of filter expressions to append as query params.
   * @param queryParams Additional query params
   */
  createHref(toPage: string, filterExpressions: Array<FilterExpression>, queryParams?: Array<QueryParams>): string {
    // remove preceding slash if it exists.
    const updatedToPage = toPage.match(/^\//) ? toPage.substring(1) : toPage;
    let href = `/${updatedToPage}`;
    const compositeQueryParams: Array<FilterExpression | QueryParams> = [];
    if (filterExpressions != null && filterExpressions.length > 0) {
      compositeQueryParams.push(...filterExpressions);
    }
    if (queryParams != null && queryParams.length > 0) {
      compositeQueryParams.push(...queryParams);
    }
    if (compositeQueryParams?.length > 0) {
      href += '?';
      href += this.buildFilterQueryParams(compositeQueryParams);
    }
    return href;
  }

  private buildFilterQueryParams(filterExpressions: Array<FilterExpression | QueryParams>): string {
    let queryParamString = '';
    for (let iExpression = 0; iExpression < filterExpressions.length; iExpression++) {
      const expression = filterExpressions[iExpression];
      for (let iValue = 0; iValue < expression.values.length; iValue++) {
        const value = encodeURIComponent(expression.values[iValue]);
        queryParamString += `${expression.key}=${value}`;
        if (iValue < expression.values.length - 1) {
          queryParamString += '&';
        }
      }
      if (iExpression < filterExpressions.length - 1) {
        queryParamString += '&';
      }
    }
    return queryParamString;
  }
}
