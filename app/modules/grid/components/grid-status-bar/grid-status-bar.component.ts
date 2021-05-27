import { Component, Input } from '@angular/core';
import { GridStatusBar } from './grid-status-bar';

@Component({
  selector: 'nx-grid-status-bar',
  templateUrl: './grid-status-bar.component.html',
  styleUrls: ['./grid-status-bar.component.less']
})
export class GridStatusBarComponent {

  @Input() data: GridStatusBar;

  constructor() {}

}
