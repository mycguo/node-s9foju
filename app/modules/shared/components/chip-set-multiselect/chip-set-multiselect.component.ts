import { Component, Input, ViewChild, OnInit, TemplateRef, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {filter, debounceTime} from 'rxjs/operators';
import {ChipSetComponent} from '../chip-set/chip-set.component';
import ChipMultiselect from '../form/chips-input/chips-input-multiselect/models/chip-multiselect';
import { fadeAnimation } from '../../../../animations/fade.animation';

@UntilDestroy()
@Component({
  selector: 'nx-chip-set-multiselect',
  templateUrl: './chip-set-multiselect.component.html',
  styleUrls: ['../chip-set/chip-set.component.less', './chip-set-multiselect.component.less'],
  animations: fadeAnimation
})
export class ChipSetMultiselectComponent extends ChipSetComponent<ChipMultiselect>
                                            implements OnChanges, OnInit, OnDestroy {

  @Input() options: ChipMultiselect[];
  @Input() suggestionsItemTmpl: TemplateRef<any>;
  @Input() allowCustomText: boolean;

  @Output() addOption = new EventEmitter<ChipMultiselect>();

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  searchValue: string;
  autocompleteOptions: ChipMultiselect[];
  readonly AUTOCOMPLETE_LENGTH = 50;

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chips?.currentValue && this.chipsInputBody) {
      this.chipsInputBody.nativeElement.scrollTop = this.chipsInputBody.nativeElement.scrollHeight;
      this.updateAutocompleteOptions();
    }
    if (changes.options?.currentValue) {
      this.updateAutocompleteOptions();
    }
  }

  ngOnInit(): void {
    this.chpSetInit();
    this.inputCtrl.valueChanges
      .pipe(
        untilDestroyed(this),
        // filter only string values since mat-autocomplete as an option selected inserts that option into the input as an object
        filter((value: any) => typeof value === 'string'),
        debounceTime(250)
      )
      .subscribe((value: string) => {
        this.searchValue = value;
        this.updateAutocompleteOptions();
      });
  }

  ngOnDestroy(): void {}

  onMultiselectBodyClick(): void {
    this.onBodyClick();
    this.onFocus();
  }

  onBlurHandler(event: FocusEvent) {
    // ignore blur event if clicked on suggestions list
    // many elements can't have focus, which is a common reason for relatedTarget to be null
    // relatedTarget may also be set to null when tabbing out of a page or clicking outside window
    // used non strict equality because some browsers may also return undefined
    if (event.relatedTarget == null || (<HTMLElement>event.relatedTarget).className.indexOf('mat-option') === -1) {
      // reset search query if allowed to add custom tags to prevent adding it as tag
      if (this.allowCustomText) {
        this.inputCtrl.setValue('');
      }
      this.onBlur();
    }
  }

  private onFocus(): void {
    setTimeout(() => this.autocompleteTrigger.openPanel());
  }

  selectOption(option: ChipMultiselect): void {
    this.addOption.emit(option);
    this.inputCtrl.setValue(this.searchValue, {emitEvent: false});
    this.onFocus();
  }

  multiselectAddText() {
    if (this.searchValue && this.autocompleteOptions.length === 0) {
      this.onAddValue();
    }
  }

  private updateAutocompleteOptions(): void {
    const result: ChipMultiselect[] = [];
    for (let i = 0; i < this.options?.length; i++) {
      const option: ChipMultiselect = this.options[i];
      const chip = this.chips?.toArray().find((c: ChipMultiselect) => c.equals(option));
      if (!chip && option.toString().toLowerCase().includes(this.searchValue?.trim().toLowerCase() || '')) {
        result.push(option);
        if (result.length === this.AUTOCOMPLETE_LENGTH) {
          break;
        }
      }
    }
    this.autocompleteOptions = result;
  }

}
