import { TestBed } from '@angular/core/testing';

import { ReportDrilldownService } from './report-drilldown.service';
import {PageInterlinkService} from '../../../../services/page-interlink/page-interlink.service';
import {ReportStateParamStorageService} from '../report-state-param-storage/report-state-param-storage.service';
import {QueueReportGroupRequest} from '../../models/api/request/queue-report-group-request';
import ReportCategoryParameter from '../../models/api/parameter-enums/report-category-parameter';

class MockReportStateParamStorage {

  store = {};

  storeParams(reportReq: QueueReportGroupRequest, controllerKey: string) {
    this.store[controllerKey] = reportReq;
  }
}

describe('ReportDrilldownService', () => {
  let service: ReportDrilldownService;
  const stateParamStorage = new MockReportStateParamStorage();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PageInterlinkService,
        { provide: ReportStateParamStorageService, useValue: stateParamStorage }
      ]
    });
    service = TestBed.inject(ReportDrilldownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build a drilldown report path', () => {
    const groupName = 'groupName';
    const controllerKey = 'controllerKey';
    const reportRequests = [
      {
        reportId: { id: '0', category: ReportCategoryParameter.FLOW, name: 'reportName' }
      }
    ];
    const drilldownPath = service.buildDrilldownReportPath(groupName, reportRequests, controllerKey);
    expect(drilldownPath).toBeTruthy();
    console.log(drilldownPath);
    const storedReportReq = stateParamStorage.store[controllerKey];
    expect(storedReportReq).toBeTruthy();
    expect(storedReportReq?.reports?.[0].reportId?.id).toBe('0');
  });
});
