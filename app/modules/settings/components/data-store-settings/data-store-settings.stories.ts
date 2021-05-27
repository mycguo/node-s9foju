import { DataStoreType } from '../../services/data-management/enums/data-store-type.enum';
import { DataStoreSettingsComponent } from './data-store-settings.component';
import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DataStoreSettingsDisplayNamePipe } from './pipes/data-store-settings-display-name.pipe';

export default {
  title: 'Settings/Data Store/Data Store Settings',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [
        DataStoreSettingsComponent,
        DataStoreSettingsDisplayNamePipe,
      ],
    }),
  ],
};

export const Base = () => ({
  component: DataStoreSettingsComponent,
  props: {
    settings: {
      purgeAge: 1,
      purgeAutomatically: true,
      bytesUsedWarningThreshold: 512000,
      enableBytesUsedWarning: true,
      archiveOnPurge: false,
      archiveDirectory: 'some archive directory',
      dataStoreType: DataStoreType.FLOW,
      dataStoreLocation: 'some data store location',
      dataStoreUsedBytes: 107374182400,
    },
    allowEditing: true,
    allowBackup: true,
    purge: () => {
      alert('purge');
    },
    backup: () => {
      alert('backup');
    },
    reset: () => {
      alert('reset');
    },
  },
});
