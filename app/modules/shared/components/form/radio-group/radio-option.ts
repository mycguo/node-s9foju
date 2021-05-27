export class RadioOption {
  id: string | number | boolean;
  label: string;

  constructor(
    id: string | number | boolean,
    label: string
  ) {
    this.id = id;
    this.label = label;
  }
}
