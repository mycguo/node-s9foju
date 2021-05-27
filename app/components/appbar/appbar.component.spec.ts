import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppbarComponent } from './appbar.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HelpDropdownComponent} from './help-dropdown/help-dropdown.component';
import {SettingsDropdownComponent} from './settings-dropdown/settings-dropdown.component';
import {ProfileDropdownComponent} from './profile-dropdown/profile-dropdown.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MockComponent} from 'ng-mocks';
import {ActiveAlertsCountContainer} from '../../containers/active-alerts-count/active-alerts-count.container';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

describe('AppbarComponent', () => {
  let component: AppbarComponent;
  let fixture: ComponentFixture<AppbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      declarations: [
        AppbarComponent,
        MockComponent(HelpDropdownComponent),
        MockComponent(SettingsDropdownComponent),
        MockComponent(ActiveAlertsCountContainer),
        MockComponent(ProfileDropdownComponent),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should output the tab selected', () => {
    spyOn(component.tabSelected, 'emit');
    const helpDropdownElement = fixture.debugElement;
    const helpNative = helpDropdownElement.nativeElement;
    const nxSelect = helpNative.querySelector('.appbar__nx-select');
    nxSelect.click();
    fixture.detectChanges();
    expect(component.tabSelected.emit).toHaveBeenCalledWith('NX');
  });
});
