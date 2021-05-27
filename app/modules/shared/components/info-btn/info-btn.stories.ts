import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TOOLTIP_ALIGNMENT_ENUM } from '../tooltip/enum/tooltip-alignment.enum';
import { InfoBtnComponent } from './info-btn.component';
import { TooltipComponent } from '../tooltip/tooltip.component';

export default {
  title: 'Shared/Info Button',
};

export const InitialOptions = () => {
  return {
    template: `<div class="storybook-info-box">
             <nx-info-btn style="margin-top: 200px;">
                <b>OID index must:</b>
                <ul>
                  <li>Only contain 0-9 and .</li>
                  <li>Begin with either .1 or .0</li>
                  <li>Have at least 2 decimal separated numbers (ex. .0.98)</li>
                  <li>Be valid for all selected devices</li>
                </ul>
             </nx-info-btn>
           </div>`,
    moduleMetadata: {
      imports: [BrowserAnimationsModule],
      declarations: [InfoBtnComponent, TooltipComponent],
    },
  };
};

InitialOptions.story = {
  name: 'Initial options',

  parameters: {
    notes: {
      markdown: `HTML:

         <nx-info-btn>Tooltip message</nx-info-btn>`,
    },
  },
};

export const CustomIcon = () => {
  return {
    template: `<div class="storybook-info-box">
             <nx-info-btn [icon]="icon" style="margin-top: 50px;">Tooltip message</nx-info-btn>
           </div>`,
    props: { icon: 'not-configured' },
    moduleMetadata: {
      imports: [BrowserAnimationsModule],
      declarations: [InfoBtnComponent, TooltipComponent],
    },
  };
};

CustomIcon.story = {
  parameters: {
    name: 'Custom Icon',
  },
};

export const AlignedRight = () => {
  return {
    template: `<div class="storybook-info-box">
             <nx-info-btn [tooltipAlignment]="tooltipAlignment" style="margin-top: 50px; margin-left: 300px;">Tooltip message</nx-info-btn>
           </div>`,
    props: { tooltipAlignment: TOOLTIP_ALIGNMENT_ENUM.TOP_RIGHT },
    moduleMetadata: {
      imports: [BrowserAnimationsModule],
      declarations: [InfoBtnComponent, TooltipComponent],
    },
  };
};

AlignedRight.story = {
  parameters: {
    notes: {
      markdown: `HTML:

         <nx-info-btn [tooltipAlignment]="tooltipAlignment">Tooltip message</nx-info-btn>


         JS:

         private tooltipAlignment: LA_TOOLTIP_ALIGNMENT_ENUM = LA_TOOLTIP_ALIGNMENT_ENUM.TOP_RIGHT;`,
    },
  },
};

export const ClickEvent = () => {
  return {
    template: `<div class="storybook-info-box">
             <nx-info-btn (btnClick)='onClick($event)'>Tooltip message</nx-info-btn>
           </div>`,
    props: { onClick: () => alert('success!') },
    moduleMetadata: {
      imports: [BrowserAnimationsModule],
      declarations: [InfoBtnComponent, TooltipComponent],
    },
  };
};

ClickEvent.story = {
  parameters: {
    notes: {
      markdown: `HTML:

         <nx-info-btn (btnClick)='onClick($event)'>Tooltip message</nx-info-btn>


         JS:

         private onClick(): void { alert('success!') }`,
    },
  },
};

export const DenyTooltip = () => {
  return {
    template: `<div class="storybook-info-box">
             <nx-info-btn (btnClick)='onClick($event)' [allowTooltip]="allowTooltip">Tooltip message</nx-info-btn>
           </div>`,
    props: { onClick: () => alert('success!'), allowTooltip: false },
    moduleMetadata: {
      imports: [BrowserAnimationsModule],
      declarations: [InfoBtnComponent, TooltipComponent],
    },
  };
};

DenyTooltip.story = {
  parameters: {
    notes: {
      markdown: `HTML:

         <nx-info-btn (btnClick)='onClick($event)' [allowTooltip]="allowTooltip">Tooltip message</nx-info-btn>


         JS:

         private onClick(): void { alert('success!') }
         private allowTooltip: boolean = false;`,
    },
  },
};
