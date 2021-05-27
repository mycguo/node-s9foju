import {TimeDisplayPipe} from './time-display.pipe';
import {TestBed} from '@angular/core/testing';
import {TimeUtilsService} from '../../../../services/time-utils/time-utils.service';

describe('TimeDisplayPipe', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TimeDisplayPipe,
      TimeUtilsService
    ]
  }));

  it('create an instance', () => {
    const pipe: TimeDisplayPipe = TestBed.get(TimeDisplayPipe);
    expect(pipe).toBeTruthy();
  });
});
