/**
 * Type definitions for the Search Data Repositories configuration
 * This file defines the structure and types for the taskflow configuration
 * used across the search data repositories application
 */

export interface ListConfig {
  source: string;
  idField: string;
  queryMode: 'server' | 'client';
  staticParams?: Record<string, unknown>;
}

// Remove the original Dataset interface definition

export interface CardFields {
  titleField: string;
  contentField: string;
  dateField?: string;
  categoryField?: string;
  idField: string;
}

export interface DataListCardProps {
  id: string;
  title: string | string[] | { title: string; url: string }[] | { file_id: number; file_name: string; file_size: string; description: string }[];
  content: string | string[] | { title: string; url: string }[] | { file_id: number; file_name: string; file_size: string; description: string }[];
  date?: string | string[] | { title: string; url: string }[] | { file_id: number; file_name: string; file_size: string; description: string }[];
  category?: string | string[] | { title: string; url: string }[] | { file_id: number; file_name: string; file_size: string; description: string }[];
}

export interface Filter {
  field: string;
  label: string;
  type: 'range' | 'select' | 'toggle' | 'checkbox' | 'date-range';
  filterComponent?: string;
  filterProps?: Record<string, unknown>;
  operator?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
}

export type FilterType = 'range' | 'select' | 'toggle' | 'checkbox' | 'date-range';

export interface FilterFieldProps {
  filter: Filter;
}

export interface TaskflowPages {
  index: {
    description: string;
    cardFields: CardFields;
    filters: {
      fields: FilterFieldProps['filter'][];
    };
  };
}

export interface TaskflowConfig {
  data: {
    list: ListConfig;
    detail: ListConfig;
    repositories: { id: string; name: string; enabled: boolean }[];
  };
  pages: TaskflowPages;
}

export interface DataListPanelProps {
  searchResults: Dataset[];
  previewItem: Dataset | null;
  setPreviewItem: (item: Dataset | null) => void;
}

export interface Dataset {
  id: string;
  type?: string;
  species?: string;
  location?: string;
  parameter?: string;
  value?: number;
  distance?: number;
  dbh?: number;
  observationDate?: string;
  title: string;
  summary: string;
  source: string;
  attached_files?: { file_name: string; file_size: string }[];
  publication_date: string;
}
