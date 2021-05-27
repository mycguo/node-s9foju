import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../../shared.module';
import HtmlInputTypesEnum from '../simple-input/models/html-input-types.enum';
import { SimpleInputModel } from '../simple-input/models/simple-input.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component } from '@angular/core';
import { ToggleModel } from '../toggle/models/toggle.model';
import { TOOLTIP_ALIGNMENT_ENUM } from '../../tooltip/enum/tooltip-alignment.enum';
import { FileInputComponent } from './file-input.component';
import { FormValidationService } from '../../../../../services/form-validation/form-validation.service';

const file = new File([new Blob(['Hello PNG'], {type: 'application/png'})], 'Mock.png', {type: 'application/png'});
const baseProps = {
  formControl: new FormControl(file),
  model: new SimpleInputModel(HtmlInputTypesEnum.text, 'File', ),
  fileTypes: ['.jpg', '.jpeg', '.png']
};

@UntilDestroy()
@Component({
  selector: 'nx-file-input-validation-test',
  template: `
    <form [formGroup]="formGroup">
      <nx-toggle class="row row_single" [toggleModel]="toggleModel" [formControlName]="'toggleControl'"></nx-toggle>
      <nx-file-input
        class="nx-pb-16"
        [formControlName]="'inputControl'"
        [inputModel]="inputModel"
      ></nx-file-input>
      <nx-button [isPrimary]="true" [isDisabled]="formGroup.pristine || formGroup.invalid && formGroup.dirty">Submit</nx-button>
    </form>
  `,
})
// @ts-ignore
class FileInputValidationTestComponent {
  formGroup: FormGroup;
  inputModel: SimpleInputModel;
  toggleModel: ToggleModel;

  constructor(private fb: FormBuilder) {
    this.inputModel = baseProps.model;
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

@UntilDestroy()
@Component({
  selector: 'nx-file-input-required-types-test',
  template: `<nx-file-input [formControl]="formControl" [inputModel]="inputModel" [fileTypes]="fileTypes"></nx-file-input>`,
})
// @ts-ignore
class FileInputRequiredTypesTestComponent {
  formControl: FormControl;
  inputModel: SimpleInputModel;
  toggleModel: ToggleModel;
  fileTypes: Array<string>;

  constructor(private formValidationService: FormValidationService) {
    this.formControl = new FormControl(null, [this.formValidationService.requireFileTypes(baseProps.fileTypes)]);
    this.inputModel = new SimpleInputModel(HtmlInputTypesEnum.text, 'File', 'Choose a .jpg/.jpeg/.png file');
    this.fileTypes = baseProps.fileTypes;
  }
}
export default {
  title: 'Shared/Form/File Input',
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [FileInputValidationTestComponent, FileInputRequiredTypesTestComponent]
    })
  ],
};

export const Form = () => ({ template: `<nx-file-input-validation-test></nx-file-input-validation-test>` });

export const Base = () => ({
  template: `
    <nx-file-input
      [formControl]="formControl"
      [inputModel]="model"
    ></nx-file-input>
  `,
  props: baseProps
});

export const Disable = () => ({
  template: `
    <nx-file-input
      [formControl]="formControl"
      [inputModel]="model"
    ></nx-file-input>
  `,
  props: {...baseProps, formControl: new FormControl({value: file, disabled: true})}
});

export const Required = () => ({
  template: `<nx-file-input [formControl]="formControl" [inputModel]="inputModel"></nx-file-input>`,
  component: FileInputComponent,
  props: {
    formControl: new FormControl(null, [Validators.required]),
    inputModel: baseProps.model
  }
});

export const FileTypes = () => ({
  template: `<nx-file-input-required-types-test></nx-file-input-required-types-test>`,
});

export const InfoButton = () => ({
  template: `
    <nx-file-input [formControl]="formControl" [inputModel]="inputModel" class="nx-pb-16" [headerAdditionalElements]="headerTpl"></nx-file-input>
    <ng-template #headerTpl><nx-info-btn [tooltipAlignment]="tooltipPos">Tooltip</nx-info-btn></ng-template>
  `,
  component: FileInputComponent,
  props: {
    formControl: baseProps.formControl,
    inputModel: baseProps.model,
    tooltipPos: TOOLTIP_ALIGNMENT_ENUM.BOTTOM_LEFT
  }
});
