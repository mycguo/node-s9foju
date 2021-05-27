export default interface SetElementState<T> {
  state: T;
  setElementState: (state: T) => void;
  stateInput: (state: T) => void;
}
