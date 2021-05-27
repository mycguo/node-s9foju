#nxTabset

## Disabled Item
Use it to disable specific tab.

```html
<nx-tabset
  [tabGroup]="tabGroup"
  (tabSelected)="tabSelectionCallback"
></nx-tabset>

```
<br/>

```javascript


tabGroup: Tab[];

ngOnInit() {

  this.tabGroup = [
    new Tab('Tab 1', SomeComponentOne),
    new Tab('Tab 2', SomeComponentOne, void 0, void 0, true),
    new Tab('Tab 3', SomeComponentOne)
  ];
}

selectedTabChange(tabIndex: number): void {
  console.log(tabIndex);
};
```
