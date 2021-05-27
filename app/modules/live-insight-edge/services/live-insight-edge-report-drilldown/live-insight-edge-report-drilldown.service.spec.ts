import { TestBed } from '@angular/core/testing';

import { LiveInsightEdgeReportDrilldownService } from './live-insight-edge-report-drilldown.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonService } from '../../../../utils/common/common.service';
import { CookieService } from 'ngx-cookie-service';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('LiveInsightEdgeReportDrilldownService', () => {
  let service: LiveInsightEdgeReportDrilldownService;

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
    service = TestBed.inject(LiveInsightEdgeReportDrilldownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
