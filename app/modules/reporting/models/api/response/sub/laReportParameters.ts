import ReportRequestParameters from '../../request/sub/report-request-parameters';

export default class LaReportParameters implements ReportRequestParameters {

  public endTime: number;
  public startTime: number;

  public setStartTimeByDate(date: Date): void {
    if (date !== void 0) {
      this.startTime = date.getTime();
    }
  }

  public setEndTimeByDate(date: Date): void {
    if (date !== void 0) {
      this.endTime = date.getTime();
    }
  }
}
