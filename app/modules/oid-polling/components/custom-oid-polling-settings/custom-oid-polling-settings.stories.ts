import { moduleMetadata } from '@storybook/angular';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { action } from '@storybook/addon-actions';
import { CustomOidPollingSettingsComponent } from './custom-oid-polling-settings.component';

@Component({
  selector: 'nx-custom-oid-polling-settings-wrapper',
  template: `
    <form [formGroup]="settingsFormGroup">
      <nx-custom-oid-polling-settings
        [formControl]="
          toFormControl(settingsFormGroup.get(generalSettingsControlKey))
        "
      ></nx-custom-oid-polling-settings>
    </form>
  `,
})
// @ts-ignore
export class CustomOidPollingSettingsWrapperComponent implements OnInit {
  // @ts-ignore
  @Input() settings: any;

  generalSettingsControlKey = 'general';
  settingsFormGroup: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.settingsFormGroup = this.fb.group({
      [this.generalSettingsControlKey]: [this.settings || null],
    });

    this.settingsFormGroup.valueChanges.subscribe((data) => {
      action('valueChanges', data);
    });
  }

  // Set the proper typings of the form control for referencing to this control inside html
  public toFormControl(point: AbstractControl): FormControl {
    return point as FormControl;
  }
}

export default {
  title: 'Settings/CustomOidPollingSettingsComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [
        CustomOidPollingSettingsWrapperComponent,
        CustomOidPollingSettingsComponent,
      ],
    }),
  ],

  excludeStories: ['CustomOidPollingSettingsWrapperComponent'],
};

export const InitialState = () => ({
  component: CustomOidPollingSettingsWrapperComponent,
});

export const InjectedData = () => ({
  component: CustomOidPollingSettingsWrapperComponent,
  props: {
    settings: {
      name: 'Name',
      oidIndex: '.1.2.34',
      processingType: 'DELTA',
      units: 'MHz',
      conversionType: 'DIVIDE',
      conversionFactor: 3,
    },
  },
});
