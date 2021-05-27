#nxDropdown

## Default Use Case
Use it to group buttons or other elements and place them in the "toggle" container.

```html
<nx-dropdown [dropdownActions]="dropdownActions"></nx-dropdown>
```

```javascript
public dropdownActions: DropdownAction[];

this.dropdownActions = [
  new DropdownAction('Action 1', () => { alert('Action 1'); }),
  new DropdownAction('Action 2', () => { alert('Action 2'); })
];
```
