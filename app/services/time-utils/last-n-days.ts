import {subDays} from 'date-fns';

export default class LastNDays {
  readonly label: string;
  readonly startTime: Date;

  constructor(private days: number, public readonly currentTime: Date) {
    const daysPluralized = days === 1 ? 'day' : 'days';
    this.label = `Last ${days} ${daysPluralized}`;
    this.startTime = subDays(currentTime, days);
  }
}
