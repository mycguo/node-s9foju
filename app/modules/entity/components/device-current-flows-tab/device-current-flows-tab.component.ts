import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {DashboardWidgetConfig} from '../../../dashboard/components/dashboard-widget/dashboard-widget-config';
import WidgetDataProvider from '../../../dashboard/containers/dashboard-widget/widget-data-provider';
import {ReportWidgetDataProviderService} from '../../../dashboard/services/report-widget-data-provider/report-widget-data-provider.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SelectInput} from '../../../shared/components/form/select/models/select-input';
import {SelectOption} from '../../../shared/components/form/select/models/select-option';
import {DeviceCurrentFlowsForm} from './device-current-flows-form';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import AvailableParameter from '../../../reporting/models/available-parameter';
import {CommonService} from '../../../../utils/common/common.service';
import AvailableParameterValue from '../../../reporting/models/available-parameter-value';
import LaFilterSupportEnums from '../../../../../../../project_typings/enums/laFilterSupportEnums';
import {FilterOptionsValue} from '../../../filter/interfaces/filter-options-value';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {TimeConstants} from 'src/app/constants/time.constants';

@UntilDestroy()
@Component({
  selector: 'nx-device-current-flows-tab',
  templateUrl: './device-current-flows-tab.component.html',
  styleUrls: ['./device-current-flows-tab.component.less'],
  providers: [
    {provide: WidgetDataProvider, useExisting: ReportWidgetDataProviderService}
  ]
})
export class DeviceCurrentFlowsTabComponent implements OnChanges {
  static readonly FLOW_TYPE_KEY = 'flowType';
  static readonly TIME_RANGE_KEY = 'timeRange';
  static readonly FLEX_SEARCH_KEY = 'flexSearch';

  @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() currentFlowsWidget: DashboardWidgetConfig;
  @Input() flowTypeParameter: AvailableParameter;
  @Input() deviceName: string;

  @Output() formChange = new EventEmitter<DeviceCurrentFlowsForm>();

  currentFlowsFormGroup: FormGroup;
  flowTypeSelect: SelectInput;
  filterOptions: Array<LaFilterSupportEnums>;
  filterOptionsValue: FilterOptionsValue;
  timeRangeSelectModel: SelectInput;

  constructor(private fb: FormBuilder,
              private commonService: CommonService) {
    this.flowTypeSelect = new SelectInput([]);
    this.timeRangeSelectModel = new SelectInput([
      new SelectOption(TimeConstants.TWO_MINUTES, '2 mins'),
      new SelectOption(TimeConstants.FIVE_MINUTES, '5 mins')
    ],
    'Time range',
    'Select time range',
    void 0,
    void 0,
    void 0,
    void 0,
    true
    );
    this.currentFlowsFormGroup = this.fb.group({
      [DeviceCurrentFlowsTabComponent.FLOW_TYPE_KEY]: [],
      [DeviceCurrentFlowsTabComponent.TIME_RANGE_KEY]: TimeConstants.TWO_MINUTES,
      [DeviceCurrentFlowsTabComponent.FLEX_SEARCH_KEY]: [[]]
    });
    this.filterOptions = [
      LaFilterSupportEnums.SP,
      LaFilterSupportEnums.PRE_SELECTED_DEVICE_INTERFACE_GROUP,
      LaFilterSupportEnums.TAG,
      LaFilterSupportEnums.APPLICATION,
      LaFilterSupportEnums.DSCP,
      LaFilterSupportEnums.SSRC,
      LaFilterSupportEnums.PROTOCOL,
      LaFilterSupportEnums.IP_SRC,
      LaFilterSupportEnums.IP_DST,
      LaFilterSupportEnums.PORT_SRC,
      LaFilterSupportEnums.PORT_DST,
      LaFilterSupportEnums.IP,
      LaFilterSupportEnums.PORT
    ];
    this.currentFlowsFormGroup.valueChanges
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((formValue: DeviceCurrentFlowsForm) => {
        this.refresh(formValue);
      });
  }

  get staticFlowKey(): string {
    return DeviceCurrentFlowsTabComponent.FLOW_TYPE_KEY;
  }

  get staticTimeRangeKey(): string {
    return DeviceCurrentFlowsTabComponent.TIME_RANGE_KEY;
  }

  get staticFlexSearchKey(): string {
    return DeviceCurrentFlowsTabComponent.FLEX_SEARCH_KEY;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.commonService.isNil(changes?.deviceName?.currentValue)) {
      this.filterOptionsValue = {
        [LaFilterSupportEnums.PRE_SELECTED_DEVICE_INTERFACE_GROUP]: this.deviceName
      };
    }
    if (!this.commonService.isNil(changes?.flowTypeParameter?.currentValue)) {
      const flowTypeParameter: AvailableParameter = changes.flowTypeParameter.currentValue;
      const flowTypeOptions: Array<SelectOption> = flowTypeParameter.availableValues.map((value: AvailableParameterValue) => {
        return {id: value.apiValue, name: value.displayValue};
      }).sort((a: SelectOption, b: SelectOption) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        } else {
          return 0;
        }
      });
      this.flowTypeSelect = new SelectInput(flowTypeOptions);
      if (this.commonService.isNil(this.currentFlowsFormGroup.get([DeviceCurrentFlowsTabComponent.FLOW_TYPE_KEY])?.value)) {
        this.currentFlowsFormGroup.patchValue(
          {
            [DeviceCurrentFlowsTabComponent.FLOW_TYPE_KEY]: flowTypeParameter?.defaultValue?.apiValue
          },
          {emitEvent: false, onlySelf: true}
        );
      }
    }
  }

  refresh(formValues: DeviceCurrentFlowsForm): void {
    this.formChange.emit(formValues);
  }
}
