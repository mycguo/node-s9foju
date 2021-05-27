import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomApplicationsContainer } from './custom-applications.container';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SharedModule} from '../../../shared/shared.module';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('CustomApplicationsContainer', () => {
  let component: CustomApplicationsContainer;
  let fixture: ComponentFixture<CustomApplicationsContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        SharedModule
      ],
      declarations: [ CustomApplicationsContainer ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomApplicationsContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
