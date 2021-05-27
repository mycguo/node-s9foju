import { moduleMetadata } from '@storybook/angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { ToggleModel } from './models/toggle.model';

export default {
  title: 'Shared/Form/ToggleComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
    }),
  ],
};

export const Label = () => {
  return {
    template: `
          <nx-toggle
            [toggleModel]="toggleModel"
            [formControl]="formControl"
          ></nx-toggle>
        `,
    props: {
      toggleModel: new ToggleModel('On', 'Off', 'Label'),
      formControl: new FormControl(false),
    },
  };
};

export const DefaultOff = () => {
  return {
    template: `
          <nx-toggle
            [toggleModel]="toggleModel"
            [formControl]="formControl"
          ></nx-toggle>
        `,
    props: {
      toggleModel: new ToggleModel('On', 'Off'),
      formControl: new FormControl(false),
    },
  };
};

DefaultOff.story = {
  name: 'Default off',
};

export const DefaultOn = () => {
  return {
    template: `
        <nx-toggle
          [toggleModel]="toggleModel"
          [formControl]="formControl"
        ></nx-toggle>
      `,
    props: {
      toggleModel: new ToggleModel('On', 'Off'),
      formControl: new FormControl(true),
    },
  };
};

DefaultOn.story = {
  name: 'Default on',
};

export const Disabled = () => {
  return {
    template: `
          <nx-toggle
            [toggleModel]="toggleModel"
            [formControl]="formControl"
          ></nx-toggle>
        `,
    props: {
      toggleModel: new ToggleModel('On', 'Off'),
      formControl: new FormControl({ value: false, disabled: true }),
    },
  };
};

export const NgModel = () => {
  return {
    template: `
          <nx-toggle
            [toggleModel]="toggleModel"
            [(ngModel)]="model"
          ></nx-toggle>
          <p>Model: {{model}}</p>
        `,
    props: {
      toggleModel: new ToggleModel('On', 'Off'),
      model: true,
    },
  };
};

NgModel.story = {
  name: 'NgModel',
};

export const HintMessage = () => {
  return {
    template: `
          <nx-toggle
            [toggleModel]="toggleModel"
            [formControl]="formControl"
          ></nx-toggle>
        `,
    props: {
      toggleModel: new ToggleModel('On', 'Off', void 0, 'hint message'),
      formControl: new FormControl({ value: false, disabled: true }),
    },
  };
};
