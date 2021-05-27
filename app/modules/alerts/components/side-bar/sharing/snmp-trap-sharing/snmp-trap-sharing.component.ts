import {Component, Input, OnChanges, Self, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormControl, NgControl} from '@angular/forms';
import {SyslogCourier} from '../../../../services/couriers/models/syslog-courier';
import {CommonService} from '../../../../../../utils/common/common.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {map} from 'rxjs/operators';
import { TOOLTIP_ALIGNMENT_ENUM } from '../../../../../shared/components/tooltip/enum/tooltip-alignment.enum';
import {SnmpTrapCourier} from '../../../../services/couriers/models/snmp-trap-courier';

@UntilDestroy()
@Component({
  selector: 'nx-snmp-trap-sharing',
  templateUrl: './snmp-trap-sharing.component.html',
  styleUrls: ['./snmp-trap-sharing.component.less']
})
export class SnmpTrapSharingComponent implements ControlValueAccessor, OnChanges {
  @Input() isConfigured: boolean;

  readonly configureUrl = '/system-management-configuration?tabGroupId=snmpTrap&tabId=snmpTrap';

  displayName: string;

  snmpTrapCourier: SyslogCourier;
  snmpTrapEnabled: FormControl;

  showTooltip = false;
  TOOLTIP_ALIGNMENT = TOOLTIP_ALIGNMENT_ENUM;

  onTouched: () => void;

  constructor(@Self() public controlDir: NgControl,
              private fb: FormBuilder,
              private commonService: CommonService) {
    controlDir.valueAccessor = this;
    this.snmpTrapEnabled = this.fb.control({value: false});
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.isConfigured?.currentValue != null) {
      changes.isConfigured.currentValue ?
        this.snmpTrapEnabled.enable({emitEvent: false, onlySelf: true}) :
        this.snmpTrapEnabled.disable({emitEvent: false, onlySelf: true});
    }
  }

  writeValue(obj: SnmpTrapCourier) {
    if (!this.commonService.isNil((obj))) {
      this.displayName = obj.displayName;
      this.snmpTrapCourier = obj;
      this.snmpTrapEnabled.patchValue(obj.enabled);
    }
  }

  registerOnChange(fn: (updates: SnmpTrapCourier) => void) {
    this.snmpTrapEnabled.valueChanges
      .pipe(
        untilDestroyed(this),
        map((enabled: boolean): SnmpTrapCourier => {
          return new SnmpTrapCourier(
            {
              id: this.snmpTrapCourier.id,
              scope: this.snmpTrapCourier.scope,
              enabled: enabled
            }
          );
        })
      )
      .subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.snmpTrapEnabled.disable({emitEvent: false, onlySelf: true}) :
      this.snmpTrapEnabled.enable({emitEvent: false, onlySelf: true});
  }
}
