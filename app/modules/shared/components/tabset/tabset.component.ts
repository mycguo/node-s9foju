import {
  Component,
  EventEmitter, HostBinding,
  Input, OnChanges,
  Output, SimpleChanges,
} from '@angular/core';
import {Tab} from './tab';
import {CommonService} from '../../../../utils/common/common.service';

@Component({
  selector: 'nx-tabset',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.less']
})
export class TabsetComponent implements OnChanges {

  /** Array of parameters for each tab */
  @Input() tabGroup: Tab[];

  /** Id of the selected tab.
   * If no ID is provided, choose 1st tab.
   * If multiple tabs have this id choose 1st one. */
  @Input() selectedTabId;
  @Input() isContentDetailsView = false;

  /** Callback which emits index of selected tab */
  @Output() tabSelected = new EventEmitter<string>();

  @HostBinding('class.nx-tabset_tabs-only') @Input() tabsOnly = false;

  selectedIndex: number;

  constructor(private commonService: CommonService) {
    this.selectedIndex = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.commonService.isNil(changes?.selectedTabId?.currentValue)) {
      // Find the first tab that has this ID
      const foundIndex = this.tabGroup.findIndex(tab => tab.id === changes.selectedTabId.currentValue);
      // If the selected tab id cannot be found or is out of bounds, default to 1st tab
      if (foundIndex < 0 || foundIndex > this.tabGroup.length) {
        this.selectedIndex = 0;
      } else {
        this.selectedIndex = foundIndex;
      }
    }
  }

  public handleTabChange(selectedIndex: number) {
    this.tabSelected.emit(this.tabGroup[selectedIndex].id);
  }
}
