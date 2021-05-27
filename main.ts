import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {downgradeInjectable, getAngularJSGlobal} from '@angular/upgrade/static';
import {$locationShim} from '@angular/common/upgrade';
import {CookieService} from 'ngx-cookie-service';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    // The AngularJS global angular variable must be available
    // We cannot import angular typings since there is a conflict
    // between the versions the AngularJS requires (2.x) and the version
    // that Angular requires (3.x).  Compilation will fail.
    // @ts-ignore
    const angular = getAngularJSGlobal();
    angular.module('laClientApp')
      .factory('$location', downgradeInjectable($locationShim))
      .factory('CookieService', downgradeInjectable(CookieService));
  });


