import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReportInfoValue } from '../../../reporting/models/report-info';
import {ReportTreeType} from './models/report-tree-type';

@Component({
  selector: 'nx-report-accordion-select',
  templateUrl: './report-accordion-select.component.html',
  styleUrls: ['./report-accordion-select.component.less']
})
export class ReportAccordionSelectComponent {
  @Input() dataSource: ReportTreeType[];
  @Input() isExpanded: boolean;
  @Input() searchString: string;
  @Output() selectedReport = new EventEmitter<ReportInfoValue>();
}
