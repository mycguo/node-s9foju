import {InjectionToken} from '@angular/core';
import {EntityStore} from '@datorama/akita';
import {GridDataSource} from '../../models/grid-data-source';
import {GridStringFilterService} from './grid-string-filter.service';
import {ValueStringFilterService} from '../../../../utils/dataUtils/value-string-filter.service';

export const Grid_String_Filter = new InjectionToken<string>('grid string filter');

export function gridStringFilter<E>(flattenEntity: (entity: E) => {[key: string]: string}) {
  return ( store: GridDataSource, valueStringFilterUtil: ValueStringFilterService ) => {
    return new GridStringFilterService(
      store.getEntityQuery(),
      valueStringFilterUtil,
      flattenEntity
    );
  };
}

