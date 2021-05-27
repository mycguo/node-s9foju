#nxCard

## Large Size
Use it if you need to center the specific content  
or the two small peaces of the content and place them in one row.

```html
<nx-card [title]="'Default title'"
         [body]="body"
         [footer]="footer"
         [size]="'lg'">
  <ng-template #body>Body</ng-template>
  <ng-template #footer>Footer</ng-template>
</nx-card>
```
