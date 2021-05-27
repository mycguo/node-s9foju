import { FilterEntry } from '../interfaces/filter-entry';
import { FilterColumn } from '../interfaces/filter-column';
import LaFilterSupportEnums from '../../../../../../project_typings/enums/laFilterSupportEnums';
import { FilterService } from '../services/filter/filter.service';
import { FilterOperators } from '../constants/filter-operators';

export class SlaClassFilterEntry implements FilterEntry {

  constructor(
    private filterService: FilterService,
  ) {
  }

  buildFilter(): FilterColumn {
    return {
      id: LaFilterSupportEnums.SLA_CLASS,
      name: 'SLA Class',
      allowAddNewTag: true,
      lookupFn: this.filterService.operatorLookupFn,
      convertToFlexSearchString: this.filterService.operatorConvertToFlexString,
      operatorOptions: [
        FilterOperators.EQUALS,
        FilterOperators.NOT_EQUALS
      ]
    };
  }
}
