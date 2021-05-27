import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { FilterFixtures } from './filter.fixtures';
import { delay, map } from 'rxjs/operators';

@Injectable()
  // @ts-ignore
export class MockFlexFilterService {
  getFieldValues(field: string, searchString: string = '', limit?: number) {
    return of(FilterFixtures.filterTags[field]).pipe(
      delay(500),
      map((value) => {
        let values;
        if (searchString !== null) {
          values = value?.filter((val) =>
            val.toLowerCase().includes(searchString.toLowerCase())
          );
        } else {
          values = value;
        }

        return { values: values?.slice(0, limit) };
      })
    );
  }

  getAutocompleteFieldValues(
    field: string,
    searchString: any = {},
    limit?: number
  ) {
    return of(FilterFixtures.filterTags[field]).pipe(
      delay(500),
      map((value) => {
        if (searchString.hint) {
          return {
            matchingResults: value.filter((val) =>
              val.device.deviceSystemName
                .toLowerCase()
                .includes(searchString.hint.toLowerCase())
            ),
          };
        }
        return { matchingResults: value };
      })
    );
  }
}
