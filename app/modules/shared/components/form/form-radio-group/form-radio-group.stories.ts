import { moduleMetadata } from '@storybook/angular';
import { FormRadioGroupComponent } from './form-radio-group.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { ByteFormattingPipe } from '../../../pipes/byte-formatting/byte-formatting.pipe';
import { RadioGroup } from '../radio-group/radio-group';
import { RadioOption } from '../radio-group/radio-option';

export default {
  title: 'Shared/Form/Form Radio Group',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      providers: [ByteFormattingPipe],
    }),
  ],
};

export const Default = () => {
  const radioModel = new RadioGroup(
    [new RadioOption('1', 'One'), new RadioOption('2', 'Two')],
    'Label'
  );
  return {
    component: FormRadioGroupComponent,
    template: `<nx-form-radio-group [formControl]="formControl" [radioGroup]="radioModel"></nx-form-radio-group>`,
    props: {
      formControl: new FormControl(),
      radioModel: radioModel,
    },
  };
};

Default.story = {
  name: 'default',
};

export const Inline = () => {
  const radioModel = new RadioGroup(
    [
      new RadioOption('1', 'One'),
      new RadioOption('2', 'Two'),
      new RadioOption('3', 'Three'),
    ],
    'Label'
  );
  return {
    component: FormRadioGroupComponent,
    template: `<nx-form-radio-group [formControl]="formControl" [radioGroup]="radioModel" [inline]="true"></nx-form-radio-group>`,
    props: {
      formControl: new FormControl(),
      radioModel: radioModel,
    },
  };
};

export const Validation = () => {
  const radioModel = new RadioGroup(
    [
      new RadioOption('1', 'One'),
      new RadioOption('2', 'Two'),
      new RadioOption('3', 'Three'),
    ],
    'Label'
  );
  return {
    component: FormRadioGroupComponent,
    template: `<nx-form-radio-group [formControl]="formControl" [radioGroup]="radioModel" [inline]="true"></nx-form-radio-group>`,
    props: {
      formControl: new FormControl('', [Validators.required]),
      radioModel: radioModel,
    },
  };
};

export const NgModel = () => {
  const radioModel = new RadioGroup(
    [
      new RadioOption('1', 'One'),
      new RadioOption('2', 'Two'),
      new RadioOption('3', 'Three'),
    ],
    'Label'
  );
  return {
    component: FormRadioGroupComponent,
    template: `<nx-form-radio-group [(ngModel)]="model" [radioGroup]="radioModel"></nx-form-radio-group>
                <p>Model: {{model}}</p>`,
    props: {
      radioModel: radioModel,
    },
  };
};

NgModel.story = {
  name: 'ngModel',
};
