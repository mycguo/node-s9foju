import { UnitFormatterPipe } from './unit-formatter.pipe';
import {TestBed} from '@angular/core/testing';
import {CommonService} from '../../../../utils/common/common.service';
import {UnitFormatterService} from '../../../reporting/services/formatting/common/unit-formatter.service';
import {DecimalPipe} from '@angular/common';

describe('UnitFormatterPipe', () => {
  let pipe: UnitFormatterPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CommonService,
        UnitFormatterService,
        DecimalPipe,
        UnitFormatterPipe
      ]
    });
  });
  it('create an instance', () => {
    pipe = TestBed.inject(UnitFormatterPipe);
    expect(pipe).toBeTruthy();
  });
});
