import { Component, Input } from '@angular/core';
import { SkeletonScreenTypes } from './enums/skeleton-screen-types.enum';

@Component({
  selector: 'nx-skeleton-screen',
  templateUrl: './skeleton-screen.component.html',
  styleUrls: ['./skeleton-screen.component.less']
})
export class SkeletonScreenComponent {
  @Input() contentType: SkeletonScreenTypes;
}
