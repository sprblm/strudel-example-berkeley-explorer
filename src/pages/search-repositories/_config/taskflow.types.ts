/**
 * Type definitions for the Search Data Repositories configuration
 * This file defines the structure and types for the taskflow configuration
 * used across the search data repositories application
 */
import { Dataset as DatasetType } from '../../../types/dataset.types';

// Re-export the Dataset type to maintain compatibility
export type Dataset = DatasetType;

export interface ListConfig {
  source: string;
  idField: string;
  queryMode: 'server' | 'client';
  staticParams?: Record<string, unknown>;
}

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
