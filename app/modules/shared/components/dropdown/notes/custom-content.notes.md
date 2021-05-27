#nxDropdown

## Custom Content
Use it to put shared elements into the dropdown.

```html
<nx-dropdown>
    <form class="nx-checkbox-list" [formGroup]="formGroup">
      <nx-checkbox label="Report parameters" formControlName="checkboxControlA"></nx-checkbox>
      <nx-checkbox label="Graph" formControlName="checkboxControlB"></nx-checkbox>
    </form>
</nx-dropdown>
```

```javascript
public formGroup: FormGroup;

constructor(private fb: FormBuilder) {
}

ngOnInit(): void {
  this.formGroup = this.fb.group({
    checkboxControlA: this.fb.control(true),
    checkboxControlB: this.fb.control(false),
  });
}
```
