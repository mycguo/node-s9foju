import {GridFilterable} from './grid-filterable';
import {EntityState, EntityStore, QueryEntity} from '@datorama/akita';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {ValueStringFilterService} from '../../../../utils/dataUtils/value-string-filter.service';
import FilterChange from '../../components/filters/filter-change';
import {map, tap} from 'rxjs/operators';
import GridData from '../../models/grid-data.model';
import {GridColumnSort} from '../../models/grid-column-sort';


export class GridStringFilterService<T extends EntityState<any, any>> implements GridFilterable<string, FilterChange> {

  // filtered subject
  private filteredSubject = new BehaviorSubject<Array<T>>(null);
  private filteredSub: Subscription;

  private currentGlobalFilter = '';
  private currentFieldMap = {};

  private selectedEntities: {[key: string]: string};
  private cachedSelectedEntities: Array<string> = [];
  private readonly filteredObservable: Observable<Array<T>>;

  private selectedSubject = new BehaviorSubject<number>(0);

  constructor(
    private dataQuery: QueryEntity<T>,
    private valueStringFilterUtil: ValueStringFilterService,
    private flattenEntity: (entity: any) => {[key: string]: string},
    private sortMap: {[sortKey: string]: (sort: GridColumnSort) => void} = null
  ) {
    this.clearFilter();
    this.filteredObservable = this.filteredSubject
      .pipe(
        map((dataArray => {
          let selectedEntities = [];
          const currentlySelectedEntityMap = Object.assign({}, this.selectedEntities);
          if (dataArray && currentlySelectedEntityMap) {
            for (let i = 0; i < dataArray.length; i++) {
              const entity = dataArray[i];
              const selected = !!currentlySelectedEntityMap[entity.id];
              const updatedDevice = Object.assign({}, entity,
                { selected: selected });
              selectedEntities.push(updatedDevice);
              if (selected) {
                delete currentlySelectedEntityMap[entity.id];
              }
            }
            // cache the remaining selected devices to be selected on filter changes
            this.cachedSelectedEntities = Object.keys(currentlySelectedEntityMap);
          } else {
            selectedEntities = dataArray;
          }
          return new GridData(selectedEntities);
        }).bind(this))
      );
  }

  filtered$(): Observable<any> {
    return this.filteredObservable; // The filtered subject
  }

  selectedCount$(): Observable<number> {
    return this.selectedSubject.asObservable();
  }

  filterGrid(filter: string) {
    this.currentGlobalFilter = filter;
    if ((!filter || filter === '')
        && Object.keys(this.currentFieldMap).length === 0) {
      this.clearFilter();
      return;
    }
    if (this.filteredSub) {
      this.filteredSub.unsubscribe();
    }
    this.filteredSub = this.dataQuery.selectAll({
      filterBy: entity => {
        const flatEntity = this.flattenEntity(entity);
        return this.valueStringFilterUtil.shouldFilterEntity(flatEntity,
          filter, this.currentFieldMap);
      }
    }).subscribe(entities => {
      this.filteredSubject.next(entities);
    });
  }

  clearFilter(): void {
    if (this.filteredSub) {
      this.filteredSub.unsubscribe();
    }
    this.filteredSub = this.dataQuery.selectAll()
      .subscribe(entities => {
        this.filteredSubject.next(entities);
      });
  }

  columnFilterGrid(filters: Array<FilterChange>) {
    // generate map from array
    const fieldMap = {};
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      if (filter.field && filter.term) {
        fieldMap[filter.field] = filter.term;
      }
    }
    this.currentFieldMap = fieldMap;
    if ((!this.currentGlobalFilter || this.currentGlobalFilter === '')
        && Object.keys(this.currentFieldMap).length === 0) {
      this.clearFilter();
      return;
    }
    // update filteredSub to filter by the field map
    if (this.filteredSub) {
      this.filteredSub.unsubscribe();
    }
    this.filteredSub = this.dataQuery.selectAll({
      filterBy: entity => {
        const flatEntity = this.flattenEntity(entity);
        return this.valueStringFilterUtil.shouldFilterEntity(flatEntity,
          this.currentGlobalFilter, fieldMap);
      }
    }).subscribe(entities => {
      this.filteredSubject.next(entities);
    });
  }

  setSelectedEntities(selectedIds: Array<string>) {
    const selectedEntityMap = {};
    const allSelected = [ ...selectedIds, ...this.cachedSelectedEntities ];
    this.selectedSubject.next(allSelected.length);
    for (let i = 0; i < allSelected.length; i++) {
      const selectedId = allSelected[i];
      selectedEntityMap[selectedId] = selectedId;
    }
    this.selectedEntities = selectedEntityMap;
  }

  getSelectedEntities(): Array<string> {
    return Object.keys(this.selectedEntities);
  }

  setColumnSort(columnSort: GridColumnSort) {
    if (this.filteredSub) {
      this.filteredSub.unsubscribe();
    }
    const sortBy = columnSort?.customSortFn ? columnSort.customSortFn : this.defaultSortMethod;
    this.filteredSub = this.dataQuery.selectAll({
      filterBy: entity => {
        const flatEntity = this.flattenEntity(entity);
        return this.valueStringFilterUtil.shouldFilterEntity(flatEntity,
          this.currentGlobalFilter, this.currentFieldMap);
      },
      sortBy: columnSort ? sortBy.bind(this, columnSort.colId, columnSort.sort === 'desc') : void 0
    }).subscribe(entities => {
      this.filteredSubject.next(entities);
    });
  }

  /**
   * Drop null values into bottom of the table
   * desc is a flag which indicate descending order of sorting
   */
  defaultSortMethod(colId: string, desc: boolean, valA: any, valB: any): number {
    let a = valA[colId];
    let b = valB[colId];
    if ( a === null ) {
      return desc ? -1 : 1;
    }
    if ( b === null ) {
      return desc ? 1 : -1;
    }

    if (!a && typeof a !== 'number') { return 1; }
    if (!b && typeof b !== 'number') { return -1; }

    const compare =  desc ? b - a : a - b;

    if (isNaN(compare)) {
      a = a.toString().toLowerCase();
      b = b.toString().toLowerCase();
      return a < b ? (desc ? 1 : -1) : (a > b ? (desc ? -1 : 1) : 0);
    } else {
      return compare;
    }
  }
}
