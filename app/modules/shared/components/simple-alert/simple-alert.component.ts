import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import SimpleAlert from './model/simple-alert';
import { SIMPLE_ALERT_TYPE_ENUM } from './model/simple-alert-type.enum';
import { PositionY } from './types/position-y.type';
import { AnimationEvent, transition, trigger, useAnimation } from '@angular/animations';
import { collapseTextAnimation } from './animations/collapse-text.animation';
import { expandTextAnimation } from './animations/expand-text.animation';

@Component({
  selector: 'nx-simple-alert',
  templateUrl: './simple-alert.component.html',
  styleUrls: ['./simple-alert.component.less'],
  host: {
    '[class.nx-simple-alert_y-pos_top]': 'yPosition === "top"',
    '[class.nx-simple-alert_y-pos_bottom]': '!yPosition || yPosition === "bottom"',
  },
  animations: [
    trigger('textToggleAnimation', [
      transition(':increment', [useAnimation(expandTextAnimation)]),
      transition(':decrement', [useAnimation(collapseTextAnimation)])
    ])
  ]
})
export class SimpleAlertComponent implements OnChanges {

  @Input()
  alert: SimpleAlert;

  @Input()
  yPosition: PositionY;

  @Output()
  closed: EventEmitter<void> = new EventEmitter();

  @ViewChild('text') set multipleLinesTextState(textEl: ElementRef) {
    this.isMultipleLinesText = !textEl ? false :
      textEl.nativeElement.clientHeight > parseInt(getComputedStyle(textEl.nativeElement).getPropertyValue('line-height'), 10);

    this.cd.detectChanges();
  }

  isMultipleLinesText;
  isTextExpanded;
  isShowMoreBtnDisabled;
  animationState = 0;

  readonly alertTypeEnum = SIMPLE_ALERT_TYPE_ENUM;
  private timeout;

  public isAlertHidden = true;

  @ViewChild('msgWrapper') msgWrapperEl: ElementRef;
  @ViewChild('msg') msgEl: ElementRef;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.alert === void 0) {
      return;
    }
    this.isAlertHidden = false;
    if (this.alert.closeTimeout > 0) {
      this.timeout = setTimeout(() => {
        this.onCLoseClick();
      }, this.alert.closeTimeout);
    }
  }

  public onCLoseClick() {
    if (this.timeout != null) {
      clearTimeout(this.timeout);
    }
    this.isAlertHidden = true;
    this.closed.emit();
  }

  toggleWholeText(): void {
    this.isShowMoreBtnDisabled = true;
    if (!this.isTextExpanded) {
      this.isTextExpanded = true;
    }
    this.animationState = Number(!this.animationState);
  }

  onTextToggleAnimationEndEvent(event: AnimationEvent) {
    this.isShowMoreBtnDisabled = false;
    if (!event.toState) {
      this.isTextExpanded = false;
    }
  }
}
