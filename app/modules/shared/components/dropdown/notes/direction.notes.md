#nxDropdown

## Direction
Use it if you need to define position of dropdown.

```html
<nx-dropdown [dropdownActions]="dropdownActions" [xPosition]="dropdownXPosition" [yPosition]="dropdownYPosition"></nx-dropdown>
```

```javascript
public dropdownXPosition: DropdownHorizontalPosition;
public dropdownYPosition: DropdownVerticalPosition;
public dropdownActions: DropdownAction[];

this.dropdownXPosition = DropdownHorizontalPosition.ALIGN_LEFT;
this.dropdownYPosition = DropdownVerticalPosition.TOP;
this.dropdownActions = [
  new DropdownAction('Action 1', () => { alert('Action 1'); }),
  new DropdownAction('Action 2', () => { alert('Action 2'); })
];
```
