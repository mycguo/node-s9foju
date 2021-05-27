import {NxStorage} from './nx-storage';

export interface ReportStorage extends NxStorage {
  resultStoreSize: number;
  reportCacheStorageLimit: number;
}
