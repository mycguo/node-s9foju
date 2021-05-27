import { TOOLTIP_ALIGNMENT_ENUM } from '../../tooltip/enum/tooltip-alignment.enum';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { FormFieldComponent } from './form-field.component';
import { SharedModule } from '../../../shared.module';

export default {
  title: 'Shared/Form/Form Field',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule, BrowserAnimationsModule],
    }),
  ],
};

export const Optional = () => {
  return {
    template: `
          <nx-form-field [label]="'Label'">
            <ng-template #input>
              <input [formControl]="formControl" />
            </ng-template>
          </nx-form-field>
        `,
    component: FormFieldComponent,
    props: {
      formControl: new FormControl(),
    },
  };
};

export const Required = () => {
  return {
    template: `
          <nx-form-field [label]="'Label'">
            <ng-template #input>
              <input [formControl]="formControl" required />
            </ng-template>
          </nx-form-field>
        `,
    component: FormFieldComponent,
    props: {
      formControl: new FormControl(),
    },
  };
};

Required.story = {
  parameters: {
    notes: {
      markdown: `
          HTML:

          <nx-form-field [label]="'Label'">
            <ng-template #input>
              <input [formControl]="formControl" required />
            </ng-template>
          </nx-form-field>
        `,
    },
  },
};

export const RequiredWithPrefilledValue = () => {
  return {
    template: `
          <nx-form-field [label]="'Label'">
            <ng-template #input>
              <input [formControl]="formControl" required />
            </ng-template>
          </nx-form-field>
        `,
    component: FormFieldComponent,
    props: {
      formControl: new FormControl('some text'),
    },
  };
};

RequiredWithPrefilledValue.story = {
  name: 'Required with prefilled value',
};

export const AllOptions = () => {
  return {
    template: `
          <nx-form-field
            [label]="'Label'"
            [prefix]="'>'"
            [postfix]="'ms'"
            [errorMessage]="'Required'"
            [hintMessage]="'Input hint'">
            <ng-template #control>
              <nx-info-btn [tooltipAlignment]="tooltipAlignment" [allowTooltip]="true">Hint Message</nx-info-btn>
              <input type="number" [formControl]="numberInput" required />
            </ng-template>
          </nx-form-field>
        `,
    component: FormFieldComponent,
    props: {
      numberInput: new FormControl('', [Validators.required]),
      tooltipAlignment: TOOLTIP_ALIGNMENT_ENUM.BOTTOM_LEFT,
    },
  };
};

AllOptions.story = {
  parameters: {
    notes: {
      markdown: `
          HTML:

          <nx-form-field>
            <label nxLabel>Label</label>
            <nx-info-btn [tooltipAlignment]="tooltipAlignment" [allowTooltip]="true">Hint Message</nx-info-btn>
            <span nxPrefix>>=</span>
            <input nxFormInput required ngModel/>
            <span nxPostfix>ms</span>
            <span nxErrorMessage *ngIf="test.errors.required">Required</span>
          </nx-form-field>

        JS:
          test: new FormControl('', [Validators.required]),
          tooltipAlignment: LA_TOOLTIP_ALIGNMENT_ENUM.BOTTOM_LEFT

        `,
    },
  },
};
