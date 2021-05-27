import {AbstractColDef} from 'ag-grid-community/dist/lib/entities/colDef';

export default abstract class GridBaseColumn {
  name: string;
  protected constructor({name}: {name: string}) {
    this.name = name;
  }

  abstract toAgColumnDef(): AbstractColDef;
}
