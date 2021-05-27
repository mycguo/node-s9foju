import {Meta, moduleMetadata} from '@storybook/angular';
import {
  DataSourceManagementCardComponent
} from './data-source-management-card.component';
import {SharedModule} from '../../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import LaFilterSupportEnums from '../../../../../../../project_typings/enums/laFilterSupportEnums';
import {ReactiveFormsModule} from '@angular/forms';
import {FilterModule} from '../../../filter/filter.module';
import {action} from '@storybook/addon-actions';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

export default {
  title: 'Settings/DataSourceManagementCardComponent',
  component: DataSourceManagementCardComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SharedModule,
        FilterModule,
        HttpClientModule,
        LoggerTestingModule,
        ReactiveFormsModule
      ],
      declarations: [
        DataSourceManagementCardComponent
      ]
    })
  ]
} as Meta;

export const Default = () => ({
  component: DataSourceManagementCardComponent,
  props: {
    filterValue: { [LaFilterSupportEnums.FLEX_STRING]: ['wan | xcon'] },
    apply: (value: {[key: string]: Array<string>}) => {
      // Actions not working correctly, cannot expand to view value
      console.log('Data source %j', value);
      action('Data source value')(value);
    }
  }
});
