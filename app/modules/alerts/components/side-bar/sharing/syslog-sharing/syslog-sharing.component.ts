import {Component, Input, OnChanges, Self, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormControl, NgControl} from '@angular/forms';
import {SyslogCourier} from '../../../../services/couriers/models/syslog-courier';
import {CommonService} from '../../../../../../utils/common/common.service';
import {ServiceNowCourier} from '../../../../services/couriers/models/service-now-courier';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {map} from 'rxjs/operators';
import {TOOLTIP_ALIGNMENT_ENUM} from '../../../../../shared/components/tooltip/enum/tooltip-alignment.enum';

@UntilDestroy()
@Component({
  selector: 'nx-syslog-sharing',
  templateUrl: './syslog-sharing.component.html',
  styleUrls: ['./syslog-sharing.component.less']
})
export class SyslogSharingComponent implements ControlValueAccessor, OnChanges {
  @Input() isConfigured: boolean;

  readonly configureUrl = '/system-management-configuration?tabGroupId=syslog&tabId=syslog';

  displayName: string;

  syslogCourier: SyslogCourier;
  syslogEnabled: FormControl;

  showTooltip = false;
  TOOLTIP_ALIGNMENT = TOOLTIP_ALIGNMENT_ENUM;

  onTouched: () => void;

  constructor(@Self() public controlDir: NgControl,
              private fb: FormBuilder,
              private commonService: CommonService) {
    controlDir.valueAccessor = this;
    this.syslogEnabled = this.fb.control({value: false});
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.commonService.isNil(changes?.isConfigured?.currentValue)) {
      changes.isConfigured.currentValue ?
        this.syslogEnabled.enable({emitEvent: false, onlySelf: true}) :
        this.syslogEnabled.disable({emitEvent: false, onlySelf: true});
    }
  }

  writeValue(obj: ServiceNowCourier) {
    if (!this.commonService.isNil((obj))) {
      this.displayName = obj.displayName;
      this.syslogCourier = obj;
      this.syslogEnabled.patchValue(obj.enabled);
    }
  }

  registerOnChange(fn: (updates: ServiceNowCourier) => void) {
    this.syslogEnabled.valueChanges
      .pipe(
        untilDestroyed(this),
        map((enabled: boolean): SyslogCourier => {
          return new SyslogCourier({
            id: this.syslogCourier.id,
            scope: this.syslogCourier.scope,
            enabled: enabled
          });
        })
      )
      .subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.syslogEnabled.disable({emitEvent: false, onlySelf: true}) :
      this.syslogEnabled.enable({emitEvent: false, onlySelf: true});
  }
}
