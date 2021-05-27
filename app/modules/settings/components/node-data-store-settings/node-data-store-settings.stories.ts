import { DataStoreSettingsComponent } from '../data-store-settings/data-store-settings.component';
import { DataStoreType } from '../../services/data-management/enums/data-store-type.enum';
import { NodeDataStoreSettingsComponent } from './node-data-store-settings.component';
import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataStoreSettingsDisplayNamePipe } from '../data-store-settings/pipes/data-store-settings-display-name.pipe';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

export default {
  title: 'Settings/Data Store/Node Data Store Settings',

  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      declarations: [
        NodeDataStoreSettingsComponent,
        DataStoreSettingsComponent,
        DataStoreSettingsDisplayNamePipe
      ]
    }),
  ],
};

export const Base = () => ({
  component: NodeDataStoreSettingsComponent,
  props: {
    settings: {
      node: {
        name: 'Local Node',
        id: 'local',
        freeSpace: 992,
        totalSpace: 1000,
        qosUsage: 2,
        flowUsage: 2,
        alertUsage: 2,
        longTermUsage: 2,
        useDefaultSettings: false,
      },
      dataStoreSettings: [
        {
          purgeAge: 1,
          purgeAutomatically: true,
          bytesUsedWarningThreshold: 512000,
          enableBytesUsedWarning: true,
          archiveOnPurge: false,
          archiveDirectory: 'some archive directory',
          dataStoreType: DataStoreType.FLOW,
          dataStoreLocation: 'some data store location',
          dataStoreSize: 107374182400,
        },
        {
          purgeAge: 2,
          purgeAutomatically: false,
          bytesUsedWarningThreshold: 512000,
          enableBytesUsedWarning: true,
          archiveOnPurge: true,
          archiveDirectory: 'some archive directory 2',
          dataStoreType: DataStoreType.LONG_TERM,
          dataStoreLocation: 'some data store location 2',
          dataStoreSize: 107374182400,
        },
      ],
    },
  },
});
