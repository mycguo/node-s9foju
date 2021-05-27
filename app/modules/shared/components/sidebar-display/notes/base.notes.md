#nxSidebarContainer

## Default Use Case
Use it to wrap content by base sidebar layouts.

#### nxSomeSidebarComponent
```html
<nx-sidebar-display titleText="Title" (close)="close()">
  <div body>
    Content
  </div>

  <div footer nxButtonList>
    <nx-button (btnClick)="someFunctionA()">Secondary</nx-button>
    <nx-button (btnClick)="someFunctionB()" isPrimary="true">Primary</nx-button>
  </div>
</nx-sidebar-display>
```
```javascript
@Output() closeSidebar = new EventEmitter();

public close(): void {
  this.closeSidebar.emit();
}
```
<hr/>

#### nxSomePageComponent
```html
<mat-drawer-container hasBackdrop="false">
  <mat-drawer #drawer mode="over" position="end">
    <nx-some-sidebar-component
      (closeSidebar)="closeSidebar()">
    </nx-some-sidebar-component>
  </mat-drawer>

  <mat-drawer-content>
    <div nxButtonList>
      <nx-button (btnClick)="openSidebar()">Open Sidebar</nx-button>
    </div>
  </mat-drawer-content>
</mat-drawer-container>
```
```javascript
@ViewChild('drawer') sidebar: MatSidenav;
openSidebar(): void {
  this.sidebar.open().then(someCallback);
}

closeSidebar(): void {
  this.sidebar.close().then(someCallback);
}
```
