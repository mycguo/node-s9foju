import {Injectable} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormValidationService} from '../../../../services/form-validation/form-validation.service';

@Injectable({
  providedIn: 'root'
})
export class IntegrationsFormService {

  /**
   * @ignore
   */
  constructor(
    private fb: FormBuilder,
    private formValidationService: FormValidationService
  ) {
  }

  /**
   * Return a form group based on the integration from component
   */
  getFormGroup(): FormGroup {
    return this.fb.group({
      hostname: ['',
        [
          Validators.required,
          Validators.minLength(4),
          this.formValidationService.hostname()
        ]
      ],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
}
