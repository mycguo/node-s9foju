import { Component, Input } from '@angular/core';

@Component({
  selector: 'nx-text-drill-down',
  templateUrl: './text-drill-down.component.html',
  styleUrls: ['./text-drill-down.component.less']
})
export class TextDrillDownComponent {
  @Input() text: string;
  @Input() link: string;
}
