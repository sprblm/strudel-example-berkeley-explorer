export interface FilterConfig {
  field: string;
  label: string;
  operator: 'contains' | 'contains-one-of' | 'equals' | 'equals-one-of' | 'between' | 'between-dates-inclusive';
  filterComponent: 'TextInput' | 'MultiSelect' | 'DateRangePicker';
  transformValue?: (value: any) => any;
  paramType?: 'single' | 'multi' | 'range' | 'array-string' | 'repeated' | 'minmax';
  paramTypeOptions?: {
    separator?: string;
    minParam?: string;
    maxParam?: string;
  };
}

export interface DataFilter {
  field: string;
  value: any;
}
