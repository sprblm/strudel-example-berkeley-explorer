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

export interface CardFields {
  titleField: string;
  contentField: string;
}

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
