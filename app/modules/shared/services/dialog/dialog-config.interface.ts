import { MatDialogConfig } from '@angular/material/dialog';
import { Size } from '../../enums/size';

export class DialogConfigInterface<D> extends MatDialogConfig<D> {
  /** Define the dimensions of the container */
  size?: Size;
  /** Define the custom classes of the modal window */
  panelClass?: string[];
}
