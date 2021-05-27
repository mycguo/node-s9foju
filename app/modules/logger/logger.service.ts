import {NGXLogger, NgxLoggerLevel} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {LoggerConfig} from './logger-config';
import {Logger} from './logger';
import {LogLevel} from './log-level.enum';

/**
 * Service to log messages on the client and server
 * @author Ryne Okimoto
 */
@Injectable()
export class LoggerService extends Logger {

  constructor(private config: LoggerConfig, private logger: NGXLogger) {
    super();
    this.logger.updateConfig({
      serverLoggingUrl: config.serverLoggingUrl,
      level: LoggerService.getLogLevel(config.level),
      serverLogLevel: LoggerService.getLogLevel(config.serverLogLevel)
    });
  }

  /**
   * Map our log level to NgxLogger log levels
   * @param level the log level to use
   */
  private static getLogLevel(level: LogLevel): NgxLoggerLevel {
    switch (level) {
      case LogLevel.INFO:
        return NgxLoggerLevel.INFO;
      case LogLevel.WARN:
        return NgxLoggerLevel.WARN;
      case LogLevel.ERROR:
        return NgxLoggerLevel.ERROR;
      default:
        return NgxLoggerLevel.INFO;
    }
  }

  /**
   * @inheritDoc
   */
  public info(message: string | Error, ...additional: any[]): void {
    this.logger.info(message, ...additional);
  }

  /**
   * @inheritDoc
   */
  public warn(message: string | Error, ...additional: any[]): void {
    this.logger.warn(message, ...additional);
  }

  /**
   * @inheritDoc
   */
  public error(message: string | Error, ...additional: any[]): void {
    this.logger.error(message, ...additional);
  }
}
