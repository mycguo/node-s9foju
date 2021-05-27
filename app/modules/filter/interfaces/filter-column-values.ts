export interface FilterColumnValues {
  id: string;
  name: string;
  displayName?: string;
  children?: FilterColumnValues[];
  disabled?: boolean;
  color?: string;
}
