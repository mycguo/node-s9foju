import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {ReportInfoValue} from '../../../reporting/models/report-info';
import ReportCategoryParameter from '../../../reporting/models/api/parameter-enums/report-category-parameter';
import {DeviceEntityPageReport} from '../../services/device-entity-page-reports/models/device-entity-page-report';
import AvailableParameter from '../../../reporting/models/available-parameter';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {debounceTime} from 'rxjs/operators';
import {Size} from '../../../shared/enums/size';
import {DeviceEntityPageReportsService} from '../../services/device-entity-page-reports/device-entity-page-reports.service';
import {guid} from '@datorama/akita';

interface SelectableReport {
  id: string;
  reportCategory: ReportCategoryParameter;
  selectableParameters: Array<string>;
}

@UntilDestroy()
@Component({
  selector: 'nx-device-entity-page-reports',
  templateUrl: './device-entity-page-reports.component.html',
  styleUrls: ['./device-entity-page-reports.component.less']
})
export class DeviceEntityPageReportsComponent implements OnInit, OnChanges {
  readonly reportsKey = 'reports';

  @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() reports: Array<ReportInfoValue>;
  @Input() configuredReports: Array<DeviceEntityPageReport>;
  @Output() saveClicked = new EventEmitter<Array<DeviceEntityPageReport>>();

  readonly selectableReports: Array<SelectableReport> = [
    // Device CPU/Memory Usage
    {id: '14', reportCategory: ReportCategoryParameter.QOS, selectableParameters: ['executionType']},
    // Top Applications
    {id: '8', reportCategory: ReportCategoryParameter.FLOW, selectableParameters: ['executionType', 'direction']},
    // Top DSCP
    {id: '14', reportCategory: ReportCategoryParameter.FLOW, selectableParameters: ['executionType', 'direction']},
    // Top Conversations
    {id: '5', reportCategory: ReportCategoryParameter.FLOW, selectableParameters: ['executionType', 'direction']},
    // Custom OID
    {id: '40', reportCategory: ReportCategoryParameter.QOS, selectableParameters: ['executionType', 'customOidConfig']},
    // Power Supply Operational State
    {id: '59', reportCategory: ReportCategoryParameter.QOS, selectableParameters: ['executionType']},
    // Fan Tray Operational State
    {id: '60', reportCategory: ReportCategoryParameter.QOS, selectableParameters: ['executionType']},
    // HSRP Standby State
    {id: '62', reportCategory: ReportCategoryParameter.QOS, selectableParameters: ['executionType']},
    // VRRP Operational State
    {id: '63', reportCategory: ReportCategoryParameter.QOS, selectableParameters: ['executionType']},
    // BGP Peer State
    {id: '64', reportCategory: ReportCategoryParameter.QOS, selectableParameters: ['executionType']},
    // QFP Throughput Level
    {id: '65', reportCategory: ReportCategoryParameter.QOS, selectableParameters: ['executionType']},
    // Line Card Operational State
    {id: '66', reportCategory: ReportCategoryParameter.QOS, selectableParameters: ['executionType']},
  ];

  formGroup: FormGroup;
  reportOptions: Array<ReportInfoValue>; // filtered report list
  defaultAlerts: Array<DeviceEntityPageReport>;
  isResetDisabled: boolean;
  CARD_SIZE = Size.LG;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({[this.reportsKey]: this.fb.control([])});
    this.reportOptions = [];
    this.defaultAlerts = DeviceEntityPageReportsService.DEFAULT_REPORTS.map((rpt: DeviceEntityPageReport) => {
      return {
        ...rpt,
        id: guid()
      };
    });
  }

  ngOnInit(): void {
    this.formGroup.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(200)
      ).subscribe((formGroupValue) => {
      this.isResetDisabled = this.reportListMatchesDefault(formGroupValue[this.reportsKey]);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.reports?.currentValue != null) {
      this.reportOptions = this.filterReports(changes.reports.currentValue);
    }
    if (changes?.configuredReports?.currentValue != null) {
      const configuredReports: Array<DeviceEntityPageReport> = changes.configuredReports.currentValue;
      this.formGroup.reset({[this.reportsKey]: configuredReports});
      this.formGroup.enable();
      this.isResetDisabled = this.reportListMatchesDefault(configuredReports);
    }
  }

  save(): void {
    this.formGroup.disable();
    this.saveClicked.emit(this.formGroup.get(this.reportsKey).value);
  }

  resetToDefault(): void {
    this.formGroup.setValue({
      [this.reportsKey]: this.defaultAlerts
    });
    this.formGroup.markAsDirty();
  }

  private filterReports(reports: Array<ReportInfoValue>): Array<ReportInfoValue> {
    return reports.map((report: ReportInfoValue) => {
      const selectableReport = this.selectableReports.find((rpt: SelectableReport) => {
        return rpt.id === report.id && rpt.reportCategory === report.reportCategory;
      });
      if (selectableReport == null) {
        return void 0;
      } else {
        return {
          ...report,
          availableParameters: report.availableParameters
            .filter((param: AvailableParameter) => {
              return selectableReport.selectableParameters.some((selectableParameter: string) => {
                return selectableParameter === param.queryKey;
              });
            })
        } as ReportInfoValue;
      }
    })
      .filter((report: ReportInfoValue) => {
        return report != null && !report.isRestrictedReport;
      });
  }

  /**
   * Checks if list matches default
   */
  reportListMatchesDefault(reports: Array<DeviceEntityPageReport>): boolean {
    const defaultReports = DeviceEntityPageReportsService.DEFAULT_REPORTS;
    if (reports.length !== defaultReports.length) {
      return false;
    } else {
      let matches = true;
      // checks every element exists in default list
      reports.forEach((rpt: DeviceEntityPageReport, index: number) => {
        const removedIdRpt = {
          reportId: rpt.reportId,
          reportName: rpt.reportName,
          parameters: rpt.parameters
        } as DeviceEntityPageReport;
        // match order and values
        if (JSON.stringify(defaultReports[index]) !== JSON.stringify(removedIdRpt)) {
          matches = false;
        }
      });
      return matches;
    }

  }
}
