import { FilterEntry } from '../interfaces/filter-entry';
import { FilterColumn } from '../interfaces/filter-column';
import LaFilterSupportEnums from '../../../../../../project_typings/enums/laFilterSupportEnums';

export class TimeWindowFilterEntry implements FilterEntry {

  buildFilter(): FilterColumn {
    return {
      id: LaFilterSupportEnums.TIME_WINDOW,
      name: 'Time Window',
      values: [
        {id: 'enable', name: 'Business Hours Only'},
        {id: 'invert', name: 'Non-Business Hours Only'}
      ],
      disableMultipleTags: true,
    };
  }
}
