import { moduleMetadata } from '@storybook/angular';
import { DropdownComponent } from './dropdown.component';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckboxComponent } from '../form/checkbox/checkbox.component';

// @ts-ignore
import * as defaultMarkdown from './notes/default.notes.md';
// @ts-ignore
import * as customButtonMarkdown from './notes/custom-button.notes.md';
// @ts-ignore
import * as textButtonMarkdown from './notes/text-button.notes.md';
// @ts-ignore
import * as customContentMarkdown from './notes/custom-content.notes.md';
// @ts-ignore
import * as directionMarkdown from './notes/direction.notes.md';
// @ts-ignore
import * as angularJsMarkdown from './notes/nx-dropdown-angular-js.note.md';

import { DropdownVerticalPosition } from './enums/dropdown-vertical-position.enum';
import { DropdownHorizontalPosition } from './enums/dropdown-horizontal-position.enum';
import { Component, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../../shared.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { action } from '@storybook/addon-actions';

@Component({
  template: `
    <nx-dropdown [btnTmpl]="tmpl">Menu</nx-dropdown>
    <ng-template #tmpl>
      <nx-button
        class="nx-filter__action-list-item"
        [icon]="'code'"
        [isWhiteViewMode]="true"
        [matTooltip]="'Some Tooltip Msg'"
      ></nx-button>
    </ng-template>
  `,
})
// @ts-ignore
class CustomButtonComponent {}

@UntilDestroy()
@Component({
  selector: 'nx-checkbox-list-form',
  template: `
    <nx-dropdown>
      <form [formGroup]="formGroup" class="nx-checkbox-list">
        <nx-checkbox [label]="label" formControlName="checkboxA"></nx-checkbox>

        <nx-checkbox [label]="label" formControlName="checkboxB"></nx-checkbox>
      </form>
    </nx-dropdown>
  `,
  styleUrls: ['../../../../../styles/atomic-stages/templates/__layout/__list/layouts__list_checkbox.less']
})
// @ts-ignore
class CheckboxListFormComponent implements OnInit {
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
  title: 'Shared/Dropdown',

  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatTooltipModule,
        SharedModule,
      ],
      declarations: [
        DropdownComponent,
        CheckboxComponent,
        CustomButtonComponent,
        CheckboxListFormComponent,
      ],
    }),
  ],
};

export const AngularJs = () => ({
  template: `See notes`,
});

AngularJs.story = {
  name: 'AngularJS',
  parameters: { notes: { markdown: angularJsMarkdown } },
};

export const Default = () => ({
  template: `<nx-dropdown>Menu</nx-dropdown>`,
});

Default.story = {
  parameters: { notes: { markdown: defaultMarkdown } },
};

export const CustomButton = () => ({
  component: CustomButtonComponent,
});

CustomButton.story = {
  parameters: { notes: { markdown: customButtonMarkdown } },
};

export const TextButton = () => ({
  props: { buttonText: 'Button' },
  template: `<nx-dropdown [buttonText]="buttonText">Menu</nx-dropdown>`,
});

TextButton.story = {
  parameters: { notes: { markdown: textButtonMarkdown } },
};

export const CheckboxList = () => ({
  component: CheckboxListFormComponent,
});

CheckboxList.story = {
  parameters: { notes: { markdown: customContentMarkdown } },
};

export const Direction = () => ({
  props: {
    xPosition: DropdownHorizontalPosition.ALIGN_LEFT,
    yPosition: DropdownVerticalPosition.TOP,
  },
  template: `
    <nx-dropdown buttonText="Bottom Right to Left (Default)" style="margin-right: 50px; vertical-align: top;">Menu</nx-dropdown>
    <nx-dropdown [xPosition]="xPosition" buttonText="Left to Right" style="margin-right: 50px; vertical-align: top;">Menu</nx-dropdown>
    <nx-dropdown [yPosition]="yPosition" buttonText="Top" style="margin-top: 80px; margin-right: 50px; vertical-align: top;">Menu</nx-dropdown>
  `,
});

Direction.story = {
  parameters: { notes: { markdown: directionMarkdown } },
};
