import {Type} from '@angular/core';
import {Observable} from 'rxjs';

/***
 * Any Config specific to a filter should implement this interface.
 * T is the result type of the filter event.
 * R is the filter parameter type.
 */
export interface GridColumnFilterConfig<T, R> {
  field: string;
  componentType: Type<any>;
  componentParams: R;
  /**
   * Observable broadcasting changes to the filter params.
   */
  onChange?: Observable<R>;
  /** Note: this will be initialized through the grid and does not need
   * to be implemented in the column filter definition. **/
  subscribeToFilterEvents?: (eventSubject: Observable<T>) => void;
}
