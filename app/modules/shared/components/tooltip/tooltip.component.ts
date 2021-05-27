import { Component, Injectable, Output, EventEmitter, HostBinding, Input } from '@angular/core';
import { TOOLTIP_ALIGNMENT_ENUM } from './enum/tooltip-alignment.enum';
import { Size } from '../../enums/size';

@Component({
  selector: 'nx-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.less']
})

@Injectable()
export class TooltipComponent {
  @Input() alignment: TOOLTIP_ALIGNMENT_ENUM;
  @Input() size = Size.AUTO;
  @Output() close: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('class')
  get getSizeClassModifier(): string {
    return `nx-tooltip_size-${this.size}`;
  }

  @HostBinding('class.la-tooltip_alignment_top-left')
  get isTopLeftAligned(): Boolean {
    return this.alignment === TOOLTIP_ALIGNMENT_ENUM.TOP_LEFT;
  }

  @HostBinding('class.la-tooltip_alignment_top-center')
  get isTopCenterAligned(): Boolean {
    return this.alignment === TOOLTIP_ALIGNMENT_ENUM.TOP_CENTER;
  }

  @HostBinding('class.la-tooltip_alignment_top-right')
  get isTopRightAligned(): Boolean {
    return this.alignment === TOOLTIP_ALIGNMENT_ENUM.TOP_RIGHT;
  }

  @HostBinding('class.la-tooltip_alignment_bottom-left')
  get isBottomLeftAligned(): Boolean {
    return this.alignment === TOOLTIP_ALIGNMENT_ENUM.BOTTOM_LEFT;
  }

  @HostBinding('class.la-tooltip_alignment_bottom-center')
  get isBottomCenterAligned(): Boolean {
    return this.alignment === TOOLTIP_ALIGNMENT_ENUM.BOTTOM_CENTER;
  }

  @HostBinding('class.la-tooltip_alignment_bottom-right')
  get isBottomRightAligned(): Boolean {
    return this.alignment === TOOLTIP_ALIGNMENT_ENUM.BOTTOM_RIGHT;
  }

  TOOLTIP_SIZES = Size;
}
