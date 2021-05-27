import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {SharedModule} from '../shared/shared.module';
import {FilterChipListComponent} from './components/filter-chip-list/filter-chip-list.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { FilterInputComponent } from './components/filter-input/filter-input.component';
import { FilterComponent } from './components/filter/filter.component';



@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatMenuModule,
        MatTooltipModule,
        MatProgressBarModule,
        ClipboardModule
    ],
  declarations: [
    FilterChipListComponent,
    FilterInputComponent,
    FilterComponent,
  ],
  exports: [
    FilterComponent,
    FilterInputComponent
  ]
})
export class FilterModule { }
