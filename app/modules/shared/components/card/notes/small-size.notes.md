#nxCard

## Small Size
Use it if you need to display the small peace of content and center it.

```html
<nx-card [title]="'Default title'"
         [body]="body"
         [footer]="footer"
         [size]="'sm'">
  <ng-template #body>Body</ng-template>
  <ng-template #footer>Footer</ng-template>
</nx-card>
```
