import { Component, HostBinding, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'nx-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less'],
  host: {
    '[class.nx-card_size-sm]': 'size === \'sm\'',
    '[class.nx-card_size-md]': 'size === \'md\'',
    '[class.nx-card_size-lg]': 'size === \'lg\'',
    '[class.nx-card_size-xl]': 'size === \'xl\'',
    '[class.nx-card_size-full]': 'size === \'full\'',
    '[class.nx-lightweight-card]': 'lightweight',
    '[class.nx-card]': '!lightweight',
    '[class.nx-card_header-alignment_center]': 'headerAlignment === "center"'
  }
})
export class CardComponent {
  @Input()
  size: string;

  @Input()
  headerTitle: string;

  @Input()
  subtitle: string;

  @Input()
  description: string;

  @Input()
  headerAlignment: 'left' | 'center' | 'right';

  @Input()
  header: TemplateRef<any>;

  @Input()
  body: TemplateRef<any>;

  @Input()
  footer: TemplateRef<any>;

  @Input()
  lightweight: boolean;

  @HostBinding('class.nx-card_full-height') @Input() fullHeight: boolean;

  constructor() {
  }
}
