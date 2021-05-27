import {ColGroupDef} from 'ag-grid-community';
import GridColumn from './grid-column.model';
import GridBaseColumn from './grid-base-column';

export default class GridGroupColumn extends GridBaseColumn {
  name: string;
  headerClass: string;
  children: Array<GridColumn>;

  constructor({
                name,
                headerClass,
                children
      }: {
        name: string,
        headerClass?: string,
        children: Array<GridColumn>
  }) {
    super({name});
    this.headerClass = headerClass;
    this.children = children;
  }

  toAgColumnDef(): ColGroupDef {
    return {
      headerName: this.name,
      headerClass: this.headerClass,
      children: this.children.map(child => child.toAgColumnDef()),
      openByDefault: true,
      marryChildren: true,
    };
  }
}
