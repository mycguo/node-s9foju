#nxTabset

## Selected Item
Use it to select specific tab.

```html
<nx-tabset
  [tabGroup]="tabGroup"
  (tabSelected)="tabSelectionCallback"
  [selectedTabId]="selectedTabId"
></nx-tabset>

```
<br/>

```javascript

tabGroup: Tab[];
selectedTabId = 'tab1';
ngOnInit() {
  this.tabGroup = [
    new Tab('tab1', 'Tab 1', SomeComponentOne),
    new Tab('tab2', 'Tab 2', SomeComponentOne),
    new Tab('tab3', 'Tab 3', SomeComponentOne)
  ];
}

selectedTabChange(tabIndex: number): void {
  console.log(tabIndex);
};
```
