import { TestBed } from '@angular/core/testing';
import { TimeHelpersService } from './time-helpers.service';

describe('TimeHelpersService', () => {
  let service: TimeHelpersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    });
    service = TestBed.inject(TimeHelpersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it ('should create a formatted timezone offset', () => {
    service.getClientOffset = () => 600;
    const localTimezone = service.clientTimezoneOffsetFormatted();
    expect(localTimezone).toEqual('-1000');
  });
});
