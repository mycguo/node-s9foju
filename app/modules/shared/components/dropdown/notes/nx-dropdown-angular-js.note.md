### Base

```html
<la-drop-down-menu options="$ctrl.dropDownOptions">
  Content
</la-drop-down-menu>
```

```angularjs
public dropDownOptions: ILaDropDownMenuOptions;
this.dropDownOptions = {
  btnType: DropDownButtonType.ICON_BUTTON,
  isWhiteMode: true
};
```

### Action List
```html
<la-drop-down-menu options="$ctrl.dropDownOptions">
  <la-drop-down-action-set ng-if="$ctrl.allowSavingViewOptions" action-set="$ctrl.dropDownActionSet"></la-drop-down-action-set>
</la-drop-down-menu>
```
```angularjs
public dropDownOptions: ILaDropDownMenuOptions;
public dropDownActionSet: LaDropDownAction[];

this.dropDownOptions = {
  btnType: DropDownButtonType.BUTTON,
  btnText: 'CSV Import/Export',
  isWhiteMode: true
};

this.dropDownActionSet = [
  {
    name: 'Export CSV',
    action: () => { console.log('Export Csv Action'); }
  },
  {
    name: 'Import CSV',
    action: () => { console.log('Import Csv Action'); }
  }
];
```

### Checkbox List
```html
<la-drop-down-menu options="$ctrl.dropDownOptions">
  <div class="nx-dropdown-checkbox-list" ng-click="$event.stopPropagation();">
      <la-checkbox
        class="nx-dropdown-checkbox-list__item"
        ng-repeat="option in $ctrl.viewOptionsCheckboxSet"
        model="option.value"
        on-checked="option.changeFn(value)"
        checkbox-text="{{option.text}}"
      ></la-checkbox>
  </div>
</div>
```
```angularjs
public dropDownOptions: ILaDropDownMenuOptions;
public viewOptionsCheckboxSet: LaCheckbox[];

this.dropDownOptions = {
  btnType: DropDownButtonType.BUTTON,
  btnText: 'View options',
  isWhiteMode: true
};

this.viewOptionsCheckboxSet = [
  {
    text: 'Cisco SD-WAN Alarms from vManage',
    value: true,
    changeFn: (value) => { console.log(value); }
  },
  {
    text: 'LiveNX Alerts',
    value: true,
    changeFn: (value) => { console.log(value); }
  }
];
```

### Combine Checkbox List and Action List
```html
<la-drop-down-menu options="$ctrl.dropDownOptions">
  <div class="nx-dropdown-checkbox-list" ng-click="$event.stopPropagation();">
      <la-checkbox
          class="nx-dropdown-checkbox-list__item"
          ng-repeat="option in $ctrl.viewOptionsCheckboxSet"
          model="option.value"
          on-checked="option.changeFn(value)"
          checkbox-text="{{option.text}}"
      ></la-checkbox>
  </div>

  <la-drop-down-action-set action-set="$ctrl.dropDownActionSet"></la-drop-down-action-set>
</div>
```

```angularjs
public dropDownOptions: ILaDropDownMenuOptions;
public viewOptionsCheckboxSet: LaCheckbox[];
public dropDownActionSet: LaDropDownAction[];

this.dropDownOptions = {
  btnType: DropDownButtonType.BUTTON,
  btnText: 'View options',
  isWhiteMode: true
};

this.viewOptionsCheckboxSet = [
  {
    text: 'Cisco SD-WAN Alarms from vManage',
    value: true,
    changeFn: (value) => { console.log(value); }
  },
  {
    text: 'LiveNX Alerts',
    value: true,
    changeFn: (value) => { console.log(value); }
  }
];

this.dropDownActionSet = [
  {
    name: 'Save',
    action: () => { console.log('Save Action'); },
    primary: true
  }
];
```
