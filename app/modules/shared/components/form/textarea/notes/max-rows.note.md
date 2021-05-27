#Textarea

## Max Rows

```html
<nx-textarea
  [formControl]="formControl"
  [inputModel]="inputModel"
  [maxRows]="maxRows"
></nx-textarea>
```
<br/>

```javascript
formControl = new FormControl();
inputModel = new SimpleInputModel(
    HtmlInputTypesEnum.textArea,
    'Label',
    'Placeholder'
);
maxRows = 5;
```
