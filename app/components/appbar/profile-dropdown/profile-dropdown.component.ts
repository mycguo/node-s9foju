import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import User from '../../../services/user/user.model';

@Component({
  selector: 'nx-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.less']
})
export class ProfileDropdownComponent implements OnInit {

  static dropdownString = 'isActiveUserConfigurationElement';

  @Input() activeHeaderNavItem: string;
  @Input() loggedInUser: User;

  @Output() headerNavItemClicked = new EventEmitter<string>();

  // state

  constructor() { }

  ngOnInit() {
  }

  toggleHeaderNavItemDropdown() {
    this.headerNavItemClicked.emit(ProfileDropdownComponent.dropdownString);
  }

  openChangePasswordModal() {

  }

  logoutModal() {

  }

}
