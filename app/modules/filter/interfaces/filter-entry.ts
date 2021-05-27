import { FilterColumn } from './filter-column';

export interface FilterEntry {
  buildFilter: (preSelected?: string) => FilterColumn;
}
