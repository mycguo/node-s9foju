import {waitForAsync, ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from '@angular/forms';

import {CustomLogoSelectContainer} from './custom-logo-select.container';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SharedModule} from '../../modules/shared/shared.module';
import {LogosService} from '../../modules/settings/services/logos/logos.service';
import {of} from 'rxjs';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

describe('CustomLogoSelectContainer', () => {
  let injector: TestBed;
  let component: CustomLogoSelectContainer;
  let logosService: LogosService;
  let fixture: ComponentFixture<CustomLogoSelectContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NgSelectModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        LoggerTestingModule,
        SharedModule
      ],
      declarations: [
        CustomLogoSelectContainer
      ],
      providers: [
        LogosService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    fixture = injector.createComponent(CustomLogoSelectContainer);
    logosService = injector.inject(LogosService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    spyOn(logosService, 'getLogos$').and.returnValue(of([]));
    spyOn(logosService, 'selectActiveLogoId$').and.returnValue(of(null));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
