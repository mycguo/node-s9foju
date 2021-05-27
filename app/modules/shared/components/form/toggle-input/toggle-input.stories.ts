import { moduleMetadata } from '@storybook/angular';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { Component, Input, OnInit } from '@angular/core';
import { SimpleInputModel } from '../simple-input/models/simple-input.model';
import HtmlInputTypesEnum from '../simple-input/models/html-input-types.enum';

@Component({
  selector: 'nx-toggle-input-stories',
  template: `
    <form [formGroup]="formGroup" class="row">
      <nx-toggle-input
        [formControlName]="FORM_CONTROL_A_KEY"
        [inputModel]="inputModelA"
        [tooltipMsg]="tooltipMsg"
        class="col col_w-50"
      ></nx-toggle-input>
      <nx-toggle-input
        [formControlName]="FORM_CONTROL_B_KEY"
        [inputModel]="inputModelB"
        class="col col_w-50"
      ></nx-toggle-input>
      <div class="col col_w-100">
        Pristine: {{ formGroup.pristine }}<br />
        Valid: {{ formGroup.valid }}
      </div>
      <div class="col col_w-100">
        <nx-button (btnClick)="formValue = formGroup.value" [isPrimary]="true"
          >Check Value</nx-button
        >
      </div>
      <div class="col col_w-100" *ngIf="formValue">
        Value: {{ formValue | json }}
      </div>
    </form>
  `,
})
// @ts-ignore
class ToggleInputStories implements OnInit {
  // @ts-ignore
  @Input() tooltipMsg: string;

  // @ts-ignore
  @Input() value: any;

  // @ts-ignore
  @Input() validation: any;

  readonly FORM_CONTROL_A_KEY = 'formControlA';
  readonly FORM_CONTROL_B_KEY = 'formControlB';

  formGroup: FormGroup;
  inputModelA: SimpleInputModel;
  inputModelB: SimpleInputModel;
  formValue: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.inputModelA = new SimpleInputModel(
      HtmlInputTypesEnum.number,
      'Field A label',
      void 0,
      void 0,
      'hour(s)'
    );

    this.inputModelB = new SimpleInputModel(
      HtmlInputTypesEnum.text,
      'Field B label'
    );

    this.formGroup = this.fb.group({
      formControlA: new FormControl(this.value, this.validation),
      formControlB: new FormControl(null),
    });

    setTimeout(() => {
      // use timeout because of the handling of the multiple inner form fields that take a time
      this.formGroup.markAsPristine();
    });
  }
}

export default {
  title: 'Shared/Form/ToggleInputComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
    }),
  ],
};

export const Base = () => {
  return {
    component: ToggleInputStories,
  };
};

export const InitValue = () => {
  return {
    component: ToggleInputStories,
    props: {
      value: 10,
    },
  };
};

InitValue.story = {
  name: 'Init value',
};

export const Validation = () => {
  return {
    component: ToggleInputStories,
    props: {
      value: 10,
      validation: [Validators.min(0)],
    },
  };
};

export const Tooltip = () => {
  return {
    component: ToggleInputStories,
    props: {
      tooltipMsg: 'Some message',
    },
  };
};
