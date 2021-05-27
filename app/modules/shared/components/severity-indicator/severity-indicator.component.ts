import { Component, HostBinding, Input} from '@angular/core';
import * as _ from 'lodash';
import SeverityTypes from '../../../../../../../project_typings/api/alerting/alerts/SeverityTypes';
import {CommonService} from '../../../../utils/common/common.service';

@Component({
  selector: 'nx-severity-indicator',
  styleUrls: ['./severity-indicator.component.less'],
  templateUrl: './severity-indicator.component.html'
})
export class SeverityIndicatorComponent {
  @Input() severity: SeverityTypes;
  @Input() class = '';
  @HostBinding('class') get hostClasses(): string {
    return [
      this.class,
      `nx-severity-indicator_${_.kebabCase(this.severity)}`,
      'la-fontello',
      `la-fontello ${this.getIconClass(this.severity)}`
    ].join(' ');
  }

  constructor(public commonService: CommonService) {
  }

  private getIconClass(severity: SeverityTypes): string {
    const severityType = (!this.commonService.isNil(severity)) ? severity.toUpperCase() : '';
    if (severityType === SeverityTypes.CRITICAL.toString()) {
      return 'la-fontello_triangle';
    } else if (severityType === SeverityTypes.WARNING.toString()) {
      return 'la-fontello_quadrant';
    } else if (severityType === SeverityTypes.INFO.toString()) {
      return 'la-fontello_circle';
    }
  }
}
