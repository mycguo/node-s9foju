#Textarea

## Base Usage

```html
<nx-textarea
  [formControl]="formControl"
  [inputModel]="inputModel"
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
```
