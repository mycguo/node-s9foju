#nxCard

## Custom Lightweight Card Header
Use it to put shared elements into the header.

<b>HTML:</b>

```html
<nx-card [lightweight]="true" [header]="custom" [body]="body">
  <ng-template #custom>
    <p class="nx-lightweight-card__header-title nx-lightweight-card-header-title">Title</p>
    <p class="nx-lightweight-card__header-subtitle nx-lightweight-card-header-subtitle">Subtitle</p>
    <p class="nx-lightweight-card__header-notation nx-lightweight-card-header-notation">Notation</p>
  </ng-template>
  <ng-template #body>Body</ng-template>
</nx-card>
```
<br/>
<b>LESS:</b>

