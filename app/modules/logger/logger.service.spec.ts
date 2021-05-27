import {TestBed} from '@angular/core/testing';

import {LoggerService} from './logger.service';
import {LoggerModule} from './logger.module';
import {LogLevel} from './log-level.enum';
import {Logger} from './logger';

describe('LoggerService', () => {
  let service: Logger;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerModule.forRoot({
          serverLoggingUrl: '/api/log/error',
          level: LogLevel.INFO,
          serverLogLevel: LogLevel.ERROR
        })
      ]
    });
    service = TestBed.inject(Logger);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log an info message', () => {
    try {
      service.info('Hello world!');
      expect().nothing();
    } catch (err) {
      expect(err).toBe(null);
    }
  });

  it('should log a warning message', () => {
    try {
      service.warn('Warning!');
      expect().nothing();
    } catch (err) {
      expect(err).toBe(null);
    }
  });

  it('should log an error message', () => {
    try {
      service.error('Error!');
      expect().nothing();
    } catch (err) {
      expect(err).toBe(null);
    }
  });
});
