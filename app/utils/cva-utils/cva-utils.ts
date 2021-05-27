import {AbstractControl, ValidationErrors} from '@angular/forms';

export class CvaUtils {

  static extractControlErrors(controls: { [key: string]: AbstractControl } = {}): { [key: string]: ValidationErrors | null } {
    const errors: { [key: string]: ValidationErrors | null } = {};
    for (const controlsKey in controls) {
      if (controls[controlsKey].errors != null) {
        errors[controlsKey] = controls[controlsKey].errors;
      }
    }
    return Object.keys(errors).length === 0 ? null : errors;
  }
}
