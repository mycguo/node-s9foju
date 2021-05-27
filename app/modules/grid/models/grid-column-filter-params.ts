import {IFloatingFilterParams} from 'ag-grid-community';
import {GridColumnFilterConfig} from './grid-column-filter-config';

export interface GridColumnFilterParams<T, R> extends IFloatingFilterParams, GridColumnFilterConfig<T, R> {
}
