import { Meta, moduleMetadata } from '@storybook/angular';
import { ReportsAccessManagementComponent } from './reports-access-management.component';
import { SharedModule } from '../../../shared/shared.module';
import { action } from '@storybook/addon-actions';
import { ReactiveFormsModule } from '@angular/forms';
import REPORTS_LIST from '../../../shared/components/selectable-tree/reports-list.fixtures';

export default {
  title: 'Settings/ReportsAccessManagementComponent',

  decorators: [
    moduleMetadata({
      imports: [
        SharedModule,
        ReactiveFormsModule
      ],
      declarations: [
        ReportsAccessManagementComponent,
      ],
    }),
  ],
}  as Meta;

let treeData = REPORTS_LIST;

export const Default = () => {
  return {
    props: {
      handleSubmit: () => {
        action('submitting')();
      },
      handleSelectAll: () => {
        action('select all')();
      },
      handleUnselectAll: () => {
        action('unselect all')();
      },
      handleTreeSelect: (nodes) => {
        action('tree select')(nodes);
      },
      handleSearch: (string) => {
         treeData = REPORTS_LIST.filter((report) => report.name.toLowerCase().includes(string.toLowerCase()));
      },
      getTreeData: () => treeData
    },
    template: `
      <nx-reports-access-management
        [treeData]="getTreeData()"
        [expandTree]="false"
        (searchChange)="handleSearch($event)"
        (treeSelect)="handleTreeSelect($event)"
        (selectAll)="handleSelectAll()"
        (unselectAll)="handleUnselectAll()"
        (submit)="handleSubmit()"
      ></nx-reports-access-management>
    `,
  };
};
