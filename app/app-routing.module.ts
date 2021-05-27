import { NgModule } from '@angular/core';
import {Routes, RouterModule, Router} from '@angular/router';
import {TestUpgradePageComponent} from './pages/test-upgrade-page/test-upgrade-page.component';
import {ReloadPageComponent} from './pages/reload-page/reload-page.component';
import {downgradeInjectable, getAngularJSGlobal} from '@angular/upgrade/static';

const routes: Routes = [
  { path: 'test-upgrade-page', component: TestUpgradePageComponent },
  { path: '**', component: ReloadPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })], // enable tracing only for debugging
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor() {
    const angular = getAngularJSGlobal();
    angular.module('laClientApp')
      .factory('Router', downgradeInjectable(Router));
  }
}
