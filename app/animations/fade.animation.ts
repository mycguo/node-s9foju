import { animate, style, transition, trigger } from '@angular/animations';
import { animationDuration } from '../constants/animation-duration.constant';
import { animationEasing } from '../constants/animation-easing.constant';

const timings = `${animationDuration.sm} 0ms ${animationEasing.base}`;

export const fadeAnimation = [
  trigger('fadeTrigger', [
    transition(':enter', [
      style({opacity: 0}),
      animate(timings, style({opacity: 1})),
    ]),
    transition(':leave', [
      animate(timings, style({opacity: 0}))
    ])
  ])
];
