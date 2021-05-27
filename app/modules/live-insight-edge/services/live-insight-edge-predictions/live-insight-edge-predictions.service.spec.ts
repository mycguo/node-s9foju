import { TestBed } from '@angular/core/testing';

import { LiveInsightEdgePredictionsService } from './live-insight-edge-predictions.service';
import {CommonService} from '../../../../utils/common/common.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CookieService} from 'ngx-cookie-service';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('LiveInsightEdgePredictionsService', () => {
  let service: LiveInsightEdgePredictionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        CommonService,
        CookieService
      ]
    });
    service = TestBed.inject(LiveInsightEdgePredictionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
