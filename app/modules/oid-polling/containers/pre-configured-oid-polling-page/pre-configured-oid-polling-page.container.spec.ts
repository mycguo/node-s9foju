import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreConfiguredOidPollingPageContainer } from './pre-configured-oid-polling-page.container';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('PreConfiguredOidPollingPageContainer', () => {
  let component: PreConfiguredOidPollingPageContainer;
  let fixture: ComponentFixture<PreConfiguredOidPollingPageContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        MatDialogModule
      ],
      declarations: [ PreConfiguredOidPollingPageContainer ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreConfiguredOidPollingPageContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
