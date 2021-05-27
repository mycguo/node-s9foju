import {Component, Input, OnInit, TemplateRef} from '@angular/core';

@Component({
  selector: 'nx-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.less']
})
export class TitleBarComponent implements OnInit {

  @Input() pageTitle: string;
  @Input() bodyTmpl: TemplateRef<any>;
  @Input() pageActions: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
