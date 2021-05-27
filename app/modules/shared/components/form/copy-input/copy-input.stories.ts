import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../../shared.module';
import HtmlInputTypesEnum from '../simple-input/models/html-input-types.enum';
import { SimpleInputModel } from '../simple-input/models/simple-input.model';
import { action } from '@storybook/addon-actions';
import { CopyInputComponent } from './copy-input.component';
import { TOOLTIP_ALIGNMENT_ENUM } from '../../tooltip/enum/tooltip-alignment.enum';
import { Component } from '@angular/core';
import { ToggleModel } from '../toggle/models/toggle.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

const copyCallback = (value) => { action('Copied Value: ')(value); };
const model = new SimpleInputModel(
  HtmlInputTypesEnum.text,
  'Input With Copy Button',
  'Enter value'
);

@UntilDestroy()
@Component({
  selector: 'nx-copy-input-validation-test',
  template: `
    <form [formGroup]="formGroup">
      <nx-toggle class="row row_single" [toggleModel]="toggleModel" [formControlName]="'toggleControl'"></nx-toggle>
      <nx-copy-input [formControlName]="'inputControl'" [inputModel]="inputModel" (copy)="copy($event)" class="nx-pb-16"></nx-copy-input>
      <nx-button [isPrimary]="true" [isDisabled]="formGroup.pristine || formGroup.invalid && formGroup.dirty">Submit</nx-button>
    </form>
  `,
})
// @ts-ignore
class CopyInputValidationTestComponent {
  formGroup: FormGroup;
  inputModel: SimpleInputModel;
  toggleModel: ToggleModel;
  copy = copyCallback;

  constructor(private fb: FormBuilder) {
    this.inputModel = model;
    this.toggleModel = new ToggleModel('on', 'off', 'Validate Input');
    this.formGroup = this.fb.group({
      inputControl: [null],
      toggleControl: [false]
    });

    this.formGroup.get('toggleControl').valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value: any) => {
        this.formGroup.get('inputControl').setValidators(value ? [Validators.required] : null);
        this.formGroup.get('inputControl').updateValueAndValidity();
      });
  }
}

export const Form = () => {
  return {
    template: `<nx-copy-input-validation-test></nx-copy-input-validation-test>`,
  };
};

export default {
  title: 'Shared/Form/Copy Input',
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [CopyInputValidationTestComponent]
    }),
  ]
};

export const Base = () => ({
  template: `<nx-copy-input [formControl]="formControl" [inputModel]="inputModel" (copy)="copy($event)"></nx-copy-input>`,
  component: CopyInputComponent,
  props: {
    formControl: new FormControl(),
    inputModel: model,
    copy: copyCallback
  }
});

export const Disabled = () => ({
  template: `<nx-copy-input [formControl]="formControl" [inputModel]="inputModel" (copy)="copy($event)"></nx-copy-input>`,
  component: CopyInputComponent,
  props: {
    formControl: new FormControl({ value: null, disabled: true }),
    inputModel: model,
    copy: copyCallback
  }
});

export const Required = () => ({
  template: `<nx-copy-input [formControl]="formControl" [inputModel]="inputModel" (copy)="copy($event)"></nx-copy-input>`,
  component: CopyInputComponent,
  props: {
    formControl: new FormControl(null, [Validators.required]),
    inputModel: model,
    copy: copyCallback
  }
});

export const InfoButton = () => ({
  template: `
    <nx-copy-input [formControl]="formControl" [inputModel]="inputModel" (copy)="copy($event)" class="nx-pb-16" [headerAdditionalElements]="headerTpl"></nx-copy-input>
    <ng-template #headerTpl><nx-info-btn [tooltipAlignment]="tooltipPos">Tooltip</nx-info-btn></ng-template>
  `,
  component: CopyInputComponent,
  props: {
    formControl: new FormControl(null),
    inputModel: model,
    copy: copyCallback,
    tooltipPos: TOOLTIP_ALIGNMENT_ENUM.BOTTOM_LEFT
  }
});
