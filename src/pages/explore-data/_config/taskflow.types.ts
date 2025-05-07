/**
 * Types for the explore-data taskflow configuration
 */

export interface ExploreDataConfig {
  data: {
    list: {
      source: string;
      staticParams?: Record<string, string> | null;
      idField: string;
      queryMode: 'client' | 'server';
    };
    detail?: {
      source: string;
      staticParams?: Record<string, string> | null;
      idField: string;
      queryMode: 'client' | 'server';
    };
  };
  pages: {
    index: {
      description: string;
      tableColumns?: Array<{
        field: string;
        headerName: string;
        width?: number;
        units?: string;
        type?: string;
      }>;
      tableFilters?: Array<{
        field: string;
        label: string;
        operator: string;
        filterComponent: string;
        filterProps?: Record<string, any>;
      }>;
    };
  };
}
