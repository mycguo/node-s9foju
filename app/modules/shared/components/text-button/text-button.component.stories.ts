import { TextButtonComponent } from './text-button.component';
import { TextButtonListDirective } from '../../directives/text-button-list/text-button-list.directive';

export default {
  title: 'Shared/Text Button',
};

export const InitialOption = () => {
  return {
    props: {
      click: () => {
        console.log('on click event has been triggered');
      },
    },
    template: `<nx-text-button (click)="click()">Text Button</nx-text-button>`,
    moduleMetadata: {
      declarations: [TextButtonComponent],
    },
  };
};

InitialOption.story = {
  name: 'Initial option',
};

export const Disabled = () => {
  return {
    props: {
      click: () => {
        console.log('on click event has been triggered');
      },
    },
    template: `<nx-text-button [isDisabled]="true" (click)="click()">Disabled Text Button</nx-text-button>`,
    moduleMetadata: {
      declarations: [TextButtonComponent],
    },
  };
};

export const ListRow = () => {
  return {
    props: {
      click: () => {
        console.log('on click event has been triggered');
      },
    },
    template: `<div nxTextButtonList>
                   <nx-text-button (click)="click()">First Text Button</nx-text-button>
                   <nx-text-button (btnClick)="onClick()">Second Button</nx-text-button>
                 </div>`,
    moduleMetadata: {
      declarations: [TextButtonComponent, TextButtonListDirective],
    },
  };
};
