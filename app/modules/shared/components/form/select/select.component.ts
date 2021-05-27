import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
  OnInit,
  Self,
  TemplateRef,
  ViewChild,
  ViewEncapsulation, OnChanges, SimpleChanges, HostBinding,
  AfterViewInit
} from '@angular/core';
import {ControlValueAccessor, FormControl, NgControl} from '@angular/forms';
import { DropdownPosition, NgSelectComponent } from '@ng-select/ng-select';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {CommonService} from '../../../../../utils/common/common.service';
import {FormField} from '../form-field/form-field';
import {SelectOption} from './models/select-option';
import {Subject} from 'rxjs';

const DROP_DOWN_MAX_HEIGHT = 240;

@UntilDestroy()
@Component({
  selector: 'nx-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class SelectComponent implements OnInit, OnChanges, ControlValueAccessor, OnDestroy, AfterViewInit {
  @Input() displayModel: FormField;
  @Input() options: Array<SelectOption>;
  @Input() inputValueTemplate: TemplateRef<any>;
  @Input() appendToBody = true;
  @Input() optionTemplate: TemplateRef<any>;
  @Input() notFoundTemplate: TemplateRef<any>;
  @Input() isLoading: boolean;
  @Input() recalculatePosition: boolean; // use to set dropdown proper position after it opened but before options loaded
  @Input() clearable: boolean;
  @Input() headerAdditionalElements: TemplateRef<any>;
  @Input() typeahead$: Subject<string>;

  /**
   * Use className to provide any custom view of entire component.
   * E.g. className='nx-lightweight-select' removes inner indents and border from input, add border and outer indent to dropdown.
   * Case 2. className='nx-lightweight-select nx-chip-list-operator-select-dropdown' modifies the view of "nx-lightweight-select"
   * select through additional CSS.
   * There can be a lot of other cases. That is why we provide the className='nx-lightweight-select' instead of just
   * @Input() lightweightViewMode and do not create the list of predefined custom views
   */
  @Input() className: string;
  @ViewChild('select') select: NgSelectComponent;

  // Fired on select dropdown open
  @Output() dropdownOpened = new EventEmitter();
  @Output() dropdownClosed = new EventEmitter();

  @HostBinding('class.nx-select_dropdown-top') get isDropdownPosTop() {
    return this.select && this.select.isOpen && this.select.currentPanelPosition === 'top' || undefined;
  }

  @HostBinding('class.nx-select_dropdown-bottom') get isDropdownPosBottom() {
    return this.select && this.select.isOpen && this.select.currentPanelPosition === 'bottom' || undefined;
  }

  writeVal: string | number | boolean;
  selectControl: FormControl;
  onTouch: () => void;

  dropdownPosition: DropdownPosition;

  constructor(@Self() public controlDir: NgControl,
              private commonService: CommonService,
              public cd: ChangeDetectorRef) {
    controlDir.valueAccessor = this;
    this.selectControl = new FormControl();
  }

  onDropDownOpen(): void {
    this.dropdownOpened.emit();

    // Change dropdown position if initial value places the part of inner content out of the screen bounds
    if (this.recalculatePosition && this.select.element.getBoundingClientRect().bottom + DROP_DOWN_MAX_HEIGHT >
      document.body.getBoundingClientRect().height) {
      this.dropdownPosition = 'top';
    } else {
      this.dropdownPosition = 'auto';
    }
  }

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll.bind(this), true);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.options?.currentValue != null) {
      this.updateValue(this.selectControl.value ?? this.writeVal);
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll.bind(this), true);
  }

  // explicitly provide trackBy function for options list
  trackByFn(item) {
    return item.id;
  }

  private onScroll(event: Event): void {
    if (this.select && this.select.isOpen) {
      const isScrollingInScrollHost: boolean = ((event.target as HTMLElement).className as string).indexOf('ng-dropdown-panel-items') > -1;
      if (isScrollingInScrollHost) {
        return;
      }
      this.select.close();
    }
  }

  // needed for downgrade container
  detectChanges() {
    this.cd.detectChanges();
  }

  get control() {
    return this.controlDir.control;
  }

  writeValue(value: string | number | boolean) {
    this.writeVal = value;
    this.updateValue(value);
  }

  registerOnChange(fn): void {
    this.selectControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(fn);
  }

  registerOnTouched(fn): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // since we're proxying the request from the original form controller the "eventEmit" flag is not respcted
    // from the original form controller. Will assume that emit event should be false.
    isDisabled ? this.selectControl.disable({emitEvent: false, onlySelf: true}) :
      this.selectControl.enable({emitEvent: false, onlySelf: true});
  }

  /**
   * Only update value if in array
   */
  private updateValue(value: string | number | boolean | null) {
    const optionIds: Array<string | number | boolean> = this.options.map(({id}) => id);
    if ((value != null && !optionIds.includes(value))) {
      // if options are changed check if previously selected value exists in the new array. if not - set null value to clear select field
      // the default behaviour for ng-select is to leave the previously selected value
      this.selectControl.setValue(null, {emitEvent: false, onlySelf: true});
    } else {
      this.selectControl.setValue(value, {emitEvent: false, onlySelf: true});
    }
  }

  ngAfterViewInit(): void {
    if (this.className) {
      this.setDropdownClassName();
    }
  }

  /**
   * Set custom class name to the dropdown.
   * NgSelect do not allow to assign the dynamic classname in html to the dropdown which attached to the "body" element.
   * That is why need to push classes directly into NgSelect model data
   */
  private setDropdownClassName(): void {
    this.select.classes += ` ${this.className}`;
  }
}
