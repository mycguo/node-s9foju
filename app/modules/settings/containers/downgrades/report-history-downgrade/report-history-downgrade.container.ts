import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BaseContainer} from '../../../../../containers/base-container/base.container';

@Component({
  selector: 'nx-report-history-downgrade-container',
  template: `
    <nx-report-history-container></nx-report-history-container>
  `,
  styles: [':host { display: block; }']
})
export class ReportHistoryDowngradeContainer extends BaseContainer<void> implements OnInit {

  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }

  ngOnInit(): void {
  }

}
