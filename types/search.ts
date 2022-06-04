export interface FilterProps {
  index: string;
  name: string;
  values: Array<{
    key: string;
    name: string;
    value: any;
    reverse?: boolean;
    default?: boolean;
  }>;
}
