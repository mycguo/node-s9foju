import {Injectable} from '@angular/core';
import {SelectOption} from '../../../shared/components/form/select/models/select-option';
import {StatusIndicatorValues} from '../../../shared/components/status-indicator/enums/status-indicator-values.enum';

@Injectable({
  providedIn: 'root'
})
export class GridSelectService {

  constructor() {
  }

  getBooleanList(): Array<SelectOption> {
    return [
      new SelectOption(true, 'Present'),
      new SelectOption(false, 'None')
    ];
  }

  getStatusList(includePollingDisabled = false): Array<SelectOption> {
    const statusList = [
      new SelectOption(StatusIndicatorValues.CRITICAL, StatusIndicatorValues.CRITICAL),
      new SelectOption(StatusIndicatorValues.WARNING, StatusIndicatorValues.WARNING),
      new SelectOption(StatusIndicatorValues.GOOD, StatusIndicatorValues.GOOD),
      new SelectOption(StatusIndicatorValues.NA, StatusIndicatorValues.NA)
    ];
    if (includePollingDisabled) {
      statusList.splice(3, 0, new SelectOption(StatusIndicatorValues.POLLING_DISABLED, StatusIndicatorValues.POLLING_DISABLED));
    }
    return statusList;
  }
}
