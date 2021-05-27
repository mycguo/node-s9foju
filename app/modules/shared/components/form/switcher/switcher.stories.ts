import { moduleMetadata } from '@storybook/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
// @ts-ignore
import * as baseMarkdown from './notes/base.note.md';
import SwitcherModel from './models/switcher.model';
import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

enum SWITCHER_OPTION_NAMES {
  FIRST = 'first',
  SECOND = 'second',
  THIRD = 'third',
}

@UntilDestroy()
@Component({
  selector: 'nx-switcher-form',
  template: `
    <form [formGroup]="formGroup">
      <nx-switcher
        [switcherModel]="switcherModel"
        formControlName="switcher"
      ></nx-switcher>
    </form>
  `,
})
  // @ts-ignore
class SwitcherFormComponent implements OnInit {
  // @ts-ignore
  @Input() switcherModel: SwitcherModel;
  // @ts-ignore
  @Input() switcherValue: SWITCHER_OPTION_NAMES;
  // @ts-ignore
  @Input() showToggleDisableStateBehaviour: boolean;
  formGroup: FormGroup;

  private static getDefaultData(): SwitcherModel {
    return new SwitcherModel([
      {
        name: SWITCHER_OPTION_NAMES.FIRST,
        displayValue: 'First',
      },
      {
        name: SWITCHER_OPTION_NAMES.SECOND,
        displayValue: 'Second',
      },
    ]);
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (!this.switcherModel) {
      this.switcherModel = SwitcherFormComponent.getDefaultData();
    }

    this.formGroup = this.fb.group({
      switcher: this.fb.control(this.switcherValue),
    });

    if (this.showToggleDisableStateBehaviour) {
      setTimeout(() => {
        this.formGroup.controls['switcher'].disable({
          emitEvent: false,
          onlySelf: true,
        });
        setTimeout(() => {
          this.formGroup.controls['switcher'].enable({
            emitEvent: false,
            onlySelf: true,
          });
        }, 2000);
      }, 2000);
    }

    this.formGroup.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((values: any) => {
        alert(JSON.stringify(values.switcher));
      });
  }
}

@UntilDestroy()
@Component({
  selector: 'nx-switcher-model',
  template: `
    <nx-switcher
      [switcherModel]="switcherModel"
      [(ngModel)]="switcherValue"
      (change)="changeSwitcherValueCallback(switcherValue)"
    ></nx-switcher>
    <p>Selected: {{ switcherValue }}</p>
  `,
})
  // @ts-ignore
class SwitcherModelComponent {
  // @ts-ignore
  @Input() switcherModel: SwitcherModel;
  // @ts-ignore
  @Input() switcherValue: SWITCHER_OPTION_NAMES;

  changeSwitcherValueCallback(value: SWITCHER_OPTION_NAMES) {
    alert(value);
  }
}

export default {
  title: 'Shared/Form/Switcher',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [SwitcherFormComponent, SwitcherModelComponent],
    }),
  ],
};

export const Base = () => ({
  component: SwitcherFormComponent,
});

Base.story = {
  parameters: { notes: { markdown: baseMarkdown } },
};

export const InitValue = () => ({
  component: SwitcherFormComponent,
  props: {
    switcherValue: 'second',
  },
});

InitValue.story = {
  parameters: { notes: { markdown: baseMarkdown } },
};

export const Disabled = () => ({
  component: SwitcherFormComponent,
  props: {
    showToggleDisableStateBehaviour: true,
  },
});

Disabled.story = {
  parameters: { notes: { markdown: baseMarkdown } },
};

export const DisabledOption = () => ({
  component: SwitcherFormComponent,
  props: {
    switcherModel: new SwitcherModel([
      {
        name: SWITCHER_OPTION_NAMES.FIRST,
        displayValue: 'First',
      },
      {
        name: SWITCHER_OPTION_NAMES.SECOND,
        displayValue: 'Second',
        disabled: true,
      },
    ]),
  },
});

DisabledOption.story = {
  parameters: { notes: { markdown: baseMarkdown } },
};

export const Standalone = () => ({
  component: SwitcherModelComponent,
  props: {
    switcherModel: new SwitcherModel([
      {
        name: SWITCHER_OPTION_NAMES.FIRST,
        displayValue: 'First',
      },
      {
        name: SWITCHER_OPTION_NAMES.SECOND,
        displayValue: 'Second',
      },
      {
        name: SWITCHER_OPTION_NAMES.THIRD,
        displayValue: 'Third',
      },
    ]),
    switcherValue: 'second',
  },
});

Standalone.story = {
  parameters: { notes: { markdown: baseMarkdown } },
};
