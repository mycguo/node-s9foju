import { Injectable } from '@angular/core';
import {Logger} from '../logger';

/**
 * Mock logger service for use in test modules
 * @author Ryne Okimoto
 */
@Injectable()
export class MockLoggerService extends Logger {

  constructor() {
    super();
  }

  /**
   * @inheritDoc
   */
  error(message: string): void {
  }

  /**
   * @inheritDoc
   */
  info(message: string): void {
  }

  /**
   * @inheritDoc
   */
  warn(message: string): void {
  }
}
