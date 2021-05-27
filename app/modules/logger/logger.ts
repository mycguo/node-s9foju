/**
 * Base class for a log service implementation
 * Also a DI token for any service that implements this class
 * @author Ryne Okimoto
 */
export abstract class Logger {

  /**
   * For general logging
   * @param message message to log
   * @param additional more messages to log
   */
  abstract info(message: string | Error, ...additional: any[]): void;

  /**
   * For warning messages in non-fatal situations
   * @param message message to log
   * @param additional more messages to log
   */
  abstract warn(message: string | Error, ...additional: any[]): void;

  /**
   * For logging critical error messages
   * @param message message to log
   * @param additional more messages to log
   */
  abstract error(message: string | Error, ...additional: any[]): void;
}
