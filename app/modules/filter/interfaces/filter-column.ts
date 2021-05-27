import { Observable } from 'rxjs';
import LaFilterSupportEnums from '../../../../../../project_typings/enums/laFilterSupportEnums';
import { FilterEntity } from './filter-entity';
import { FilterColumnValues } from './filter-column-values';
import { ValidatorFn } from '@angular/forms';
import { FilterOperators } from '../constants/filter-operators';

export interface FilterColumn {
  id: LaFilterSupportEnums;
  name: string;
  hint?: string;
  values?: FilterColumnValues[];
  allowAddNewTag?: boolean; // add non-autocomplete entries
  validatorFn?: ValidatorFn | null;
  validatorMessage?: string; // validation message
  disableFetch?: boolean; // disable fetch function
  singleValue?: boolean; // set true for filters without child values e.g. WAN
  fetchFn?: (entity: FilterEntity, searchString: string, limit?: number) => Observable<FilterColumnValues[]>;
  lookupFn?: (values: string[]) => Observable<FilterColumnValues[]>;
  convertToFlexSearchString?: (value: string[]) => string;
  disableMultipleTags?: boolean; // allow adding only one tag (e.g. flex string)
  disableCache?: boolean;
  chipColor?: string;
  groupColor?: string;
  operatorOptions?: FilterOperators[];
}
