import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { action } from '@storybook/addon-actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, Input, OnInit } from '@angular/core';
import { moduleMetadata } from '@storybook/angular';

@UntilDestroy()
@Component({
  selector: 'nx-checkbox-form',
  template: `
    <form [formGroup]="formGroup">
      <nx-checkbox
        [label]="label"
        formControlName="checkbox"
        [partial]="partial"
      ></nx-checkbox>
    </form>
  `,
})
  // @ts-ignore
class CheckboxFormComponent implements OnInit {
  // @ts-ignore
  @Input() value: boolean;
  // @ts-ignore
  @Input() label: string;
  // @ts-ignore
  @Input() disabled: boolean;
  // @ts-ignore
  @Input() partial: boolean;

  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      checkbox: this.fb.control({
        value: this.value === undefined ? null : this.value, // if null is injected storybook use undefined instead of
        disabled: this.disabled,
      }),
    });

    this.formGroup.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((values: any) => {
        action('valueChanges')(JSON.stringify(values.checkbox));
      });
  }
}

@UntilDestroy()
@Component({
  selector: 'nx-checkbox-list-form',
  template: `
    <form
      [formGroup]="formGroup"
      class="nx-checkbox-list"
      [ngClass]="{ 'nx-checkbox-list_inline': inline }"
    >
      <nx-checkbox [label]="label" formControlName="checkboxA"></nx-checkbox>
      <nx-checkbox [label]="label" formControlName="checkboxB"></nx-checkbox>
    </form>
  `,
  styleUrls: ['../../../../../../styles/atomic-stages/templates/__layout/__list/layouts__list_checkbox.less']
})
  // @ts-ignore
class CheckboxListFormComponent implements OnInit {
  // @ts-ignore
  @Input() inline: boolean;
  label: string;
  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.label = 'Checkbox text';
    this.formGroup = this.fb.group({
      checkboxA: this.fb.control(true),
      checkboxB: this.fb.control(false),
    });

    this.formGroup.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((values: any) => {
        action('valueChanges')(JSON.stringify(values));
      });
  }
}

export default {
  title: 'Shared/Form/Checkbox',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [CheckboxFormComponent, CheckboxListFormComponent],
    }),
  ],
};

export const Base = () => ({
  component: CheckboxFormComponent,
});

export const Label = () => ({
  component: CheckboxFormComponent,
  props: {
    label: 'Checkbox text',
  },
});

export const InitValue = () => ({
  component: CheckboxFormComponent,
  props: {
    value: true,
    label: 'Checkbox text',
  },
});

InitValue.story = {
  name: 'Init value',
};

export const Disabled = () => ({
  component: CheckboxFormComponent,
  props: {
    disabled: true,
    label: 'Checkbox text',
  },
});

export const Partial = () => ({
  component: CheckboxFormComponent,
  props: {
    value: null,
    label: 'Checkbox text',
    partial: true,
  },
});

export const ListColumn = () => ({
  component: CheckboxListFormComponent,
});

export const ListRow = () => ({
  component: CheckboxListFormComponent,
  props: {
    inline: true,
  },
});
