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

// Adding DataCard interface to fix import error in ContextProvider.tsx
export interface DataCard {
  title: string;
  source?: string;
  quality?: string;
  thumbnail?: string;
  content?: string;
  temporal_coverage?: string;
  spatial_coverage?: string;
  resolution?: string;
  variables?: string | string[];
  citation?: string;
  download_url?: string;
}
