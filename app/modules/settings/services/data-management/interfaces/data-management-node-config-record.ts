import {DataStoreType} from '../enums/data-store-type.enum';

export interface DataManagementNodeConfigRecord {
  purgeAge?: number;
  purgeAutomatically: boolean;
  bytesUsedWarningThreshold?: number;
  enableBytesUsedWarning: boolean;
  archiveOnPurge: boolean;
  archiveDirectory?: string;
  dataStoreType: DataStoreType;
  dataStoreLocation?: string;
  dataStoreUsedBytes?: number;
}
