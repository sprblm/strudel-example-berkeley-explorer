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

export interface Dataset {
  id: string;
  title: string;
  publication_date: string;
  start_date?: string;
  end_date?: string;
  citation: string;
  doi: string;
  summary: string;
  source: string;
  tags: string[];
  category: string;
  purpose?: string;
  point_of_contact: string;
  originator: string;
  metadata_contact: string;
  publisher: string;
  distributor: string;
  usgs_mission_area: string;
  communities: Array<{ title: string; url: string }>;
  associated_projects: Array<{ title: string; url: string }>;
  attached_files: Array<{
    file_id: number;
    file_name: string;
    file_size: string;
    description: string;
  }>;
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

export interface FilterFieldProps {
  filter: {
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
  };
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
