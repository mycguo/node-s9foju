import {TestBed} from '@angular/core/testing';

import {LiveInsightEdgePredictionsReportPageService} from './live-insight-edge-predictions-report-page.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CommonService} from '../../../../utils/common/common.service';
import {LiveInsightEdgeModule} from '../../live-insight-edge.module';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('LiveInsightEdgePredictionsReportPageService', () => {
  let service: LiveInsightEdgePredictionsReportPageService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule,
        HttpClientTestingModule,
        LiveInsightEdgeModule.forRoot(false),
      ],
      providers: [
        CommonService
      ]
    });
    service = TestBed.inject(LiveInsightEdgePredictionsReportPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
