import { moduleMetadata } from '@storybook/angular';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SelectComponent } from './select.component';
import { SelectInput } from './models/select-input';
import { SelectOption } from './models/select-option';
import { SharedModule } from '../../../shared.module';
import { Component } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'validation-select',
  template: ` <nx-select
    [displayModel]="selectModel"
    [formControl]="formControl"
  ></nx-select>`,
})
// @ts-ignore
export class ValidationSelectComponent {
  formControl = new FormControl(
    null,
    [Validators.required],
    [this.asyncValidator]
  );
  selectModel = new SelectInput(
    [new SelectOption(1, 'One'), new SelectOption(2, 'Two')],
    'Label'
  );

  constructor() {}

  asyncValidator(ctrl: AbstractControl): Observable<ValidationErrors | null> {
    let rtnVal = null;
    if (ctrl.value === 1) {
      rtnVal = { specialValidation: true };
    }
    return from(Promise.resolve(rtnVal)).pipe(delay(500));
  }
}

@Component({
  selector: 'nx-async-select-stories',
  template: `
    <nx-button (click)="loadOptions()">Load Options </nx-button> Loading State:
    {{ isLoading }} | Options: {{ selectModel.options.length }}<br /><br />
    <nx-select
      [displayModel]="selectModel"
      [formControl]="formControl"
      [isLoading]="isLoading"
      (dropdownOpened)="loadOptions()"
    ></nx-select>
  `,
})
// @ts-ignore
export class AsyncSelectStories {
  formControl: FormControl = new FormControl(null);
  selectModel: SelectInput = new SelectInput(
    [],
    'Async Select',
    'Click to load options'
  );
  isLoading: boolean;
  constructor() {
    this.formControl.valueChanges.subscribe((val) => {
      console.log('subs', val);
    });
  }

  loadOptions() {
    const selectOptions = [];
    for (let i = 1; i <= 5000; i++) {
      const id = Math.random().toString(36).substring(2);
      selectOptions.push(new SelectOption(id, `${i}. ${id}`));
    }

    this.isLoading = true;

    of(selectOptions)
      .pipe(delay(1000))
      .subscribe((options) => {
        this.isLoading = false;
        this.selectModel = { ...this.selectModel, options: options };
      });
  }
}

export default {
  title: 'Shared/Form/SelectComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [ValidationSelectComponent],
    }),
  ],

  excludeStories: ['ValidationSelectComponent', 'AsyncSelectStories'],
};

export const Default = () => {
  const selectModel = new SelectInput(
    [
      new SelectOption(1, 'One'),
      new SelectOption(2, 'Two'),
      new SelectOption(3, 'Three isDisabled', true),
    ],
    'Select Label',
    'Placeholder'
  );
  return {
    template: `
          <nx-select [displayModel]="selectModel" [formControl]="formControl"></nx-select>
        `,
    component: SelectComponent,
    props: {
      formControl: new FormControl(),
      selectModel: selectModel,
    },
  };
};

Default.story = {
  parameters: {
    notes: {
      markdown: `
          HTML:

          <form-field>
            <nx-label>Label</nx-label>
            <input nxFormInput required/>
          </form-field>
        `,
    },
  },
};

export const Disabled = () => {
  const selectModel = new SelectInput(
    [
      new SelectOption(1, 'One'),
      new SelectOption(2, 'Two'),
      new SelectOption(3, 'Three isDisabled', true),
    ],
    'Disabled',
    'Placeholder',
    void 0,
    void 0,
    'disabled hint message'
  );
  return {
    template: `
          <nx-select [displayModel]="selectModel" [formControl]="formControl"></nx-select>
        `,
    component: SelectComponent,
    props: {
      formControl: new FormControl({ value: 2, disabled: true }),
      selectModel: selectModel,
    },
  };
};

export const LightweightView = () => {
  const selectModel = new SelectInput([
    new SelectOption(1, 'All Severities'),
    new SelectOption(2, 'Critical'),
    new SelectOption(3, 'Warning'),
    new SelectOption(4, 'Info'),
  ]);
  return {
    template: `
          <div style="padding-left: 20px">
            <nx-select [lightweightViewMode]="true" [displayModel]="selectModel" [formControl]="formControl" [inputValueTemplate]="inputValueTemplate">
             <ng-template #inputValueTemplate let-item="item">Severity: {{item.name}}</ng-template>
            </nx-select>
          </div>
        `,
    component: SelectComponent,
    props: {
      formControl: new FormControl(1),
      selectModel: selectModel,
    },
  };
};

LightweightView.story = {
  parameters: {
    notes: {
      markdown: `
          HTML:

          <nx-select
              [lightweightViewMode]="true"
              [displayModel]="selectModel"
              [formControl]="formControl"
              [inputValueTemplate]="inputValueTemplate">
           <ng-template #inputValueTemplate let-item="item">Severity: {{item.name}}</ng-template>
          </nx-select>

          JS:

          this.selectModel = new SimpleSelectModel([
              new SelectOption(1, 'One'),
              new SelectOption(2, 'Two')
            ]);
          this.formControl = new FormControl(2);
        `,
    },
  },
};

export const CustomInputValue = () => {
  const selectModel = new SelectInput([
    new SelectOption(1, 'One'),
    new SelectOption(2, 'Two'),
  ]);
  return {
    template: `
          <nx-select [displayModel]="selectModel" [formControl]="formControl" [inputValueTemplate]="inputValueTemplate">
           <ng-template #inputValueTemplate let-item="item"><b>id:</b> {{item.id}} <b>name:</b> {{item.name}}</ng-template>
          </nx-select>
        `,
    component: SelectComponent,
    props: {
      formControl: new FormControl(2),
      selectModel: selectModel,
    },
  };
};

export const Validation = () => {
  return {
    template: `
         <validation-select></validation-select>`,
  };
};

export const NgModel = () => {
  const selectModel = new SelectInput(
    [
      new SelectOption(-1, 'All'),
      new SelectOption(1, 'One'),
      new SelectOption(2, 'Two'),
    ],
    'Label'
  );
  return {
    template: `
         <nx-select [displayModel]="selectModel" [(ngModel)]="model"></nx-select>

         <p>Model: {{model}}</p>
        `,
    component: SelectComponent,
    props: {
      selectModel: selectModel,
      model: -1,
    },
  };
};

NgModel.story = {
  name: 'ngModel',
};

export const AsyncLoading = () => ({
  component: AsyncSelectStories,
});
