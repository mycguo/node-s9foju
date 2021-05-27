import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Self
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NgControl,
  Validators
} from '@angular/forms';
import {SimpleInputModel} from '../simple-input/models/simple-input.model';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {TOOLTIP_ALIGNMENT_ENUM} from '../../tooltip/enum/tooltip-alignment.enum';
import HtmlInputTypesEnum from '../simple-input/models/html-input-types.enum';
import { CommonService } from '../../../../../utils/common/common.service';
import { FormStatus } from '../../../enums/form-status.enum';

@UntilDestroy()
@Component({
  selector: 'nx-toggle-input',
  templateUrl: './toggle-input.component.html',
  styleUrls: ['./toggle-input.component.less'],
})
export class ToggleInputComponent implements OnInit, ControlValueAccessor {

  readonly TOGGLE_KEY = 'toggle';
  readonly INPUT_KEY = 'input';

  @Input() inputModel: SimpleInputModel;
  @Input() tooltipMsg: string;

  formGroup: FormGroup;
  simpleInputModel: SimpleInputModel;
  tooltipAlignment = TOOLTIP_ALIGNMENT_ENUM.TOP_RIGHT;
  INPUT_TYPE: typeof HtmlInputTypesEnum = HtmlInputTypesEnum;

  onTouched: () => void;
  _onChange: (value) => void = () => void 0;

  constructor(
    @Self() public controlDir: NgControl,
    private fb: FormBuilder,
    private commonService: CommonService
  ) {
    controlDir.valueAccessor = this;
    // must be in constructor
    // https://github.com/angular/angular/issues/29218
    this.formGroup = this.fb.group(
      {
        [this.TOGGLE_KEY]: [],
        [this.INPUT_KEY]: []
      }
    );

    this.toggleControl.valueChanges
      .pipe(
        untilDestroyed(this)
      ).subscribe(toggle => {
        if (toggle) {
          if (this.inputControl.disabled) {
            this.inputControl.enable();
          }
        } else {
          if (this.inputControl.enabled) {
            this.inputControl.disable();
          }
          if (!this.toggleControl.pristine) {
            this._onChange(null);
          }
        }
    });

    this.inputControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        // emit value change of internal control only on user interaction and not disabled state
        if (!this.inputControl.disabled && (!this.inputControl.pristine || this.toggleControl.dirty)) {
          this._onChange(value);
        }
      });

    this.inputControl.statusChanges
      .pipe(
        untilDestroyed(this)
      ).subscribe(status => {
        if (status === FormStatus.INVALID) {
          this.control?.setErrors({required: true});
          return;
        }
      this.control?.setErrors(null);
    });
  }

  get control(): AbstractControl {
    return this.controlDir.control;
  }

  get toggleControl(): AbstractControl {
    return this.formGroup?.get(this.TOGGLE_KEY);
  }

  get inputControl(): AbstractControl {
    return this.formGroup?.get(this.INPUT_KEY);
  }

  ngOnInit() {
    this.simpleInputModel = new SimpleInputModel(
      this.inputModel.type,
      void 0,
      void 0,
      this.inputModel.prefix,
      this.inputModel.postfix,
      void 0,
      {required: () => 'Field can not be empty'}
    );

    // combine internal validator with parent if any
    const validators = [Validators.required];
    if (this.control.validator) {
      validators.push(this.control.validator);
    }
    this.inputControl.setValidators(validators);
    this.inputControl.markAsTouched();
    this.inputControl.updateValueAndValidity({emitEvent: false});
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {

    // Uncheck checkbox for undefined of empty value
    this.toggleControl.reset(value != null && value !== '');
    this.inputControl.reset(value);
  }
}
