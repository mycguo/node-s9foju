import { animate, state, style, transition, trigger } from '@angular/animations';
import { animationEasing } from '../constants/animation-easing.constant';
import { animationDuration } from '../constants/animation-duration.constant';

const styleIn = style({opacity: 1});
const styleOut = style({opacity: 0});
const animateIn = animate(`${animationDuration.inMd} 0ms ${animationEasing.in}`, styleIn);
const animateOut = animate(`${animationDuration.outMd} 0ms ${animationEasing.out}`, styleOut);

export const switchFadeAnimation = [
  trigger('switchFadeTrigger', [
    transition(':enter', [styleOut, animateIn]),
    transition(':leave', [animateOut]),
    state('true', styleIn),
    state('false', styleOut),
    transition('false => true', animateIn),
    transition('true => false', animateOut)
  ])
];
