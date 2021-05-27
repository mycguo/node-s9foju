import { moduleMetadata } from '@storybook/angular';
import { SimpleInputModel } from '../form/simple-input/models/simple-input.model';
import { Component } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import HtmlInputTypesEnum from '../form/simple-input/models/html-input-types.enum';
import { SharedModule } from '../../shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import REPORTS_LIST from './reports-list.fixtures';
import { action } from '@storybook/addon-actions';

@Component({
  selector: 'nx-report-tree-select-stories',
  template: `
    <nx-simple-input
      style="padding-bottom: 16px"
      [formControl]="formControl"
      [inputModel]="inputModel">
    </nx-simple-input>
    <nx-report-accordion-select
      style="flex-grow: 1; overflow-y: auto;"
      [dataSource]="dataSource"
      [isExpanded]="searchString?.length > 0"
      (selectedReport)="selectReport($event)"
    ></nx-report-accordion-select>
  `,
  styles: [':host {display: flex; flex-direction: column; height: 90vh;}']
})

// @ts-ignore
class ReportTreeSelectStories {
  dataSource: any;

  searchString: string;
  formControl: FormControl;
  inputModel: SimpleInputModel;

  constructor() {
    this.searchString = '';
    this.dataSource = REPORTS_LIST;
    this.inputModel = new SimpleInputModel(
      HtmlInputTypesEnum.search,
      void 0,
      'Search'
    );

    this.formControl = new FormControl();
    this.formControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe((search) => {
        this.searchString = search;
        this.dataSource = REPORTS_LIST.filter((report) =>
          report.name.toLowerCase().includes(search.toLowerCase())
        );
      });
  }

  selectReport(selectedReport: any) {
    action('selectedReport')(selectedReport);
  }
}

export default {
  title: 'Shared/ReportAccordionSelectComponent',

  decorators: [
    moduleMetadata({
      imports: [MatExpansionModule, ReactiveFormsModule, SharedModule],
    }),
  ],
};

export const Default = () => ({
  component: ReportTreeSelectStories,
});

Default.story = {
  name: 'default',
};
