/**
 * Type definitions for the Search Data Repositories configuration
 * This file defines the structure and types for the taskflow configuration
 * used across the search data repositories application
 */

/**
 * Configuration for list-based data operations
 * Defines how data lists are fetched and processed
 */
export interface ListConfig {
  source: string;
  idField: string;
  queryMode: 'server' | 'client';
  staticParams?: Record<string, unknown>;
}

/**
 * Represents a dataset in the system
 * Contains all metadata and associated information for a single dataset
 */
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

/**
 * Props for the DataListCard component
 * Defines the data structure for the individual list item component
 */
export interface CardFields {
  titleField: string;
  contentField: string;
  dateField?: string;
  categoryField?: string;
  idField: string;
}

/**
 * Props for the DataListCard component
 * Defines the data structure for the individual list item component
 */
export interface DataListCardProps {
  id: string;
  title:
    | string
    | string[]
    | { title: string; url: string }[]
    | {
        file_id: number;
        file_name: string;
        file_size: string;
        description: string;
      }[];
  content:
    | string
    | string[]
    | { title: string; url: string }[]
    | {
        file_id: number;
        file_name: string;
        file_size: string;
        description: string;
      }[];
  date?:
    | string
    | string[]
    | { title: string; url: string }[]
    | {
        file_id: number;
        file_name: string;
        file_size: string;
        description: string;
      }[];
  category?:
    | string
    | string[]
    | { title: string; url: string }[]
    | {
        file_id: number;
        file_name: string;
        file_size: string;
        description: string;
      }[];
  onClick: () => void;
  isSelected: boolean;
}

/**
 * Main configuration interface for search data repositories
 * Contains all configuration settings for the application
 */
export interface SearchDataRepositoriesConfig {
  /**
   * Data configuration section
   * Defines how data is fetched and processed
   */
  data: {
    /**
     * Configuration for the initial list of items
     */
    list: {
      source: string; // API endpoint or data source URL
      staticParams: { limit: number; offset: number } | null; // Default query parameters
      idField: string; // Field name for unique identifier
      queryMode: 'client' | 'server'; // Where filtering happens
    };

    /**
     * Configuration for individual item details
     */
    detail: {
      source: string; // API endpoint for single item
      staticParams: Record<string, unknown> | null; // Default query parameters
      idField: string; // Field name for unique identifier
      queryMode: 'client' | 'server'; // Where filtering happens
    };

    /**
     * List of available data repositories
     */
    repositories: {
      id: string; // Unique repository identifier
      name: string; // Repository display name
      enabled: boolean; // Whether repository is active
    }[];
  };

  /**
   * Page configuration section
   * Defines UI and behavior settings for application pages
   */
  pages: {
    index: {
      title: string; // Main page title
      description: string; // Main page description

      /**
       * Mapping of card fields to data properties
       */
      cardFields: Record<string, string>;

      /**
       * Filter configuration for search results
       */
      cardFilters: {
        field: string; // Data field to filter on
        label: string; // Display label for filter
        operator: string; // Filter operation (equals, contains, etc.)
        filterComponent: string; // UI component to use
        filterProps: Record<string, unknown>; // Component-specific properties
      }[];

      /**
       * Map search configuration
       */
      mapSearch: {
        enabled: boolean; // Whether map search is active
        defaultCenter: [number, number]; // Initial map center [lat, lng]
        defaultZoom: number; // Initial zoom level
        maxBounds: [[number, number], [number, number]]; // Map boundaries
      };

      /**
       * Search history configuration
       */
      searchHistory: {
        enabled: boolean; // Whether history is tracked
        maxItems: number; // Maximum history entries to store
      };
    };
  };
}

/**
 * Simplified taskflow configuration interface
 * Contains core data and UI configuration settings
 */
export interface TaskflowConfig {
  data: {
    list: ListConfig;
    detail: Record<string, unknown>;
    repositories: Record<string, unknown>[];
  };
  cards: CardFields;
  pages?: Record<string, unknown>;
}

/**
 * Props for the DataListPanel component
 * Defines the data structure for the main list panel component
 */
export interface DataListPanelProps {
  searchResults: Dataset[];
  previewItem: Dataset | null;
  setPreviewItem: (item: Dataset | null) => void;
}
