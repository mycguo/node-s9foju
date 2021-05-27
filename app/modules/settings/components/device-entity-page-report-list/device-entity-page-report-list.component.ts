import {
  Component,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  Self,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NgControl,
  ValidationErrors
} from '@angular/forms';
import { SortableDeviceEntityPageReport } from './sortable-device-entity-page-report';
import { DeviceEntityPageReport } from '../../services/device-entity-page-reports/models/device-entity-page-report';
import { ReportInfoValue } from '../../../reporting/models/report-info';
import { SimpleInputModel } from '../../../shared/components/form/simple-input/models/simple-input.model';
import HtmlInputTypesEnum from '../../../shared/components/form/simple-input/models/html-input-types.enum';
import { ReportInfoService } from '../../../reporting/services/report-info/report-info.service';
import { guid } from '@datorama/akita';
import ReportRequestParameters from '../../../reporting/models/api/request/sub/report-request-parameters';
import AvailableParameter from '../../../reporting/models/available-parameter';
import { ReportTreeType } from '../../../shared/components/report-accordion-select/models/report-tree-type';
import { CustomReportTreeGroup } from '../../../reporting/services/report-info/models/custom-report-tree-group';
import ReportCategoryParameter from '../../../reporting/models/api/parameter-enums/report-category-parameter';
import { switchSlideAnimation } from '../../../../animations/switch-slide.animation';
import { switchFadeAnimation } from '../../../../animations/switch-fade.animation';
import { CvaUtils } from '../../../../utils/cva-utils/cva-utils';
import { debounceTime, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {DeviceEntityPageFormComponent} from '../device-entity-page-form/device-entity-page-form.component';

@Component({
  selector: 'nx-device-entity-page-report-list',
  templateUrl: './device-entity-page-report-list.component.html',
  styleUrls: ['./device-entity-page-report-list.component.less'],
  animations: [switchSlideAnimation, switchFadeAnimation]
})
export class DeviceEntityPageReportListComponent implements OnChanges, OnInit, ControlValueAccessor {
  @Input() reportOptions: Array<ReportInfoValue> = [];
  @ViewChildren(DeviceEntityPageFormComponent) entityForms: QueryList<DeviceEntityPageFormComponent>;

  readonly NEW_REPORT_ID = null;
  activeId: string;
  disabled: boolean;
  reportSearch$: Observable<string>;
  searchInputModel: SimpleInputModel;
  filteredReportTree: Array<ReportTreeType>;
  configuredReports: Array<SortableDeviceEntityPageReport>;
  reportOptionsMap: { [key: string]: ReportInfoValue };
  searchControl: FormControl;

  private reportTree: Array<ReportTreeType>;

  onTouch = () => void 0;
  onChange = (updateList: Array<DeviceEntityPageReport>) => void 0;

  constructor(@Self() public controlDir: NgControl,
              private fb: FormBuilder,
              private reportInfoService: ReportInfoService) {
    controlDir.valueAccessor = this;
    this.searchInputModel = new SimpleInputModel(HtmlInputTypesEnum.search, void 0, 'Search');
    this.searchControl = new FormControl();
    this.reportSearch$ = this.searchControl.valueChanges
      .pipe(
        debounceTime(250),
        map(searchValue => searchValue?.trim()),
        tap((searchValue) => {
          this.searchReports(searchValue);
        })
      );
    this.reportTree = [];
    this.filteredReportTree = [];
    this.configuredReports = [];
    this.reportOptionsMap = {};
  }

  get control() {
    return this.controlDir?.control;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.reportOptions?.currentValue != null) {
      const reportOptions: Array<ReportInfoValue> = changes.reportOptions.currentValue;
      const defaultReports: CustomReportTreeGroup = {
        groupName: 'Default Reports',
        reportIds: [
          {id: '14', category: ReportCategoryParameter.QOS}, // Device CPU/Memory Usage
          {id: '8', category: ReportCategoryParameter.FLOW}, // Top Applications
          {id: '14', category: ReportCategoryParameter.FLOW}, // Top DSCP
          {id: '5', category: ReportCategoryParameter.FLOW}, // Top Conversations
        ]
      };
      this.reportTree = this.reportInfoService.reportsToTree(reportOptions, defaultReports);
      this.filteredReportTree = this.reportTree;

      this.reportOptionsMap = this.buildReportOptionsMapping(this.configuredReports, this.reportOptions);
    }
  }

  ngOnInit() {
    this.control.setValidators(this.formValidation.bind(this));
  }

  writeValue(obj: Array<DeviceEntityPageReport>): void {
    if (obj == null) {
      return;
    }
    this.configuredReports = <Array<SortableDeviceEntityPageReport>>obj;
    this.reportOptionsMap = this.buildReportOptionsMapping(this.configuredReports, this.reportOptions);
    // assign activeId if not initiated or no longer exits
    const activeIdExists = obj.find((i) => i.id === this.activeId);
    if ((this.activeId == null && obj.length > 0) || activeIdExists == null) {
      this.activeId = obj[0]?.id ?? this.NEW_REPORT_ID;
    }
  }

  registerOnChange(fn: (updateList: Array<DeviceEntityPageReport>) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  changeHandler(): void {
    this.onChange(this.configuredReports);
  }

  sortChange(newlySortedList: Array<SortableDeviceEntityPageReport>): void {
    if (newlySortedList == null) {
      return;
    }
    this.configuredReports = newlySortedList;
    this.changeHandler();
    this.onTouch();
  }

  addReport(report: ReportInfoValue): void {
    if (report == null) {
      return;
    }
    const id = guid();
    this.reportOptionsMap[id] = report;
    this.configuredReports.push({
      id: id,
      reportId: {id: report.id, category: report.reportCategory},
      reportName: report.name,
      parameters: this.buildParameters(report.availableParameters)
    } as SortableDeviceEntityPageReport);
    this.activeId = id;
    this.searchControl.reset();
    this.changeHandler();
  }

  deleteReport(index: number) {
    if (index == null) {
      return;
    }
    const removedId: string = this.configuredReports[index]?.id;
    delete this.reportOptionsMap[removedId];
    this.configuredReports.splice(index, 1);
    // update activeId if it's item being removed
    if (removedId === this.activeId) {
      this.activeId = this.configuredReports.length > 0 ? this.configuredReports[0].id : null;
    }
    const deletedEntityForm: DeviceEntityPageFormComponent = this.entityForms.find((item: DeviceEntityPageFormComponent) => {
      return item.deviceEntityPageReport.id === removedId;
    });
    deletedEntityForm?.control.setErrors(null);
    this.changeHandler();
    this.onTouch();
  }

  clickHandler(item: SortableDeviceEntityPageReport): void {
    if (item == null) {
      return;
    }
    this.activeId = item.id;
  }

  searchReports(searchString: string): void {
    this.filteredReportTree = this.reportInfoService.searchReportTree(this.reportTree, searchString);
  }

  private buildReportOptionsMapping(
    configuredReports: Array<SortableDeviceEntityPageReport> = [],
    reportOptions: Array<ReportInfoValue> = []): { [key: string]: ReportInfoValue } {

    const reportOptionsMap: { [key: string]: ReportInfoValue } = {};
    configuredReports.forEach((configRpt: SortableDeviceEntityPageReport) => {
      const foundReport = reportOptions.find((rpt: ReportInfoValue) => {
        return configRpt.reportId.category === rpt.reportCategory && configRpt.reportId.id.toString() === rpt.id.toString();
      });
      if (foundReport != null) {
        reportOptionsMap[configRpt.id] = foundReport;
      }
    });
    return reportOptionsMap;
  }

  /**
   * Builds ReportRequestParameters when adding new report
   */
  private buildParameters(availableParameters: AvailableParameter[] = []): ReportRequestParameters {
    const params = {};
    availableParameters.forEach((param: AvailableParameter) => {
      params[param.queryKey] = param.defaultValue?.apiValue;
    });
    return params;
  }

  private formValidation(control: AbstractControl): ValidationErrors | null {
    // const errors = CvaUtils.extractControlErrors(this.formGroup?.form?.controls);
    const controls = this.entityForms.reduce((prevValue, curValueitem: DeviceEntityPageFormComponent, curIndex: number) => {
      prevValue[curIndex.toString(10)] = curValueitem.control;
      return prevValue;
    }, {});
    return CvaUtils.extractControlErrors(controls);
  }
}
