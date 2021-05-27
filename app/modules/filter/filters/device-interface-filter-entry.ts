import { FilterEntry } from '../interfaces/filter-entry';
import { FilterColumn } from '../interfaces/filter-column';
import LaFilterSupportEnums from '../../../../../../project_typings/enums/laFilterSupportEnums';
import { Observable, of } from 'rxjs';
import { FilterEntity } from '../interfaces/filter-entity';
import { FilterVariables } from '../constants/filter-variables';
import { map, take } from 'rxjs/operators';
import { FlexFilterService } from '../../../services/flex-filter/flex-filter.service';
import { DeviceInterfaceFilter } from '../interfaces/device-interface-filter';
import { FilterColumnValues } from '../interfaces/filter-column-values';

export class DeviceInterfaceFilterEntry implements FilterEntry {

  private readonly whitespaceRegex = new RegExp(' ', 'g');

  constructor(
    private flexFilterService: FlexFilterService
    ) {
  }

  buildFilter(): FilterColumn {
    return {
      id: LaFilterSupportEnums.DEVICE_INTERFACE_GROUP,
      name: 'Interface',
      hint: 'Enter Device and Interface names, separated by "&"',
      fetchFn: (entity: FilterEntity, searchString: string): Observable<FilterEntity[]> => {
        const searchArr = searchString?.split(FilterVariables.CHARACTER_AND);
        const [hintString, complimentaryHintString] = [(searchArr || []).shift(), (searchArr || [])
          .join(FilterVariables.CHARACTER_AND)];
        const searchQuery = {
          ['hint']: (hintString || '').replace(this.whitespaceRegex, ''),
          ['complimentaryHint']: (complimentaryHintString || '').replace(this.whitespaceRegex, ''),
        };

        return this.flexFilterService.getAutocompleteFieldValues(
          LaFilterSupportEnums.DEVICE_INTERFACE_GROUP,
          searchQuery,
          FilterVariables.DEFAULT_FILTER_LIMIT
        )
          .pipe(
            take(1),
            // map http response to FilterEntity model
            map((response: {matchingResults: DeviceInterfaceFilter[]}): FilterColumnValues[] => {
              if (response.matchingResults === void 0) {
                return [];
              }
              return response.matchingResults.map(item => (
                {
                  id: item.device.deviceSystemName,
                  name: item.device.deviceSystemName,
                  children: item.interfaces.map(deviceInterface => (
                    {
                      id: this.createId(item.device.deviceSystemName, deviceInterface),
                      name: deviceInterface,
                      displayName: `${item.device.deviceSystemName}${FilterVariables.COMPOUND_FILTER_ARROW}${deviceInterface}`
                    }
                    ))
                }));
            }),
            // filter out already added entities (look FilterService.filterSelectedOptions)
            map((entities: FilterEntity[]): FilterEntity[] => {
              const selectedOptions = entity && entity.children !== void 0 ? entity.children : [];

              return entities.reduce((acc, deviceEntity) => {
                const filteredChildren = deviceEntity.children.filter(child =>
                  selectedOptions.findIndex(opt => opt.id === child.id) === -1);
                if (filteredChildren.length > 0) {
                  acc.push({...deviceEntity, children: filteredChildren});
                }

                return acc;
              }, <FilterEntity[]>[]);
            })
          );
      },
      lookupFn: (values: string[]): Observable<FilterColumnValues[]> => {
        return of(values.map(value => {
          const [name, interfaceEntry] = value.split(FilterVariables.FILTER_SEPARATOR);
          return {
            id: value,
            name: value,
            displayName: `${name}${FilterVariables.COMPOUND_FILTER_ARROW}${interfaceEntry}`
          };
        }));
      },
      convertToFlexSearchString: (filter: string[]): string => {
        const searchStrings: Array<string> = [];
        filter?.forEach(filterValue => {
          const [deviceName, interfaceName] = filterValue.split(FilterVariables.FILTER_SEPARATOR);
            searchStrings.push(
              `(${LaFilterSupportEnums.DEVICE} = "${deviceName}" & ${LaFilterSupportEnums.INTERFACE} = "${interfaceName}")`
            );
        });
        return `(${searchStrings.join(` ${FilterVariables.CHARACTER_OR} `)})`;
      }
    };
  }

  public createId(selectedDevice: string, selectedInterface: string) {
    return `${selectedDevice}${FilterVariables.FILTER_SEPARATOR}${selectedInterface}`;
  }
}
