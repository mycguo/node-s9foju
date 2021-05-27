import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerModule as NgxLoggerModule } from 'ngx-logger';
import { LoggerConfig } from './logger-config';
import { Logger } from './logger';
import { LoggerService } from './logger.service';
import {HttpClientModule} from '@angular/common/http';

/**
 * Module for logging services
 * @author Ryne Okimoto
 */
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgxLoggerModule.forRoot(null)
  ]
})
export class LoggerModule {
  static forRoot(config: LoggerConfig): ModuleWithProviders<LoggerModule> {
    return {
      ngModule: LoggerModule,
      providers: [
        {provide: LoggerConfig, useValue: config},
        {provide: Logger, useClass: LoggerService}
      ]
    };
  }
}
