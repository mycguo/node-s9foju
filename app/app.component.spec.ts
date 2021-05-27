import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {MockComponent} from 'ng-mocks';
import {AppbarContainer} from './containers/appbar/appbar.container';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CookieService} from 'ngx-cookie-service';
import {NotificationsSidebarContainer} from './containers/notifications-sidebar/notifications-sidebar.container';


describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        CookieService,
      ],
      declarations: [
        AppComponent,
        MockComponent(AppbarContainer),
        MockComponent(NotificationsSidebarContainer)
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
