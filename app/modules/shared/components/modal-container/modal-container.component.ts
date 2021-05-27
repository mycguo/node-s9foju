import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'nx-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.less'],
  host: {
    '[class.nx-modal]': 'true',
    '[class.nx-modal_has_footer-separator]': 'hasFooterSeparator'
  }
})
export class ModalContainerComponent {

  @Input() titleText: string;
  @Input() hasFooterSeparator: boolean;

  @Output() closeButtonClicked = new EventEmitter();

  // Templates
  @Input() headerTpl: TemplateRef<any>;
  @Input() bodyTpl: TemplateRef<any>;
  @Input() footerTpl: TemplateRef<any>;
  @Input() alertTpl: TemplateRef<any>;

  constructor() {
  }
}
