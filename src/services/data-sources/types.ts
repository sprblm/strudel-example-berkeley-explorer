/**
 * Common interface for all climate data source adapters
 */
export interface DataSourceAdapter {
  /**
   * Unique identifier for the data source
   */
  id: string;

  /**
   * Descriptive name of the data source
   */
  name: string;

  /**
   * Search for datasets in this data source with optional filters
   */
  searchDatasets(options: SearchOptions): Promise<SearchResult>;

  /**
   * Get detailed information about a specific dataset
   */
  getDatasetDetails(datasetId: string): Promise<Repository>;

  /**
   * Get metadata about the data source, including available variables,
   * regions, time periods, etc.
   */
  getSourceMetadata(): Promise<SourceMetadata>;
}

/**
 * Options for searching datasets
 */
export interface SearchOptions {
  query?: string;
  source?: string[];
  variables?: string[];
  spatial_coverage?: string[];
  temporal_coverage?: string | { startDate: string; endDate: string };
  spatial_resolution?: string[];
  temporal_resolution?: string[];
  type?: string[];
  publication_date?: string | { startDate: string; endDate: string };
  quality?: number;
  tags?: string[];
  category?: string[];
  page?: number;
  limit?: number;
}

/**
 * Result from a search operation
 */
export interface SearchResult {
  datasets: Repository[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Metadata about a data source
 */
export interface SourceMetadata {
  name: string;
  description: string;
  url: string;
  variables?: string[];
  regions?: string[];
  resolutions?: {
    spatial: string[];
    temporal: string[];
  };
  types?: string[];
  timePeriod?: {
    start: string;
    end: string;
  };
  models?: string[];
  levels?: string[];
}

/**
 * Attachment/file in a dataset
 */
export interface DatasetAttachment {
  id: string;
  name: string;
  description?: string;
  fileType: string;
  fileSize: number;
  url: string;
  dateAdded: string;
  format: string;
}

/**
 * Interface representing a repository or dataset in a data source
 */
export interface Repository {
  id: string;
  name: string;
  description: string;
  source?: string; // Added source property for filtering by data source
  title?: string;
  summary?: string;
  variables?: string[];
  url?: string;
  citation?: string;
  license?: string;
  keywords?: string[];
  dataFormat?: string;
  spatialCoverage?: {
    type: string;
    coordinates: number[][];
  };
  temporalCoverage?: {
    startDate: string;
    endDate: string;
  };
  version?: string;
  sourceUrl?: string;
  downloadUrl?: string;
  size?: number;
  createdAt?: string;
  updatedAt?: string;
  publisher?: string;
  authors?: string[];
  contributors?: string[];
  category?: string;
  spatialResolution?: string | string[];
  temporalResolution?: string | string[];
  type?: string | string[];
  [key: string]: unknown;
}

/**
 * Interface for a dataset variable
 */
export interface DatasetVariable {
  name: string;
  values: unknown[];
}

/**
 * Interface for a spatial range
 */
export interface SpatialRange {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

/**
 * Interface for a temporal resolution
 */
export interface TemporalResolution {
  unit: string;
  value: number;
}

/**
 * Interface for HttpClient configuration
 */
export interface HttpClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Common API parameter types
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
  page?: number;
}

export interface StringKeyValueParams {
  [key: string]: string | number | boolean | string[] | undefined;
}

/**
 * NOAA specific types
 */
export interface NOAADataType {
  id: string;
  name: string;
  description?: string;
}

export interface NOAALocation {
  id: string;
  name: string;
  region?: string;
  type?: string;
}

export interface NOAADataset {
  id: string;
  name: string;
  description?: string;
  mindate?: string;
  maxdate?: string;
  dataTypes?: NOAADataType[];
  locations?: NOAALocation[];
  [key: string]: unknown;
}

export interface NOAAMetadata {
  resultset: {
    count: number;
    limit: number;
    offset: number;
  };
}

export interface NOAAResponse<T> {
  metadata: NOAAMetadata;
  results: T[];
}
