import {Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef} from '@angular/core';
import {BaseContainer} from '../../../../../containers/base-container/base.container';

interface LogoSelectState {
  logoId: string;
}

@Component({
  selector: 'nx-custom-logo-select-downgrade-container',
  template: `
    <nx-custom-logo-select-container [preselectedLogoId]="preselectedLogoId"
                                     (change)="onChange($event)"></nx-custom-logo-select-container>`,
  styles: ['']
})
export class CustomLogoSelectDowngradeContainer extends BaseContainer<LogoSelectState> implements OnInit {

  public preselectedLogoId: string;
  @Output() change: EventEmitter<string> = new EventEmitter();

  @Input() setElementState = (state) => this.preselectedValueInput(state);

  constructor(public cd: ChangeDetectorRef) {
    super(cd);
  }

  ngOnInit() {
  }

  preselectedValueInput(state: LogoSelectState): void {
    this.preselectedLogoId = state ? state.logoId : void 0;
    this.cd.detectChanges();
  }

  public onChange(data: string) {
    this.change.emit(data);
  }

}
