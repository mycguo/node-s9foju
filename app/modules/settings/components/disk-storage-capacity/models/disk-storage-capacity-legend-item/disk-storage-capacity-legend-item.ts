export class DiskStorageCapacityLegendItem {
  constructor(
    public storeName: string,
    public storeValue: number,
    public isPrimaryStore: boolean = false,
    public storeMaxValue?: number
  ) {
    if (this.storeMaxValue === void 0) {
      this.storeMaxValue = this.storeValue;
    }
  }
}
