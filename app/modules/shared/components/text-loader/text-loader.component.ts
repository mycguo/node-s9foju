import { Component, HostBinding, Input } from '@angular/core';
import { SPINNER_POSITION } from '../spinner/spinnerPosition';

@Component({
  selector: 'nx-text-loader',
  templateUrl: './text-loader.component.html',
  styleUrls: ['./text-loader.component.less']
})
export class TextLoaderComponent {
  @HostBinding('class.nx-text-loader_mode_overflow') @Input() overflowMode: boolean;
  spinnerOptions = { position: SPINNER_POSITION.STATIC_CENTER };
}
