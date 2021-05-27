import { Injectable } from '@angular/core';
import {differenceInSeconds, differenceInDays, format, subDays, subMonths} from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class TimeUtilsService {

  constructor() { }

  getTimeAgo(timeInPast: Date): string {
    const secondsAgo = differenceInSeconds(new Date(), timeInPast);
    if (secondsAgo < 60) {
      return 'Seconds ago';
    } else if (secondsAgo < 3600) {
      return `${Math.floor(secondsAgo / 60)}min ago`;
    } else {
      return `${Math.floor(secondsAgo / 3600)}h ago`;
    }
    return 'Now';
  }

  isLessThanDayBetween(date: Date ): boolean {
    return differenceInDays(new Date(), date) === 0;
  }

  roundDownToNearestHour(date: Date): Date {
    const returnDate = new Date(date.getTime());
    returnDate.setMinutes(0);
    returnDate.setSeconds(0);
    returnDate.setMilliseconds(0);
    return returnDate;
  }

  /**
   * Return the formatted date.
   * @param date For example, 26 Mar 2020, 12:00AM
   */
  formatDate(date: Date | string | number): string {
    return format(date, 'DD MMM YYYY, hh:mmA');
  }

  subDays(date: Date, amount: number): Date {
    return subDays(date, amount);
  }

  subMonths(date: Date | string | number, amount: number): Date {
    return subMonths(date, amount);
  }
}
