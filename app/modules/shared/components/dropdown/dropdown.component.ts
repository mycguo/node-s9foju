import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { DropdownVerticalPosition } from './enums/dropdown-vertical-position.enum';
import { DropdownHorizontalPosition } from './enums/dropdown-horizontal-position.enum';

@Component({
  selector: 'nx-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.less']
})
export class DropdownComponent {
  @Input() buttonText: string;
  @Input() btnTmpl: TemplateRef<any>;
  @Input() yPosition: DropdownVerticalPosition;
  @Input() xPosition: DropdownHorizontalPosition;
  @Input() panelClass: string;
  @Input() hasWhiteButton: boolean;

  @ViewChild('menuTrigger', { static: true }) menuTrigger: MatMenuTrigger;
  public defaultYPosition: DropdownVerticalPosition = DropdownVerticalPosition.BOTTOM;
  public defaultXPosition: DropdownHorizontalPosition = DropdownHorizontalPosition.ALIGN_RIGHT;
}
