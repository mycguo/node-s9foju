import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {$STATE} from '../../ajs-upgraded-providers';
import {downgradeComponent} from '@angular/upgrade/static';

@Component({
  selector: 'nx-test-upgrade-page',
  templateUrl: './test-upgrade-page.component.html',
  styleUrls: ['./test-upgrade-page.component.less']
})
export class TestUpgradePageComponent implements OnInit {

  userInfo;

  constructor(
    private userService: UserService,
    @Inject($STATE) private $state: any
  ) { }

  ngOnInit() {
    this.userInfo = this.userService.getLoggedInUser();
  }

  navigate() {
    this.$state.go('appAbout.settingsAbout', {debug: true});
  }

}

// @ts-ignore
angular.module('laClientApp')
  .directive(
    'testUpgradePage',
    downgradeComponent({component: TestUpgradePageComponent})
  );
