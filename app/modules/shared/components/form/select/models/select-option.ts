export class SelectOption<T = string | number | boolean> {
  constructor(
    public id: T,
    public name: string,
    public disabled?: boolean
  ) {}
}
