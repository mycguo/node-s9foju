import { FilterEntry } from '../interfaces/filter-entry';
import { FilterColumn } from '../interfaces/filter-column';
import LaFilterSupportEnums from '../../../../../../project_typings/enums/laFilterSupportEnums';
import { FilterVariables } from '../constants/filter-variables';
import { Observable, of } from 'rxjs';
import { FilterColumnValues } from '../interfaces/filter-column-values';

export class InterfaceTypeFilterEntry implements FilterEntry {

  public static readonly interfaceTypeValues = [
    {id: LaFilterSupportEnums.WAN, name: 'WAN'},
    {id: LaFilterSupportEnums.XCON, name: 'XCon'}
  ];

  buildFilter(): FilterColumn {
    return {
      id: LaFilterSupportEnums.INTERFACE_TYPE,
      name: 'Interface Type',
      values: InterfaceTypeFilterEntry.interfaceTypeValues,
      lookupFn: (values: string[]): Observable<FilterColumnValues[]> => {
        return of(values.map(value => {
          const interfaceType = InterfaceTypeFilterEntry.interfaceTypeValues.find(ifType =>
            ifType.id === value.toLowerCase()) || {id: value, name: value};
          return {
            id: interfaceType.id,
            name: interfaceType.name
          };
        }));
      },
      convertToFlexSearchString: (filter: string[]): string => {
        const flexString = filter?.join(` ${FilterVariables.CHARACTER_OR} `);
        if (filter.length > 1) {
          return `(${flexString})`;
        }
        return flexString;
      }
    };
  }
}
