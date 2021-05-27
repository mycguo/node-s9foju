import {Type} from '@angular/core';

export default interface UpgradeComponent {
  component: Type<any>;
  elementName: string;
}
