import {Observable} from 'rxjs';
import {FlexFilterExpressionModel} from './flex-filter-expression.model';
import {InjectionToken} from '@angular/core';

export interface FlexFilterProvider {
  selectFlexSearchState(): Observable<Array<FlexFilterExpressionModel>>;

  getFlexSearchState(): Array<FlexFilterExpressionModel>;
}

export const FlexFilterProviderToken = new InjectionToken(
    'FlexFilterProviderToken');

