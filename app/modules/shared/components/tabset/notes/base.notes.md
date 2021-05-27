#nxTabset

## Default Use Case
Use it to separate entire content on different tabs.

```html
<nx-tabset
  [tabGroup]="tabGroup"
  (tabSelected)="tabSelectionCallback"
></nx-tabset>
```
<br/>

```javascript
tabGroup: Tab[] = [
  {
    label: 'Tab 1',
    content: {
      component: SomeComponentOne,
      componentParams: {
        firstOptionA: 'Content',
        secondOptionA: 1
      }
    }
  },
  {
    label: 'Tab 2',
    content: {
      component: SomeComponentTwo,
      componentParams: {
        firstOptionB: 'Content',
        secondOptionB: 2
      }
    }
  }
];

tabSelectionCallback(tabIndex: number): void {
  console.log(tabIndex);
};
```
