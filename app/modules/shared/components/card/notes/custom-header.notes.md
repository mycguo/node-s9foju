#nxCard

## Custom Header
Use it to put shared elements into the header.

<b>HTML:</b>

```html
<nx-card [header]="custom" [body]="body" [footer]="footer">
  <ng-template #custom>
    <p class="nx-card__header-title nx-card-header-title">Custom header</p>
    <p class="nx-card-header__description nx-card-header-description">Description<br/>with whitespace.</p>
  </ng-template>
  <ng-template #body>Body</ng-template>
  <ng-template #footer>Footer</ng-template>
</nx-card>
```
<br/>
<b>LESS:</b>

