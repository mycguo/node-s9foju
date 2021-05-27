import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Self,
  ViewChild
} from '@angular/core';
import { FormField } from '../../../shared/components/form/form-field/form-field';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTooltip } from '@angular/material/tooltip';
import { merge, Observable, of, Subject, timer } from 'rxjs';
import { debounce, filter, finalize, first, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import LaFilterSupportEnums from '../../../../../../../project_typings/enums/laFilterSupportEnums';
import { CommonService } from '../../../../utils/common/common.service';
import { FilterService } from '../../services/filter/filter.service';
import { FlexFilterService } from '../../../../services/flex-filter/flex-filter.service';
import { FilterCacheService } from '../../services/filter-cache/filter-cache.service';
import { FilterEntity } from '../../interfaces/filter-entity';
import { FilterColumn } from '../../interfaces/filter-column';
import { FilterOptionsValue } from '../../interfaces/filter-options-value';
import { FilterColumnValues } from '../../interfaces/filter-column-values';
import { FilterVariables } from '../../constants/filter-variables';
import { ChipColors } from '../../constants/chip-colors';
import { FilterValue } from '../../interfaces/filter-value';
import { SelectOption } from '../../../shared/components/form/select/models/select-option';
import { FilterOperators } from '../../constants/filter-operators';

@UntilDestroy()
@Component({
  selector: 'nx-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.less'],
  host: {'[class.nx-filter-input]': 'true'}
})
export class FilterInputComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() displayModel: FormField;
  @Input() filterOptions: LaFilterSupportEnums[];
  /**
   * Provides additional parameters to filterOptions which can be passed to filter entity
   * e.g., in PreSelectedDeviceInterfaceFilterEntry search term passed to filter autocomplete list
   */
  @Input() filterOptionsValue: FilterOptionsValue;
  @Input() validateOnInit = false; // if validation should be run when pristine

  @ViewChild('tagsInput') private tagsInputRef: ElementRef<HTMLInputElement>;
  @ViewChild('tagsInputChild') private tagsInputChildRef: ElementRef<HTMLInputElement>;
  @ViewChild('tooltip') private matTooltipRef: MatTooltip;
  @ViewChild(MatAutocompleteTrigger) private autocomplete: MatAutocompleteTrigger;

  readonly DEFAULT_FILTER_LIMIT = FilterVariables.DEFAULT_FILTER_LIMIT;
  readonly SWITCH_TO_DROPDOWN_LENGTH = FilterVariables.SWITCH_TO_DROPDOWN_LENGTH;

  items: FilterEntity[];
  selectedColumn: FilterColumn;
  tagsInputCtrl: FormControl;
  tagsInputChildCtrl: FormControl;
  filteredTags$: Observable<FilterColumnValues[]>;
  tagValidationError: string;
  isFilterLoading = false;
  searchString: string;
  hideChildInput: boolean;
  hasFlexSearchTag: boolean;
  operatorSelectModel: FormField = {};

  private readonly cancelPendingRequests: Subject<void>;
  private columns: FilterColumn[];
  private _onTouched: () => void;
  private _onChange: (filterValues: FilterValue) => void = () => void 0;

  @HostListener('keydown.tab') onKeydownTabHandler() {
    // delay clearing unfinished tags to allow add item on blur and get focus to main tag input
    setTimeout(() => {
      this.deselectAllTags();
      this.mainInputFocus();
    });
  }

  @HostListener('keydown.delete', ['$event.target'])
  @HostListener('keydown.backspace', ['$event.target']) onKeydownBsHandler(target: Element) {
    // reset tag validation error if user changes input
    if ((target.className as string).indexOf('nx-filter-tag-group__input')) {
      this.tagValidationError = null;
    }
    // call removeTag if focus within a tag
    if ((target.className as string).indexOf('js-filter-tag') > -1) {
      this.removeTag();
    }
  }

  @HostListener('document:click', ['$event']) onDocumentClickHandler(event: MouseEvent) {
    if (!event.isTrusted) {
      event.stopPropagation();
      return;
    }

    // if clicked outside of the filter component or Apply button clicked clean up all unfinished tags
    if (
      (<HTMLElement>event.target).closest('nx-filter-input') === null &&
      (<HTMLElement>event.target).closest('.js-filter-autocomplete-panel') === null &&
      (<HTMLElement>event.target).closest('.ng-dropdown-panel') === null
    ) {
      this.deselectAllTags();
    }
  }

  constructor(
    @Self() private controlDir: NgControl,
    private cd: ChangeDetectorRef,
    private commonService: CommonService,
    private filterService: FilterService,
    private flexFilterService: FlexFilterService,
    private filterCacheService: FilterCacheService,
  ) {
    controlDir.valueAccessor = this;
    this.tagsInputCtrl = new FormControl();
    this.tagsInputChildCtrl = new FormControl();
    this.displayModel = {};
    this.items = [];
    this.cancelPendingRequests = new Subject<void>();
  }

  ngOnInit(): void {
    this.setupColumns();
    this.initFilterSuggestions();
    // set validator for filter
    this.control.setValidators(
      Validators.compose([
        this.control.validator,
        this.filterService.searchLimitValidator(FilterVariables.FILTER_COMPLEXITY_LIMIT, FilterVariables.FILTER_COMPLEXITY_LIMIT_MESSAGE)
      ])
    );
  }

  ngOnDestroy() {
    this.items = [];
    this.selectedColumn = void 0;
    this.columns = [];
    this.cancelPendingRequests.complete();
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  /**
   * writeValue gets called before ngOnInit
   * to workaround this setTimeout is used
   * https://github.com/angular/angular/issues/29218
   */
  writeValue(obj: FilterValue): void {
    if (obj != null) {
      setTimeout(() => {
        this.updateFilters(obj);
      });
    }
  }

  get control(): AbstractControl {
    return this.controlDir?.control;
  }

  displayFn(entity: FilterColumnValues): string {
    return entity?.name ? entity.name : void 0;
  }

  /**
   * @description executed on tag click event
   * clears any previous validation errors
   * set selected column for clicked tag
   */
  tagSelected(entity: FilterEntity): void {
    const selectedColumn = this.getColumnById(entity.id);
    if (this.selectedColumn !== selectedColumn) {
      this.removeEmptyColumns();
      this.selectedColumn = selectedColumn;
      this.setActiveControl();
    }
  }

  /**
   * @description executed on selecting item from autocomplete list
   */
  optionSelected(event: MatAutocompleteSelectedEvent): void {
    const filterValue: FilterColumnValues = {
      id: event.option.value.id,
      name: event.option.value.name,
      displayName: event.option.value.displayName
    };

    if (this.selectedColumn !== void 0) {
      this.addChildEntity(filterValue);
    } else {
      this.selectedColumn = this.getColumnById(filterValue.id);
      const entity: FilterEntity = {
        id: this.selectedColumn.id,
        name: this.selectedColumn.name,
        disableMultipleTags: this.selectedColumn.disableMultipleTags,
        chipColor: this.selectedColumn.chipColor,
        groupColor: this.selectedColumn.groupColor
      };
      if (this.selectedColumn.operatorOptions) {
        entity.selectedOperator = FilterOperators.EQUALS;
        entity.operatorOptions = this.selectedColumn.operatorOptions.map(option => new SelectOption(option, option));
      }
      if (this.selectedColumn.singleValue) {
        Object.assign(entity, {singleValue: true});
        this.selectedColumn = void 0;
        this.tagsInputCtrl.setValue(null);
      }
      // clear main input on select option
      this.tagsInputRef.nativeElement.value = '';
      this.items.push(entity);
    }

    this.emitFilterChanged();

    this.setActiveControl();
  }

  /**
   * @description add child entity for non-autocomplete filters
   * event fired on enter tag or childCtrlInput blur event
   */
  addTag(event: MatChipInputEvent) {
    const value = event.value?.trim();
    if (this.selectedColumn?.allowAddNewTag && value !== '') {
      if (this.tagsInputChildCtrl.errors !== null) {
        this.tagValidationError = this.selectedColumn.validatorMessage || FilterVariables.DEFAULT_VALIDATION_MESSAGE;

        // trigger change detection to display tooltip
        this.cd.detectChanges();
        this.matTooltipRef?.show();

        return;
      }
      this.tagValidationError = null;

      // check if adding value already exists or if tag can have only one entry, do nothing
      const children = this.getSelectedItem().children;
      if (
        children?.findIndex(item => item.name.toLowerCase() === value.toLowerCase()) > -1 ||
        (children?.length > 0 && this.selectedColumn.disableMultipleTags)
      ) {
        return;
      }

      this.addChildEntity({id: value, name: value});
      this.tagsInputChildCtrl.setValue(null);
      this.emitFilterChanged();

      // reset current column after adding flexString value to prevent the input field from being displayed
      if (this.selectedColumn.id === LaFilterSupportEnums.FLEX_STRING) {
        this.selectedColumn = void 0;
        this.hasFlexSearchTag = true;
      }
    }
  }

  /**
   * @description removes tag on backspace keypress event or on click on delete button
   */
  removeTag(entityId?: LaFilterSupportEnums, childEntityId?: string): void {
    // if entity is undefined then this function called from keypress event
    // if selectedColumn is defined then we need to delete last child entity from tag
    // if selectedColumn is undefined then we need to delete last tag in list
    const selectedId: LaFilterSupportEnums = entityId !== void 0 ?
      entityId :
      this.selectedColumn !== void 0 ?
        this.selectedColumn.id :
        void 0;
    let index;
    if (selectedId !== void 0) {
      index = this.items.findIndex(item => item.id === selectedId);
      if (index >= 0 && entityId === void 0) {
        const itemChildren = this.items[index].children;
        childEntityId = itemChildren !== void 0 ? itemChildren[itemChildren.length - 1]?.id : void 0;
      }
    } else {
      index = this.items.length - 1;
    }

    if (index >= 0) {
      const itemChildren = this.items[index].children;
      if (childEntityId !== void 0 && itemChildren !== void 0) {
        const childIndex = itemChildren.findIndex(item => item.id === childEntityId);
        if (childIndex >= 0) {
          itemChildren.splice(childIndex, 1);
          this.selectedColumn = this.getColumnById(selectedId);

          // prevent open suggestions list if item deleted from dropdown list
          if (itemChildren.length <= FilterVariables.SWITCH_TO_DROPDOWN_LENGTH) {
            this.hideChildInput = false;
            // force change detection to display childCtrl and then set focus on it
            setTimeout(() => {
              this.tagsInputChildRef?.nativeElement.focus();
              this.tagsInputChildCtrl.setValue(null);
              this.tagValidationError = null;
              this.matTooltipRef?.hide();
            });
          }

        }
      } else {
        this.items.splice(index, 1);
        this.selectedColumn = void 0;
        this.hasFlexSearchTag = false;
        this.tagsInputRef.nativeElement.focus();
        this.tagsInputCtrl.setValue(null);
      }

      this.emitFilterChanged();
    }
  }

  operatorChange(entity: FilterEntity, operator: string): void {
    entity.selectedOperator = operator;
    this.emitFilterChanged();
  }

  public mainInputFocus() {
    this.removeEmptyColumns();
    this.selectedColumn = void 0;
    this.tagsInputCtrl.setValue(null);

    this.setActiveControl();
  }

  private setActiveControl() {
    this.tagValidationError = null;
    if (this.selectedColumn !== void 0) {
      const selectedItem = this.getSelectedItem();

      /** hide subtag input if:
       * column single value (without inner tags) or
       * disabled to add multiple tags and tag already added or
       * column has predefined values and all of them already added
       */
      this.hideChildInput =
        this.selectedColumn.singleValue ||
        this.selectedColumn.disableMultipleTags &&
        selectedItem.children?.length > 0 &&
        this.selectedColumn.id !== LaFilterSupportEnums.FLEX_STRING ||
        (this.selectedColumn.values !== void 0 && this.selectedColumn.values.length === selectedItem.children?.length);


      this.cd.detectChanges();
      this.tagsInputChildRef?.nativeElement.focus();

      // allow to edit selected value for flexString filter
      if (this.selectedColumn.id === LaFilterSupportEnums.FLEX_STRING) {

        if (selectedItem.children?.length > 0) {
          this.tagsInputChildCtrl.setValue(selectedItem.children[0]);
          selectedItem.children = [];
        }
      } else {
        this.tagsInputChildCtrl.setValue(null);
      }

      this.tagsInputChildCtrl.clearValidators();
    }
    // close autocomplete panel for non-autocomplete tags
    if (this.selectedColumn?.disableFetch) {
      this.tagsInputChildCtrl.setValidators(this.selectedColumn.validatorFn);
      this.autocomplete.closePanel();
      return;
    }
  }

  /**
   * @description add child entity to selected tag
   */
  private addChildEntity(entity: FilterColumnValues) {
    const currItem = this.getSelectedItem();
    if (currItem === void 0) {
      return;
    }
    if (currItem.children === void 0) {
      currItem.children = [];
    }
    currItem.children.push(entity);
  }

  /**
   * @description remove all empty/unfinished filters
   */
  private removeEmptyColumns(): void {
    const reducedItems = this.items.reduce((acc, item) => {
      if ((item.children && item.children.length > 0) || item.singleValue) {
        acc.push(item);
      }
      return acc;
    }, <FilterEntity[]>[]);

    // mark control as dirty and emit value if any unfinished column removed and control value changed
    if (!this.commonService.isEqual(reducedItems, this.items)) {
      this.hasFlexSearchTag = reducedItems.some(item => item.id === LaFilterSupportEnums.FLEX_STRING);
      this.items = reducedItems;
      this.emitFilterChanged();
    }
  }

  private deselectAllTags(): void {
    this.removeEmptyColumns();
    this.selectedColumn = void 0;
    this.cancelPendingRequests.next();
    this.tagsInputRef.nativeElement.value = '';
    this.tagValidationError = null;
  }

  /**
   * @description emit valid filter value on change filter state
   */
  private emitFilterChanged(): void {
    this.control.markAsDirty();
    this._onChange(this.filterService.buildFilterValueFromFilterEntity(this.items));
  }

  private setupColumns(): void {
    this.filterCacheService.clearCache();

    if (this.filterOptions == null) {
      // All filters enabled by default
      this.filterOptions = Object.values(LaFilterSupportEnums).map((value: LaFilterSupportEnums) => value);
    }
    let colorIndex = 0;
    this.columns = this.filterOptions.reduce((acc, val) => {
      const entry: FilterColumn = this.filterService.createFilterColumn(val, this.filterOptionsValue);
      if (entry === void 0) {
        return acc;
      }
      // get color for chips and chips background
      const color = ChipColors[colorIndex] ?? ChipColors[0];
      entry.chipColor = color.chip;
      entry.groupColor = color.group;
      colorIndex++;

      if (entry.disableFetch || entry.values !== void 0) {
        acc.push(entry);
        return acc;
      }

      acc.push({...entry, fetchFn: entry.fetchFn?.bind(this) || this.getFlexFilterOptions.bind(this)});
      return acc;
    }, <FilterColumn[]>[]);
  }

  private initFilterSuggestions(): void {
    this.filteredTags$ = merge(this.tagsInputCtrl.valueChanges, this.tagsInputChildCtrl.valueChanges)
      .pipe(
        untilDestroyed(this),
        filter(searchString => typeof searchString === 'string' || searchString === null),
        debounce(searchString => typeof searchString === 'string' ? timer(250) : timer()),
        switchMap((searchString: string): Observable<FilterColumnValues[]> => {

          searchString = searchString !== null ? searchString.trim() : searchString;
          this.searchString = searchString;

          // don't display suggestion list if flexString tag selected
          if (this.hasFlexSearchTag) {
            return of(null);
          }

          if (this.selectedColumn === void 0) {
            return this.getColumns(searchString);
          }

          const currItem = this.getSelectedItem();
          if (
            this.selectedColumn.disableFetch ||
            this.selectedColumn.singleValue ||
            (currItem?.children?.length > 0 && this.selectedColumn.disableMultipleTags) // only one tag allowed, return null if value added
          ) {
            return of(null);
          }
          if (this.selectedColumn.values !== void 0) {
            return of(this.filterService.filterSelectedOptions(currItem, this.selectedColumn.values, searchString))
              .pipe(
                finalize(() => {
                  this.autocomplete.openPanel();
                })
              );
          }

          this.isFilterLoading = true;
          return this.selectedColumn.fetchFn(currItem, searchString).pipe(
            takeUntil(this.cancelPendingRequests),
            map(items => items?.slice(0, FilterVariables.DEFAULT_FILTER_LIMIT)),
            finalize(() => {
              this.isFilterLoading = false;
              this.autocomplete.openPanel();
            })
          );
        })
      );
  }

  private async updateFilters(filters: FilterValue): Promise<void> {
    if (filters !== void 0 && this.columns !== void 0) {
      // reduce pre-selected filters over currently selected filter columns
      const items: FilterEntity[] = [];
      for (const column of this.columns) {
        if (filters[column.id]) {
          const filterValue = filters[column.id];
          let children: FilterColumnValues[] = column.lookupFn === void 0 ?
            filterValue.map(item => ({
              id: item,
              name: item
            })) :
            await column.lookupFn(filterValue).pipe(first()).toPromise();

          // remove duplicated entries by id
          children = [...new Map(children.map(item => [item.id, item])).values()];

          const entity: FilterEntity = {
            id: column.id,
            name: column.name,
            ...!column.singleValue && { // singleValue item doesn't have child values
              children
            },
            ...column.singleValue && {singleValue: true},
            ...column.disableMultipleTags && {disableMultipleTags: true},
            chipColor: column.chipColor,
            groupColor: column.groupColor
          };

          if (column.operatorOptions) {
            entity.operatorOptions = column.operatorOptions.map(option => new SelectOption(option, option));
            entity.selectedOperator = children[0]?.id.match(FilterVariables.FILTER_OPERATOR_REGEXP)?.[0];
          }

          items.push(entity);
        }
      }
      this.hasFlexSearchTag = items.length > 0 && !items.some(item => item.id !== LaFilterSupportEnums.FLEX_STRING);
      this.items = items;
    }
  }

  private getColumns(searchString: string): Observable<FilterColumnValues[]> {
    this.autocomplete.closePanel();
    return of(this.columns).pipe(
      take(1),
      map(columns => {
        return this.filterService.filterSelectedColumns(this.items, columns, searchString);
      }),
      finalize(() => {
        this.autocomplete.openPanel();
      })
    );
  }

  /**
   * Get flex filter values for the selected column from flex filter service
   */
  private getFlexFilterOptions(entity: FilterEntity, searchString: string): Observable<FilterColumnValues[]> {
    const cache = this.filterCacheService.getFromCache(this.selectedColumn.id, searchString);
    if (cache !== void 0 && !this.selectedColumn.disableCache) {
      return of(cache).pipe(
        take(1),
        map(items => this.filterService.filterSelectedOptions(entity, items, searchString)),
      );
    }

    return this.flexFilterService
      .getFieldValues(this.selectedColumn.id, searchString, FilterVariables.DEFAULT_FILTER_LIMIT * 2) // get twice number of entries
      .pipe(
        take(1),
        takeUntil(this.cancelPendingRequests), // cancel pending request
        map((response: {values: string[]}) => {
          if (response.values === void 0) {
            return [];
          }
          const values: FilterColumnValues[] = response.values.map(item => ({id: item, name: item}));
          if (!this.selectedColumn.disableCache) {
            this.filterCacheService.putToCache(this.selectedColumn.id, values, searchString);
          }
          return values;
        }),
        map(items => this.filterService.filterSelectedOptions(entity, items, searchString))
      );
  }

  /**
   * Get current selected entity
   */
  private getSelectedItem(): FilterEntity {
    if (this.items === void 0 || this.selectedColumn === void 0) {
      return;
    }
    return this.items.find(item => item.id === this.selectedColumn.id);
  }

  /**
   * Get filter column by id
   */
  private getColumnById(id: LaFilterSupportEnums | string): FilterColumn {
    return this.columns.find(column => column.id === id);
  }

}
