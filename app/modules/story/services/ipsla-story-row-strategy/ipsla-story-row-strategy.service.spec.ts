import {TestBed} from '@angular/core/testing';

import {IpslaStoryRowStrategyService} from './ipsla-story-row-strategy.service';
import {DeviceStrategyService} from '../../../dashboard/services/report-table-config-generator/data-strategies/device-strategy/device-strategy.service';
import {ReportDrilldownService} from '../../../reporting/services/report-drilldown/report-drilldown.service';
import {Test} from 'tslint';

describe('IpslaStoryRowStrategyService', () => {
  let service: IpslaStoryRowStrategyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DeviceStrategyService,
          useValue: {}
        },
        {
          provide: ReportDrilldownService,
          useValue: {}
        },
        {}
      ]
    });

  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
});
