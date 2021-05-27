import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';

import {AlertManagementPageDowngradeContainer} from './alert-management-page-downgrade.container';
import {MockComponent} from 'ng-mocks';
import {AlertManagementPageContainer} from '../../../modules/alerts/containers/alert-management-page/alert-management-page.container';
import {NxAlertManagementService} from '../../../modules/alerts/services/nx-alert-management/nx-alert-management.service';
import {SdwanAlertManagementService} from '../../../modules/alerts/services/sdwan-alert-management/sdwan-alert-management.service';

describe('AlertManagementPageDowngradeContainer', () => {
  let component: AlertManagementPageDowngradeContainer;
  let fixture: ComponentFixture<AlertManagementPageDowngradeContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AlertManagementPageDowngradeContainer,
        MockComponent(AlertManagementPageContainer)
      ],
      providers: [
        {
          provide: NxAlertManagementService,
          useValue: {}
        },
        {
          provide: SdwanAlertManagementService,
          useValue: {}
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertManagementPageDowngradeContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
