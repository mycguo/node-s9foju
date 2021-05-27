import { OverlayRef } from '@angular/cdk/overlay';

/**
 * @desc Use it to reference on the functionality of the opened pop-up
 */
export class PopUpRef {
  constructor(private overlayRef: OverlayRef) {}

  /**
   * @description Lazy-loading. Use it if content is going to be updated since some period after pop-up has been opened
   */
  updatePosition(): void {
    this.overlayRef.updatePosition();
  }

  /**
   * @description Close the currently opened pop-up
   */
  close(): void {
    this.overlayRef.dispose();
  }
}
