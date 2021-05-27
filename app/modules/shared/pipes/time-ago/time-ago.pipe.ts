import { Pipe, PipeTransform } from '@angular/core';
import {TimeUtilsService} from '../../../../services/time-utils/time-utils.service';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  constructor(
    private timeUtils: TimeUtilsService
  ) {}

  transform(value: Date): string {
    return this.timeUtils.getTimeAgo(value);
  }

}
