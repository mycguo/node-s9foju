import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {animate, animateChild, group, query, stagger, style, transition, trigger} from '@angular/animations';
import { MatDrawer } from '@angular/material/sidenav';
import {FormControl} from '@angular/forms';
import {SelectInput} from '../../../shared/components/form/select/models/select-input';
import {SelectOption} from '../../../shared/components/form/select/models/select-option';
import {LaNoDataMessage} from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';
import {StatusAlertsService} from '../../services/status-alerts/status-alerts.service';
import AlertsLimit from './interfaces/alerts-limit';
import StatusAlertItem from '../status-alerts-item/interfaces/status-alert-item';
import StatusAlertsSeverity from './enums/status-alerts-severity';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import DetailedError from '../../../shared/components/loading/detailed-error';

@UntilDestroy()
@Component({
  selector: 'nx-status-alerts',
  templateUrl: './status-alerts.component.html',
  styleUrls: ['./status-alerts.component.less'],
  animations: [
    trigger('list', [
      transition(':enter', [
        query('@items',
          stagger(100, animateChild()),
          { optional: true }
        )
      ]),
    ]),
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0.7)', opacity: 0, height: 0 }),
        group([
          animate('.1s cubic-bezier(.8,-0.6,0.2,1.5)',
            style({ transform: 'scale(1)', height: '*' })),
          animate('.3s cubic-bezier(.8,-0.6,0.2,1.5)',
            style({ opacity: 1 }))
        ])
      ]),
    ]),
  ],
})

export class StatusAlertsComponent implements OnInit, OnDestroy {

  details: StatusAlertItem;
  formControl: FormControl;
  selectModel: SelectInput;

  @ViewChild('drawer', { static: true }) drawer: MatDrawer;
  @Input() alerts: StatusAlertItem[];
  @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() fatalMessageOverride: LaNoDataMessage;
  @Input() alertsLimit: AlertsLimit;
  @Output() closeDrawer = new EventEmitter<void>();
  @Output() changeFilter = new EventEmitter<string>();

  constructor(
    public cd: ChangeDetectorRef,
    private statusAlertsService: StatusAlertsService
  ) {
  }

  ngOnInit(): void {
    const selectOptions: SelectOption[] = Object.keys(StatusAlertsSeverity).map(type => (
      {id: type, name: StatusAlertsSeverity[type]}
      ));
    this.selectModel = new SelectInput(selectOptions);

    this.formControl = new FormControl(selectOptions[0].id);
    this.formControl.valueChanges.pipe(untilDestroyed(this)).subscribe((filterId: string) => {
      this.changeFilter.emit(StatusAlertsSeverity[filterId]);
    });
  }

  ngOnDestroy(): void {
  }

  onAlertClick(alertId) {
    this.details = this.statusAlertsService.setActiveAlert(alertId);
    this.drawer.open();
    this.cd.detectChanges();
  }

  // on close alert details drawer
  onCloseAlert() {
    this.drawer.close();
    this.cd.detectChanges();
    this.details = this.statusAlertsService.setActiveAlert(null);
  }

  // on close alerts drawer
  onCloseDrawer() {
    this.drawer.close();
    this.closeDrawer.emit();
  }

}
