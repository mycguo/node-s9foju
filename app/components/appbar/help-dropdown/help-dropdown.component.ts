import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import LiveactionLinksConstants from '../../../constants/liveaction-links.constants';

@Component({
  selector: 'nx-help-dropdown',
  templateUrl: './help-dropdown.component.html',
  styleUrls: ['./help-dropdown.component.less']
})
export class HelpDropdownComponent implements OnInit {

  static dropdownString = 'isActiveHelpConfigurationElement';

  // input
  isLoggedIn = true;
  // input
  @Input() activeHeaderNavItem: string;
  @Input() showSupportPortalOption = true;

  @Output() headerNavItemClicked = new EventEmitter<string>();

  documentationUrl = LiveactionLinksConstants.DOCUMENTATION;
  supportPortalUrl = LiveactionLinksConstants.SUPPORT_PORTAL;

  constructor() { }

  ngOnInit() {
  }

  toggleHeaderNavItemDropdown() {
    this.headerNavItemClicked.emit(HelpDropdownComponent.dropdownString);
  }

  openWalkMePlayer() {}

}
