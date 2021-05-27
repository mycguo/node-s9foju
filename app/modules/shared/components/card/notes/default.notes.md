#nxCard

## Default Use Case
Use it to wrap content by container with white background and box-shadow  
and specified indents between base layouts and bounds of the wrapper.

```html
<nx-card [title]="'Default title'" [description]="'Card description'" [body]="body" [footer]="footer">
    <ng-template #body>Body</ng-template>
    <ng-template #footer>Footer</ng-template>
</nx-card>
```
