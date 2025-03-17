import { FilterComponent } from '../../../components/FilterField';
import { FilterOperator } from '../../../types/filters.types';

/**
 * Repository definition
 */
export interface Repository {
  id: string;
  name: string;
  enabled: boolean;
}

/**
 * Type definitions for the Search Data Repositories Task Flow config object
 */
export interface SearchDataRepositoriesConfig {
  /** Attributes that are used across the Task Flow */
  properties?: Record<string, any>;
  data: {
    list: {
      source: string;
      staticParams?: Record<string, string> | null;
      idField: string;
      queryMode: 'client' | 'server';
    };
    detail: {
      source: string;
      staticParams?: Record<string, string> | null;
      idField: string;
      queryMode: 'client' | 'server';
    };
    repositories?: Repository[];
    [key: string]: {
      source: string;
      staticParams?: Record<string, string> | null;
      idField: string;
      queryMode: 'client' | 'server';
    } | Repository[] | any;
  };
  /** Pages configuration */
  pages: {
    index: {
      title: string;
      description: string;
      cardFields: {
        title: string;
        content: string;
        tags: string;
        source?: string;
        quality?: string;
        resolution?: string;
        temporal_coverage?: string;
        spatial_coverage?: string;
        variables?: string;
        thumbnail?: string;
        citation?: string;
        download_url?: string;
        [key: string]: string | undefined;
      };
      cardFilters: {
        field: string;
        label: string;
        operator: FilterOperator;
        filterComponent: FilterComponent;
        filterProps?: object;
      }[];
      mapSearch?: {
        enabled: boolean;
        defaultCenter: [number, number];
        defaultZoom: number;
        maxBounds: [[number, number], [number, number]];
      };
      searchHistory?: {
        enabled: boolean;
        maxEntries: number;
      };
      savedSearches?: {
        enabled: boolean;
        maxSavedSearches: number;
      };
    };
  };
}
