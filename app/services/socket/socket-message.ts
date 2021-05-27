
export default class SocketMessage<T> {

  constructor(
    private _eventType: string,
    private _data: T
  ) {}

  get eventType(): string {
    return this._eventType;
  }

  get data(): T {
    return this._data;
  }
}
