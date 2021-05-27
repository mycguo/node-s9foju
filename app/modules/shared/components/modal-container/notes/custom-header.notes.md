#nxModalContainer

## Custom Header
Use it to insert an additional elements to the header.

#### nxSomeModalComponent
```html
<nx-modal-container
  [headerTpl]="headerTpl"
  [bodyTpl]="bodyTpl"
  [footerTpl]="footerTpl"
  (closeButtonClicked)="close()"
>
  <ng-template #headerTpl>
    Custom Header
  </ng-template>

  <ng-template #bodyTpl>Content</ng-template>

  <ng-template #footerTpl>
    <div nxButtonList>
      <nx-button (btnClick)="close()">Cancel</nx-button>
    </div>
  </ng-template>
</nx-modal-container>
```
```javascript
constructor(public dialogRef: MatDialogRef<nxSomeModalComponent>) {}
  close(): void {
    this.dialogRef.close();
  }
```
<hr/>

#### nxSomePageComponent
```html
<nx-button (btnClick)="openModal()">Cancel</nx-button>
```
```javascript
constructor(public dialog: MatDialog) { }

openModal(): void {
  const dialogRef: MatDialogRef<nxSomeModalComponent> = this.dialog.open(nxSomeModalComponent, {
    data: {},
    panelClass: ['nx-modal-wrapper', 'nx-modal-wrapper_size_md']
  });

  dialogRef.afterClosed().subscribe(() => {
    dialogRef = void 0;
  });
}
```
