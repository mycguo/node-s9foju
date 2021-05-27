#nxKeyValueList

## Custom Template

```html
<nx-key-value-list>
    <div nxKeyValueListItem [key]="'hostname'" [value]="'host'"></div>
    <ng-template nxKeyValueListItem [key]="'status'">
        <span nx-status-indicator [status]="status">Valid</span>
    </ng-template>
</nx-key-value-list>
```
