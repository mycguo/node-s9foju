import { Pipe, PipeTransform } from '@angular/core';
import {format, isToday, isValid, parse} from 'date-fns';

@Pipe({
  name: 'statusTime'
})
export class StatusTimePipe implements PipeTransform {

  transform(value: string): string {
    const date = parse(value);
    if (!isValid(date)) {
      return '';
    }
    if (isToday(date)) {
      return format(date, 'hh:mm A');
    }
    return format(date, 'MMM DD');
  }

}
