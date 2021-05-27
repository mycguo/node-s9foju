import { animate, animation, style } from '@angular/animations';

export const expandTextAnimation = animation([
  style({ height: '16px' }),
  animate('250ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ height: '*' }))
]);
