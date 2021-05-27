import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, HostListener, Inject} from '@angular/core';

@Component({
  selector: 'nx-dialog',
  template: ''
})
/**
 * <D> - The type of the data to be passed in and consumed by the dialog component
 * <R> - The type of the data to be returned by the dialog component
 */
export class DialogComponent<D, R = unknown> {

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: D,
    public dialogRef: MatDialogRef<DialogComponent<D, R>, R>
  ) {}
  /**
   * Close the dialog and return an appropriate result
   * @param result - the result to be returned after the dialog has closed
   */
  public close(result?: R) {
    this.dialogRef.close(result);
  }
}
