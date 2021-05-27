import {RegionType} from './region-type.enum';

export interface Region {
  id?: string;
  shortName: string;
  longName: string;
  type: RegionType;
  parent?: Region;
}
