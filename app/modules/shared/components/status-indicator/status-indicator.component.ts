import {Component, HostBinding, Input} from '@angular/core';
import { StatusIndicatorValues } from './enums/status-indicator-values.enum';
import { StatusIndicatorViewTypes } from './enums/status-indicator-view-types.enum';

@Component({
  template: '<ng-content></ng-content>',
  selector: '[nx-status-indicator]',
  styleUrls: ['./status-indicator.component.less']
})
export class StatusIndicatorComponent {
  @Input() status: StatusIndicatorValues;
  @Input() viewType =  StatusIndicatorViewTypes.EXTENDED;
  @HostBinding('class.nx-status-indicator_only-icon') get isOnlyIconView() { return this.viewType === StatusIndicatorViewTypes.ICON; }
  @HostBinding('class.nx-status-indicator_only-text') get isOnlyTextView() { return this.viewType === StatusIndicatorViewTypes.TEXT; }

  private static getClassNamePostfix(status: StatusIndicatorValues): string {
    if (status === StatusIndicatorValues.POLLING_DISABLED) {
      return 'polling-disabled';
    } else if (status === StatusIndicatorValues.NA) {
      return 'na';
    } else {
      return status?.toLowerCase();
    }
  }

  constructor() {}
  @HostBinding('class') get statusModifier(): string {
    return `nx-status-indicator_${StatusIndicatorComponent.getClassNamePostfix(this.status)}`;
  }
}
