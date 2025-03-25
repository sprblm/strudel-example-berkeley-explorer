export enum FilterOperator {
  EQUALS = 'EQUALS',
  CONTAINS = 'CONTAINS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
}

export interface DataFilter {
  field: string;
  value: unknown;
  operator: FilterOperator;
}
