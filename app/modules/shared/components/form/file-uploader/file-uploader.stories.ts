import { moduleMetadata } from '@storybook/angular';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { Component } from '@angular/core';
import { FormValidationService } from '../../../../../services/form-validation/form-validation.service';

@Component({
  selector: 'file-upload-validation-test',
  template: `
    <form [formGroup]="formGroup">
      <nx-file-uploader formControlName="formControl"></nx-file-uploader>
    </form>
  `,
})
export class FileUploadValidationTestComponent {
  constructor(
    private fb: FormBuilder,
    private formValidationService: FormValidationService
  ) {}

  formGroup = this.fb.group({
    formControl: [
      '',
      [Validators.required],
      [this.formValidationService.asyncImage(100, { width: 1, height: 2 })],
    ],
  });
}

export default {
  title: 'Shared/Form/File Uploader Component',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [FileUploadValidationTestComponent],
    }),
  ],

  excludeStories: ['FileUploadValidationTestComponent'],
};

export const Default = () => {
  return {
    template: `<nx-file-uploader ngModel></nx-file-uploader>`,
    props: {},
  };
};

export const AsyncValidator = () => {
  return {
    template: `<file-upload-validation-test></file-upload-validation-test>`,
  };
};
