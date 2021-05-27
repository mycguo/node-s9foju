import {ReportHistory} from '../../../../services/report-history/models/report-history.interface';

export class SubmitEmitterData {
  constructor( public reportCacheStorageLimit: number, public history: ReportHistory ) {}
}
