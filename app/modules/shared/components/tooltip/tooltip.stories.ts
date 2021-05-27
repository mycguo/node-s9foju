import { moduleMetadata } from '@storybook/angular';

import { TOOLTIP_ALIGNMENT_ENUM } from './enum/tooltip-alignment.enum';
import { TooltipComponent } from './tooltip.component';

export default {
  title: 'Shared/TooltipComponent',

  decorators: [
    moduleMetadata({
      declarations: [TooltipComponent],
    }),
  ],
};

export const TopLeftPosition = () => ({
  template: `<div class="storybook-info-box" style="margin-top: 50px; position: relative;">
             <nx-tooltip [alignment]='alignment'>Tooltip message</nx-tooltip>
         </div>`,
  props: {
    alignment: TOOLTIP_ALIGNMENT_ENUM.TOP_LEFT,
  },
});

export const TopCenterPosition = () => ({
  template: `<div class="storybook-info-box" style="margin-top: 50px; position: relative;">
             <nx-tooltip [alignment]='alignment'>Tooltip message</nx-tooltip>
         </div>`,
  props: {
    alignment: TOOLTIP_ALIGNMENT_ENUM.TOP_CENTER,
  },
});

export const TopRightPosition = () => ({
  template: `<div class="storybook-info-box" style="margin-top: 50px; position: relative;">
             <nx-tooltip [alignment]='alignment'>Tooltip message</nx-tooltip>
         </div>`,
  props: {
    alignment: TOOLTIP_ALIGNMENT_ENUM.TOP_RIGHT,
  },
});

export const BottomLeftPosition = () => ({
  template: `<div class="storybook-info-box" style="margin-top: 50px; position: relative;">
             <nx-tooltip [alignment]='alignment'>Tooltip message</nx-tooltip>
         </div>`,
  props: {
    alignment: TOOLTIP_ALIGNMENT_ENUM.BOTTOM_LEFT,
  },
});

export const BottomCenterPosition = () => ({
  template: `<div class="storybook-info-box" style="margin-top: 50px; position: relative;">
             <nx-tooltip [alignment]='alignment'>Tooltip message</nx-tooltip>
         </div>`,
  props: {
    alignment: TOOLTIP_ALIGNMENT_ENUM.BOTTOM_CENTER,
  },
});

export const BottomRightPosition = () => ({
  template: `<div class="storybook-info-box" style="margin-top: 50px; position: relative;">
             <nx-tooltip [alignment]='alignment'>Tooltip message</nx-tooltip>
         </div>`,
  props: {
    alignment: TOOLTIP_ALIGNMENT_ENUM.BOTTOM_RIGHT,
  },
});
