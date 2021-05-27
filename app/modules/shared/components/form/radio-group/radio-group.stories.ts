import { moduleMetadata } from '@storybook/angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { SharedModule } from '../../../shared.module';
import { RadioGroup } from './radio-group';
import { RadioOption } from './radio-option';

export default {
  title: 'Shared/Form/Radio Group',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
    }),
  ],
};

export const Default = () => {
  const radioModel = new RadioGroup([
    new RadioOption('1', 'One'),
    new RadioOption('2', 'Two'),
  ]);
  return {
    template: `
          <nx-radio-group [formControl]="formControl" [radioGroup]="radioModel">
          </nx-radio-group>
        `,
    component: FormFieldComponent,
    props: {
      formControl: new FormControl(),
      radioModel: radioModel,
    },
  };
};

export const Selected = () => {
  const radioModel = new RadioGroup(
    [new RadioOption('1', 'One'), new RadioOption('2', 'Two')],
    'Label'
  );
  return {
    template: `
          <nx-radio-group [formControl]="formControl" [radioGroup]="radioModel">
          </nx-radio-group>
        `,
    component: FormFieldComponent,
    props: {
      formControl: new FormControl('1'),
      radioModel: radioModel,
    },
  };
};

export const Inline = () => {
  const radioModel = new RadioGroup([
    new RadioOption('1', 'One'),
    new RadioOption('2', 'Two'),
  ]);
  return {
    template: `
          <nx-radio-group [formControl]="formControl" [radioGroup]="radioModel" [inline]="true">
          </nx-radio-group>
        `,
    component: FormFieldComponent,
    props: {
      formControl: new FormControl(),
      radioModel: radioModel,
    },
  };
};

export const Disabled = () => {
  const radioModel = new RadioGroup([
    new RadioOption('1', 'One'),
    new RadioOption('2', 'Two'),
  ]);
  return {
    template: `
          <nx-radio-group [formControl]="formControl" [radioGroup]="radioModel">
          </nx-radio-group>
        `,
    component: FormFieldComponent,
    props: {
      formControl: new FormControl({ value: void 0, disabled: true }),
      radioModel: radioModel,
    },
  };
};

export const NgModel = () => {
  const radioModel = new RadioGroup([
    new RadioOption('1', 'One'),
    new RadioOption('2', 'Two'),
  ]);
  return {
    template: `
          <nx-radio-group [(ngModel)]="model" [radioGroup]="radioModel">
          </nx-radio-group>
          <p>Model: {{model}}</p>
        `,
    component: FormFieldComponent,
    props: {
      radioModel: radioModel,
    },
  };
};

NgModel.story = {
  name: 'ngModel',
};
