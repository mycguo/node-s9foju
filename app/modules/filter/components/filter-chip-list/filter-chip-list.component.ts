import { Component, EventEmitter, Input, Output } from '@angular/core';
import LaFilterSupportEnums from '../../../../../../../project_typings/enums/laFilterSupportEnums';
import { FilterColumnValues } from '../../interfaces/filter-column-values';
import { FilterVariables } from '../../constants/filter-variables';

@Component({
  selector: 'nx-filter-chip-list',
  templateUrl: './filter-chip-list.component.html',
  styleUrls: ['./filter-chip-list.component.less']
})
export class FilterChipListComponent {
  @Input() data: FilterColumnValues[];
  @Input() itemColor: string;
  @Output() deleteChip = new EventEmitter<string>();

  readonly SWITCH_TO_DROPDOWN_LENGTH = FilterVariables.SWITCH_TO_DROPDOWN_LENGTH;

  flexString = LaFilterSupportEnums.FLEX_STRING;
}
