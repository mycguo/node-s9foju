import {
  AfterViewInit,
  Component,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Self,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  NgControl,
  NgModel,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {DeviceEntityPageReport} from '../../services/device-entity-page-reports/models/device-entity-page-report';
import {ReportInfoValue} from '../../../reporting/models/report-info';
import AvailableParameter from '../../../reporting/models/available-parameter';
import {SelectOption} from '../../../shared/components/form/select/models/select-option';
import {SelectInput} from '../../../shared/components/form/select/models/select-input';
import AvailableParameterValue from '../../../reporting/models/available-parameter-value';
import {SimpleInputModel} from '../../../shared/components/form/simple-input/models/simple-input.model';
import HtmlInputTypesEnum from '../../../shared/components/form/simple-input/models/html-input-types.enum';
import {CommonService} from '../../../../utils/common/common.service';
import {Subscription} from 'rxjs';

enum FormType {
  input,
  select
}

@Component({
  selector: 'nx-device-entity-page-form',
  templateUrl: './device-entity-page-form.component.html',
  styleUrls: ['./device-entity-page-form.component.less']
})
export class DeviceEntityPageFormComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit, ControlValueAccessor, Validator {
  @Input() reportInfo: ReportInfoValue;

  // We are interested in the validation status and errors for the report name
  // Obtain a reference to the report name form control
  @ViewChild('reportName') private reportNameModel: NgModel;

  formType = FormType;
  optionsMap: Map<string, FormType>;
  selectMap: Map<string, SelectInput>;
  inputMap: Map<string, SimpleInputModel>;
  deviceEntityPageReport: DeviceEntityPageReport;
  isDisabled: boolean;

  // custom
  reportNameInput: SimpleInputModel;

  private reportNameControlChanges: Subscription;

  onChange = (updateList: DeviceEntityPageReport) => void 0;
  onTouch = () => void 0;

  constructor(@Self() private controlDir: NgControl,
              private fb: FormBuilder,
              private commonService: CommonService) {
    controlDir.valueAccessor = this;
    this.reportNameInput = new SimpleInputModel(HtmlInputTypesEnum.text, 'Report Name');
    this.optionsMap = new Map<string, FormType>();
    this.selectMap = new Map<string, SelectInput>();
    this.inputMap = new Map<string, SimpleInputModel>();
  }

  get control() {
    return this.controlDir?.control;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.reportInfo?.currentValue != null) {
      this.buildMappings(changes.reportInfo.currentValue);
    }
  }

  ngOnInit() {
    /**
     * Although the scope of the class is bound to the validate method,
     * the scope of this (in the validate method) does not reflect
     * the current state of the class.  It is almost as if a new scope
     * is being created.  For example, properties may be null or empty
     * when there should be values.
     */
    this.control.setValidators(this.validate.bind(this));
  }

  writeValue(obj: DeviceEntityPageReport): void {
    if (obj != null) {
      this.deviceEntityPageReport = obj;
    }
  }

  registerOnChange(fn: (updateList: DeviceEntityPageReport) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  buildMappings(reportInfo: ReportInfoValue): void {
    this.optionsMap.clear();
    this.selectMap.clear();
    this.inputMap.clear();
    this.reportNameInput = new SimpleInputModel(HtmlInputTypesEnum.text, 'Report Name', reportInfo.name);

    reportInfo.availableParameters.forEach((param: AvailableParameter) => {
      // if the parameter is null (but also defined) use default api value
      if (this.deviceEntityPageReport?.parameters != null && this.deviceEntityPageReport.parameters[param.queryKey] == null) {
        this.deviceEntityPageReport.parameters[param.queryKey] = param.defaultValue?.apiValue;
      }

      if (param.availableValues != null) {
        // select input
        this.optionsMap.set(param.queryKey, FormType.select);
        const options: Array<SelectOption> = param.availableValues.map((value: AvailableParameterValue) => {
          return {id: value.apiValue, name: value.displayValue} as SelectOption;
        });
        this.selectMap.set(param.queryKey, new SelectInput(options, this.commonService.startCase(param.queryKey)));
      } else {
        // input
        this.optionsMap.set(param.queryKey, FormType.input);
        this.inputMap.set(param.queryKey, new SimpleInputModel(HtmlInputTypesEnum.text, this.commonService.startCase(param.queryKey)));
      }
    });
  }

  changeHandler(): void {
    this.onChange(this.deviceEntityPageReport);
  }

  reportNameChange(name: string) {
    this.deviceEntityPageReport.reportName = name;
    this.changeHandler();
  }

  parameterChange(key: string, value: any) {
    this.deviceEntityPageReport.parameters[key] = value;
    this.changeHandler();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    /**
     * Be aware of problems with scoping if `this` is used within this method.
     * See comment in ngOnInit.
     */
    return control.errors;
  }

  ngAfterViewInit(): void {
    /**
     * Implement manual validation.
     * Due to issues with scoping, the form group
     * or report name form control cannot be used for returning errors in the
     * validate method.
     *
     * Here we manually set errors on the host form control.  The host form control
     * is the parameter to the validate method.  Thus, we can return the
     * correct validation errors.
     */
    this.reportNameControlChanges = this.reportNameModel
      .statusChanges
      .subscribe((status: any) => {
        if (status === 'INVALID') {
          this.control.setErrors(this.reportNameModel.errors, {emitEvent: true});
        } else if (status === 'VALID') {
          this.control.setErrors(null, {emitEvent: true});
        } else if (status === 'DISABLED') {
          // Disabled controls are not validated so clear errors
          this.control.setErrors(null, {emitEvent: true});
        }
      });
  }

  ngOnDestroy(): void {
    if (this.reportNameControlChanges != null) {
      this.reportNameControlChanges.unsubscribe();
    }
  }
}
