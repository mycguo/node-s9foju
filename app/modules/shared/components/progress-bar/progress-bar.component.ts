import {Component, Input, OnInit, TemplateRef} from '@angular/core';

@Component({
  selector: 'nx-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.less']
})
export class ProgressBarComponent implements OnInit {
  @Input() progress: number;

  constructor() {
  }

  ngOnInit() {
  }

}
