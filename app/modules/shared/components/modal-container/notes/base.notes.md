#nxModalContainer

## Default Use Case
Use it to wrap content by base modal layouts.

#### nxSomeModalComponent
```html
<nx-modal-container
  titleText="Title"
  (closeButtonClicked)="close()"
  [bodyTpl]="bodyTpl"
  [footerTpl]="footerTpl"
>
  <ng-template #bodyTpl>Content</ng-template>

  <ng-templat #footerTpl>
    <div nxButtonList>
      <nx-button (btnClick)="close()">Cancel</nx-button>
    </div>
  </ng-templat>
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
