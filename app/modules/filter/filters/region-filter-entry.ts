import { FilterEntry } from '../interfaces/filter-entry';
import { FilterColumn } from '../interfaces/filter-column';
import LaFilterSupportEnums from '../../../../../../project_typings/enums/laFilterSupportEnums';
import { Observable } from 'rxjs';
import { FilterEntity } from '../interfaces/filter-entity';
import { RegionService } from '../../../services/region/region.service';
import { FilterVariables } from '../constants/filter-variables';
import { map, take } from 'rxjs/operators';
import { Region } from '../../../services/region/region';
import { FilterService } from '../services/filter/filter.service';
import { CommonService } from '../../../utils/common/common.service';
import {FilterColumnValues} from '../interfaces/filter-column-values';

export class RegionFilterEntry implements FilterEntry {

  constructor(
    private filterService: FilterService,
    private regionService: RegionService,
    private commonService: CommonService
  ) {
  }

  buildFilter(): FilterColumn {
    return {
      id: LaFilterSupportEnums.REGION,
      name: 'Region',
      fetchFn: (entity: FilterEntity, searchString: string): Observable<FilterColumnValues[]> => {
        return this.regionService.getRegions(searchString, FilterVariables.DEFAULT_FILTER_LIMIT)
          .pipe(
            take(1),
            map((regions: Region[]) => {
              return regions.map(region => {
                return {
                  id: region.id,
                  name: this.getRegionPath(region)
                };
              });
            }),
            map(values => {
              return this.filterService.filterSelectedOptions(entity, values, searchString);
            })
          );
      },
      lookupFn: (values: string[]): Observable<FilterColumnValues[]> => {
        return this.regionService.getRegionsById(values)
          .pipe(
            map(regions => {
              return regions.map(region => {
                return {
                  id: region.id,
                  name: this.getRegionPath(region)
                };
              });
            })
          );
      }
    };
  }

  private getRegionPath(region: Region): string {
    if (this.commonService.isNil(region)) {
      return '';
    }

    if (this.commonService.isNil(region.parent)) {
      return region.longName;
    }
    return `${region.longName}, ${this.getRegionPath(region.parent)}`;
  }
}
