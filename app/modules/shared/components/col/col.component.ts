import {Component, Input, OnInit} from '@angular/core';

/**
 * DEPRECATED use css classes instead
 * Documentation: https://liveaction.atlassian.net/wiki/spaces/LA/pages/2285240491/Row+Columns
 */
@Component({
  selector: 'nx-col',
  template: '<ng-content></ng-content>',
  styleUrls: ['./col.component.less'],
  host: {
    '[style.flexGrow]': 'width === undefined ? colSpan : 0',
    '[style.flexBasis]': 'width',
  }
})
export class ColComponent implements OnInit {
  @Input() width: string;
  @Input() colSpan: number;
  constructor() { }

  ngOnInit() {
  }

}
