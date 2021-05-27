import {Observable} from 'rxjs';

/***
 * A column filter component should implement this interface to support grid column filtering.
 * T Change type after a filter change is made.
 * R Parameter model used to configure the column filter component.
 */
export interface GridColumnFilter<T, R> {
  filterChanged$: Observable<T>;
  onFilterInit: (columnFilterParams: R) => void;
}
