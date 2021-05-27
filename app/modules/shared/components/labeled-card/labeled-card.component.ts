import {Component, Input, OnInit, TemplateRef} from '@angular/core';

@Component({
  selector: 'nx-labeled-card',
  templateUrl: './labeled-card.component.html',
  styleUrls: ['./labeled-card.component.less']
})
export class LabeledCardComponent implements OnInit {

  @Input() title: string;

  @Input() body: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
