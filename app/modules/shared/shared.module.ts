import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedRoutingModule} from './shared-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {NgOptionHighlightModule} from '@ng-select/ng-option-highlight';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {LeafletMarkerClusterModule} from '@asymmetrik/ngx-leaflet-markercluster';
import { CdkTreeModule } from '@angular/cdk/tree';
import {ClipboardModule} from '@angular/cdk/clipboard';

// Directives
import {FileUploaderDirective} from './directives/file-uploader/file-uploader.directive';
import {ClickOutsideDirective} from './directives/click-outside.directive';
import {KeyValueListItemDirective} from './components/key-value-list/key-value-list-item/key-value-list-item.directive';
import {AutocompleteScrollDirective} from './components/chip-set-multiselect/directives/autocomplete-scroll.directive';

// Pipes
import {TimeAgoPipe} from './pipes/time-ago/time-ago.pipe';
import {ByteFormattingPipe} from './pipes/byte-formatting/byte-formatting.pipe';
import {FileExtension} from './pipes/file-name/file-name.pipe';
import {RequestErrorsSimpleAlertPipe} from './pipes/request-errors-simple-alert/request-errors-simple-alert.pipe';
import {RequestErrorsNotificationPipe} from './pipes/request-errors-notification/request-errors-notification.pipe';
import {IntegrationStatusPipe} from './pipes/integration-status/integration-status.pipe';
import {RequestErrorsNoDataPipe} from './pipes/request-errors-no-data/request-errors-no-data.pipe';
import {HighlightPipe} from './pipes/highlight/highlight.pipe';
import { EscapeSpecialCharsPipe } from './pipes/escape-special-chars/escape-special-chars.pipe';


// Components
import {ButtonComponent} from './components/button/button.component';
import {CustomTextToggleComponent} from './components/custom-text-toggle/custom-text-toggle.component';
import {CheckboxComponent} from './components/form/checkbox/checkbox.component';
import {InfoBtnComponent} from './components/info-btn/info-btn.component';
import {LaSwitcherListComponent} from './components/la-switcher-list/la-switcher-list.component';
import {TooltipComponent} from './components/tooltip/tooltip.component';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {NoDataMessageComponent} from './components/no-data-message/no-data-message.component';
import {CardComponent} from './components/card/card.component';
import {OldSortableListComponent} from './components/old-sortable-list/old-sortable-list.component';
import {SimpleAlertComponent} from './components/simple-alert/simple-alert.component';
import {TextButtonComponent} from './components/text-button/text-button.component';
import {TextButtonListDirective} from './directives/text-button-list/text-button-list.directive';
import {ButtonListDirective} from './directives/button-list/button-list.directive';
import {KeyValueListComponent} from './components/key-value-list/key-value-list.component';
import {StatusIndicatorComponent} from './components/status-indicator/status-indicator.component';
import {SimpleInputComponent} from './components/form/simple-input/simple-input.component';
import {FormFieldComponent} from './components/form/form-field/form-field.component';
import {FileUploaderComponent} from './components/form/file-uploader/file-uploader.component';
import {ProgressBarComponent} from './components/progress-bar/progress-bar.component';
import {SeverityIndicatorComponent} from './components/severity-indicator/severity-indicator.component';
import {ToggleComponent} from './components/form/toggle/toggle.component';
import {SelectComponent} from './components/form/select/select.component';
import {RadioGroupComponent} from './components/form/radio-group/radio-group.component';
import {FormRadioGroupComponent} from './components/form/form-radio-group/form-radio-group.component';
import {LabeledCardComponent} from './components/labeled-card/labeled-card.component';
import {ModalContainerComponent} from './components/modal-container/modal-container.component';
import {DropdownComponent} from './components/dropdown/dropdown.component';
import {TitleBarComponent} from './components/title-bar/title-bar.component';
import {ColComponent} from './components/col/col.component';
import {RowComponent} from './components/row/row.component';
import {SectionComponent} from './components/section/section.component';
import {ConfirmDialogComponent} from './components/confirm-dialog/confirm-dialog.component';
import {SidebarDisplayComponent} from './components/sidebar-display/sidebar-display.component';
import {ChartWidgetComponent} from './components/chart-widget/chart-widget.component';
import {TimeSeriesChartComponent} from './components/charts/time-series-chart/time-series-chart.component';
import {HorizontalLegendComponent} from './components/charts/horizontal-legend/horizontal-legend.component';
import {TabsetComponent} from './components/tabset/tabset.component';
import {TabDirective} from './directives/tab/tab.directive';
import {SkeletonScreenComponent} from './components/skeleton-screen/skeleton-screen.component';
import {TextLoaderComponent} from './components/text-loader/text-loader.component';
import {ChipListDirective} from './directives/chip-list/chip-list.directive';
import {ChipComponent} from './components/chip/chip.component';
import {LoadingComponent} from './components/loading/loading.component';
import {FormFieldControlDirective} from './directives/form-field-control/form-field-control.directive';
import {NotificationLabelComponent} from './components/notification-label/notification-label.component';
import {ProgressIndicatorComponent} from './components/progress-indicator/progress-indicator.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {UnitFormatterPipe} from './pipes/unit-formatter/unit-formatter.pipe';
import {TextareaComponent} from './components/form/textarea/textarea.component';
import {MatInputModule} from '@angular/material/input';
import {ChipSetComponent} from './components/chip-set/chip-set.component';
import {ChipSetMultiselectComponent} from './components/chip-set-multiselect/chip-set-multiselect.component';
import {StackedBarTimeSeriesChartComponent} from './components/charts/stacked-bar-time-series-chart/stacked-bar-time-series-chart.component';
import {MapWidgetComponent} from './components/map-widget/map-widget.component';
import {DialogComponent} from './components/dialog/dialog.component';
import {ToggleInputComponent} from './components/form/toggle-input/toggle-input.component';
import {RequestErrorsDetailedErrorPipe} from './pipes/request-errors-detailed-error/request-errors-detailed-error.pipe';
import {TextDrillDownComponent} from './components/text-drill-down/text-drill-down.component';
import {UpdatingDataMessageComponent} from './components/updating-data-message/updating-data-message.component';
import {UpperFirstPipe} from './pipes/upper-first/upper-first.pipe';
import {PopUpComponent} from './components/pop-up/pop-up.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {SwitcherComponent} from './components/form/switcher/switcher.component';
import {ChipsInputMultiselectComponent} from './components/form/chips-input/chips-input-multiselect/chips-input-multiselect.component';
import {ChipsInputTextComponent} from './components/form/chips-input/chips-input-text/chips-input-text.component';
import {SortableListComponent} from './components/sortable-list/sortable-list.component';
import { ReportAccordionSelectComponent } from './components/report-accordion-select/report-accordion-select.component';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { HeatmapChartComponent } from './components/charts/heatmap-chart/heatmap-chart.component';
import { SnmpCredentialsComponent } from './components/snmp-credentials/snmp-credentials.component';
import { SelectableTreeComponent } from './components/selectable-tree/selectable-tree.component';
import {CopyInputComponent} from './components/form/copy-input/copy-input.component';
import { FileInputComponent } from './components/form/file-input/file-input.component';
import { PasswordInputComponent } from './components/form/password-input/password-input.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgOptionHighlightModule,
    MatButtonModule,
    MatDialogModule,
    DragDropModule,
    MatMenuModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTabsModule,
    MatInputModule,
    LeafletModule,
    LeafletMarkerClusterModule,
    OverlayModule,
    MatExpansionModule,
    CdkAccordionModule,
    CdkTreeModule,
    ClipboardModule,
  ],
  declarations: [
    CheckboxComponent,
    InfoBtnComponent,
    SelectComponent,
    LaSwitcherListComponent,
    TooltipComponent,
    ClickOutsideDirective,
    TimeAgoPipe,
    ButtonComponent,
    CustomTextToggleComponent,
    SpinnerComponent,
    NoDataMessageComponent,
    FileUploaderDirective,
    CardComponent,
    OldSortableListComponent,
    ByteFormattingPipe,
    SimpleAlertComponent,
    TextButtonComponent,
    TextButtonListDirective,
    ButtonListDirective,
    KeyValueListComponent,
    StatusIndicatorComponent,
    KeyValueListItemDirective,
    SimpleInputComponent,
    FormFieldComponent,
    FileUploaderComponent,
    FileExtension,
    ProgressBarComponent,
    SeverityIndicatorComponent,
    ToggleComponent,
    RadioGroupComponent,
    FormRadioGroupComponent,
    LabeledCardComponent,
    ModalContainerComponent,
    DropdownComponent,
    TitleBarComponent,
    RequestErrorsSimpleAlertPipe,
    TitleBarComponent,
    ColComponent,
    RowComponent,
    SectionComponent,
    RequestErrorsNotificationPipe,
    ConfirmDialogComponent,
    SidebarDisplayComponent,
    ChartWidgetComponent,
    TimeSeriesChartComponent,
    HorizontalLegendComponent,
    TabsetComponent,
    TabDirective,
    SkeletonScreenComponent,
    TextLoaderComponent,
    ChipComponent,
    LoadingComponent,
    FormFieldControlDirective,
    IntegrationStatusPipe,
    RequestErrorsNoDataPipe,
    NotificationLabelComponent,
    ChipSetComponent,
    ChipSetMultiselectComponent,
    ChipsInputTextComponent,
    ChipsInputMultiselectComponent,
    ChipListDirective,
    ProgressIndicatorComponent,
    UnitFormatterPipe,
    TextareaComponent,
    StackedBarTimeSeriesChartComponent,
    MapWidgetComponent,
    DialogComponent,
    HighlightPipe,
    AutocompleteScrollDirective,
    ToggleInputComponent,
    RequestErrorsDetailedErrorPipe,
    TextDrillDownComponent,
    UpdatingDataMessageComponent,
    UpperFirstPipe,
    PopUpComponent,
    SwitcherComponent,
    EscapeSpecialCharsPipe,
    HeatmapChartComponent,
    SortableListComponent,
    ReportAccordionSelectComponent,
    SnmpCredentialsComponent,
    SelectableTreeComponent,
    CopyInputComponent,
    FileInputComponent,
    PasswordInputComponent,
  ],
  exports: [
    ClickOutsideDirective,
    ColComponent,
    DropdownComponent,
    RowComponent,
    TextareaComponent,
    TimeAgoPipe,
    CustomTextToggleComponent,
    SpinnerComponent,
    ButtonComponent,
    NoDataMessageComponent,
    CardComponent,
    ByteFormattingPipe,
    OldSortableListComponent,
    SimpleAlertComponent,
    CheckboxComponent,
    InfoBtnComponent,
    FileUploaderDirective,
    TextButtonComponent,
    TextButtonListDirective,
    ButtonListDirective,
    KeyValueListComponent,
    StatusIndicatorComponent,
    KeyValueListItemDirective,
    PopUpComponent,
    SimpleInputComponent,
    FormFieldComponent,
    FileUploaderComponent,
    FileExtension,
    ProgressBarComponent,
    SeverityIndicatorComponent,
    ToggleComponent,
    SelectComponent,
    RadioGroupComponent,
    FormRadioGroupComponent,
    LabeledCardComponent,
    ModalContainerComponent,
    TitleBarComponent,
    RequestErrorsSimpleAlertPipe,
    SidebarDisplayComponent,
    ConfirmDialogComponent,
    ChartWidgetComponent,
    RequestErrorsNotificationPipe,
    SectionComponent,
    TimeSeriesChartComponent,
    HorizontalLegendComponent,
    TabsetComponent,
    TabDirective,
    SkeletonScreenComponent,
    TextLoaderComponent,
    LoadingComponent,
    IntegrationStatusPipe,
    RequestErrorsNoDataPipe,
    NotificationLabelComponent,
    ChipComponent,
    ChipSetComponent,
    ChipSetMultiselectComponent,
    ChipsInputMultiselectComponent,
    ChipsInputTextComponent,
    ChipListDirective,
    ProgressIndicatorComponent,
    HighlightPipe,
    FormFieldControlDirective,
    MapWidgetComponent,
    UnitFormatterPipe,
    HighlightPipe,
    StackedBarTimeSeriesChartComponent,
    AutocompleteScrollDirective,
    ToggleInputComponent,
    RequestErrorsDetailedErrorPipe,
    TextDrillDownComponent,
    UpdatingDataMessageComponent,
    UpperFirstPipe,
    SwitcherComponent,
    TooltipComponent,
    EscapeSpecialCharsPipe,
    SortableListComponent,
    SnmpCredentialsComponent,
    SelectableTreeComponent,
    ReportAccordionSelectComponent,
    CopyInputComponent,
    FileInputComponent,
    PasswordInputComponent,
  ],
  providers: [
    ByteFormattingPipe,
    UpperFirstPipe,
    EscapeSpecialCharsPipe,
  ]
})
export class SharedModule {
}
