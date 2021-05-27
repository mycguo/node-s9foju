import {LogLevel} from './log-level.enum';

/**
 * Configuration options for the logger
 * Also a DI token used in the logger
 * @author Ryne Okimoto
 */
export abstract class LoggerConfig {
  serverLoggingUrl: string;
  level: LogLevel;
  serverLogLevel: LogLevel;
}
