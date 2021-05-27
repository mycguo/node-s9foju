import { moduleMetadata } from '@storybook/angular';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import HtmlInputTypesEnum from './models/html-input-types.enum';
import { SharedModule } from '../../../shared.module';
import { SimpleInputModel } from './models/simple-input.model';
import { from, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

export default {
  title: 'Shared/Form/Simple Input',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
    }),
  ],
};

export const Basic = () => {
  const inputModel = new SimpleInputModel(
    HtmlInputTypesEnum.text,
    'Label',
    'Placeholder'
  );
  return {
    template: `
          <nx-simple-input [formControl]="formControl" [inputModel]="inputModel">
          </nx-simple-input>

          <p>Value: {{formControl.value}}</p>
        `,
    component: FormFieldComponent,
    props: {
      formControl: new FormControl(),
      inputModel: inputModel,
    },
  };
};

Basic.story = {
  parameters: {
    notes: {
      markdown: `
          HTML:

          <nx-simple-input [formControl]="formControl" [inputModel]="inputModel"></nx-simple-input>

          JS:
          const inputModel = new SimpleInputModel2(
            HtmlInputTypesEnum.text,
            'Label',
            'Placeholder'
          );
          const formControl: new FormControl(),
        `,
    },
  },
};

export const Disabled = () => {
  const inputModel = new SimpleInputModel(
    HtmlInputTypesEnum.text,
    'Label',
    'Placeholder'
  );
  return {
    template: `
          <nx-simple-input [formControl]="formControl" [inputModel]="inputModel">
          </nx-simple-input>
        `,
    component: FormFieldComponent,
    props: {
      formControl: new FormControl({ value: '', disabled: true }),
      inputModel: inputModel,
    },
  };
};

Disabled.story = {
  parameters: {
    notes: {
      markdown: `
          HTML:

          <nx-simple-input [formControl]="formControl" [inputModel]="inputModel"></nx-simple-input>

          JS:
         const inputModel = new SimpleInputModel2(
          HtmlInputTypesEnum.text,
          'Label',
          'Placeholder'
        );
          const new FormControl({value: '', disabled: true})
        `,
    },
  },
};

export const PrefixPostfix = () => {
  const inputModel = new SimpleInputModel(
    HtmlInputTypesEnum.text,
    'Label',
    'Placeholder',
    'Prefix',
    'Postfix'
  );
  return {
    template: `
          <nx-simple-input [formControl]="formControl" [inputModel]="inputModel">
          </nx-simple-input>
        `,
    component: FormFieldComponent,
    props: {
      formControl: new FormControl('', [Validators.required]),
      inputModel: inputModel,
    },
  };
};

PrefixPostfix.story = {
  name: 'Prefix & Postfix',
};

export const HintMessage = () => {
  const inputModel = new SimpleInputModel(
    HtmlInputTypesEnum.text,
    'Label',
    'Placeholder',
    void 0,
    void 0,
    'Disabled Hint Message'
  );
  return {
    template: `
          <nx-simple-input [formControl]="formControl" [inputModel]="inputModel">
          </nx-simple-input>
        `,
    component: FormFieldComponent,
    props: {
      formControl: new FormControl({ value: '', disabled: true }),
      inputModel: inputModel,
    },
  };
};

export const Validation = () => {
  const inputModel = new SimpleInputModel(
    HtmlInputTypesEnum.text,
    'Label',
    'Placeholder'
  );
  return {
    template: `
          <nx-simple-input [formControl]="formControl" [inputModel]="inputModel">
          </nx-simple-input>
        `,
    component: FormFieldComponent,
    props: {
      formControl: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      inputModel: inputModel,
    },
  };
};

export const AsyncValidation = () => {
  const inputModel = new SimpleInputModel(
    HtmlInputTypesEnum.text,
    'Label',
    'Placeholder'
  );
  return {
    template: `
          <nx-simple-input [formControl]="formControl" [inputModel]="inputModel">
          </nx-simple-input>
        `,
    component: FormFieldComponent,
    props: {
      formControl: new FormControl('', [Validators.required], [AsyncValidator]),
      inputModel: inputModel,
    },
  };
};

export const NgModel = () => {
  const inputModel = new SimpleInputModel(
    HtmlInputTypesEnum.text,
    'Label',
    'Placeholder'
  );
  return {
    template: `
          <nx-simple-input [(ngModel)]="model" [inputModel]="inputModel" required minlength="4">
          </nx-simple-input>

          <p>model: {{model}}</p>
        `,
    component: FormFieldComponent,
    props: {
      model: '',
      inputModel: inputModel,
    },
  };
};

NgModel.story = {
  name: 'ngModel',
};

export const _FormGroup = () => {
  const inputModel = new SimpleInputModel(
    HtmlInputTypesEnum.text,
    'Label',
    'Placeholder'
  );
  return {
    template: `
          <form [formGroup]="formGroup">
            <nx-simple-input formControlName="input" [inputModel]="inputModel">
            </nx-simple-input>
          </form>

          <p>Form Valid: {{formGroup.valid | json}}</p>
        `,
    component: FormFieldComponent,
    props: {
      formGroup: new FormGroup({
        input: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
        ]),
      }),
      inputModel: inputModel,
    },
  };
};

const AsyncValidator = (
  control: AbstractControl
): Observable<ValidationErrors | null> => {
  let rtnVal = null;
  if (control.value === 'foobar') {
    rtnVal = { specialValidation: true };
  }
  return from(Promise.resolve(rtnVal)).pipe(delay(500));
};
