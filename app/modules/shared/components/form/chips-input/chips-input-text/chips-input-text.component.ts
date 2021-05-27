import {AbstractControl, ControlValueAccessor, FormControl, NgControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Component, Input, Self, OnChanges, SimpleChanges} from '@angular/core';
import ChipsInputTextModel from './models/chips-input-text.model';
import Chip from './models/chip';
import {UntilDestroy} from '@ngneat/until-destroy';
import { fadeAnimation } from '../../../../../../animations/fade.animation';
import {ChipSet} from '../../../chip-set/models/chip-set';
import {CommonService} from 'src/app/utils/common/common.service';

@UntilDestroy()
@Component({
  selector: 'nx-chips-input-text',
  templateUrl: './chips-input-text.component.html',
  styleUrls: ['./chips-input-text.component.less'],
  animations: fadeAnimation,
  providers: [ {provide: CommonService} ]
})
export class ChipsInputTextComponent implements OnChanges, ControlValueAccessor {

  @Input() chipsInputModel: ChipsInputTextModel;

  chipSet: ChipSet<Chip>;
  onTouched: () => void;
  ctrlValueChanges: (value: string[]) => void;
  inputValue: {value: string} = {value: null};
  placeholder: string;

  constructor(@Self() public controlDir: NgControl, protected commonService: CommonService) {
    controlDir.valueAccessor = this;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chipsInputModel?.currentValue?.tagValidators) {
      // if tagValidators of each tag are specified, add the validateEachTag function into this.control.validator
      this.updateValidators();
    }
    // if tagValidators of each tag are not specified, this.control.validator is just staying used
  }

  get control(): AbstractControl {
    return this.controlDir?.control;
  }

  private updateValidators() {
    const validators = this.control.validator ?
                        [this.control.validator, this.validateEachTag.bind(this)] :
                        this.validateEachTag.bind(this);
    this.control.setValidators(validators);
    // this.control.updateValueAndValidity();
  }

  addValueHandler(value: string): void {
    value = value?.trim();
    if (!value) {
      return;
    }
    const newValues: string[] = (this.control.value || []).slice();
    const remainValues: string[] = [];
    const slices = this.splitByDelimiters(value);
    slices.forEach((slice: string) => {
      if (newValues.find((val: string) => val === slice)) {
        remainValues.push(slice);
      } else {
        newValues.push(slice);
      }
    });
    this.valueChanges(newValues);
    this.inputValue = {value: this.commonService.uniqueArray(remainValues).join() || null};
  }

  removeChips(chips: Chip[]): void {
    const newValue: string[] = [...this.control.value];
    chips.forEach((chip: Chip) => {
      const index = newValue.findIndex((value: string) => chip.getValue() === value);
      newValue.splice(index, 1);
    });
    this.valueChanges(newValue);
  }

  private splitByDelimiters(value: string[] | string, i: number = 0): string[] {
    value = Array.isArray(value) ? value : [value];
    const splitter = this.chipsInputModel.delimiters[i];
    const result = value.reduce((splitChips: string[], chip: string) => {
      const slices = chip.split(splitter).map((slice: string) => slice.trim());
      return [...splitChips, ...slices.filter((s: string) => s !== '')];
    }, []);
    return i === this.chipsInputModel.delimiters.length - 1 ? result : this.splitByDelimiters(result, ++i);
  }

  protected valueChanges(values: string[]): void {
    this.updateChipSet(values);
    this.ctrlValueChanges(values);
    this.updatePlaceholder(values);
    this.control.updateValueAndValidity();
  }

  protected updateChipSet(values: string[]): void {
    const newChipSet = new ChipSet<Chip>();
    values?.forEach((value: string) => newChipSet.add(new Chip({name: value})));
    this.chipSet = newChipSet;
  }

  private updatePlaceholder(values: string[]): void {
    this.placeholder = values?.length ? this.chipsInputModel.secondaryPlaceholder : this.chipsInputModel.placeholder;
  }

  // The function works through all the chipSet applying each validator from
  // the chipsInputModel.tagValidators to each unique chip(tag).
  private validateEachTag(control: AbstractControl): ValidationErrors {
    let errors: ValidationErrors = {};
    this.chipSet.forEach((chip: Chip) => {
      let tagErrors: ValidationErrors = {};
      this.chipsInputModel.tagValidators.forEach((validator: ValidatorFn) => {
        const error = validator(new FormControl(chip.getValue()));
        if (error !== null) {
          tagErrors = {...tagErrors, ...error};
        }
      });
      if (Object.keys(tagErrors).length > 0) {
        chip.markAsInvalid();
        errors = {...errors, ...tagErrors};
      } else {
        chip.markAsValid();
      }
    });
    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Methods of ControlValueAccessor
  writeValue(values: string[]): void {
    this.updateChipSet(values);
    this.updatePlaceholder(values);
  }

  registerOnChange(fn: any): void {
    this.ctrlValueChanges = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
