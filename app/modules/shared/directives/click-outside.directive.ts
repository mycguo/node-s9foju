import {Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import ClickOutsideEvent from './click-outside-event';

@Directive({
  selector: '[nxClickOutside]'
})
export class ClickOutsideDirective {

  /** This is emitted when an outside click is triggered. */
  @Input() outputId: string;
  @Output() clickOutside = new EventEmitter<ClickOutsideEvent>();

  constructor(
    private elementRef: ElementRef
  ) { }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      const emittedString = this.outputId ? this.outputId : 'outsideClicked';
      this.clickOutside.emit({outputId: emittedString, target: targetElement});
    }
  }
}
