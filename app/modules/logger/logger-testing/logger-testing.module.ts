import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Logger} from '../logger';
import {MockLoggerService} from './mock-logger.service';


@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    {provide: Logger, useClass: MockLoggerService}
  ]
})
export class LoggerTestingModule { }
