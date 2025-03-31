/**
 * Mock API Service
 * 
 * This service simulates API endpoints for climate data sources
 * It uses the mock data files to provide realistic responses
 * without requiring external API connections
 */

import { 
  allDatasets, 
  getDatasetById, 
  filterDatasets 
} from '../data';
import { Dataset } from '../../pages/search-repositories/_config/taskflow.types';

/**
 * Query parameters interface for dataset requests
 */
export interface QueryParams {
  limit?: number;
  offset?: number;
  source?: string | string[];
  variables?: string | string[];
  spatial_coverage?: string | string[];
  category?: string | string[];
  start_date?: string;
  end_date?: string;
  query?: string;
  [key: string]: any;
}

/**
 * Mock API response interface
 */
export interface ApiResponse<T> {
  data: T;
  total: number;
  limit: number;
  offset: number;
}

/**
 * Mock API Service class
 */
export class MockApiService {
  /**
   * Get datasets with optional filtering and pagination
   * @param params Query parameters for filtering and pagination
   * @returns Promise resolving to API response with datasets
   */
  async getDatasets(params: QueryParams = {}): Promise<ApiResponse<Dataset[]>> {
    // Convert string arrays in query params to actual arrays
    const processedParams: QueryParams = { ...params };
    
    // Process string arrays (e.g. "source=noaa,nasa" to ["noaa", "nasa"])
    Object.keys(processedParams).forEach(key => {
      if (typeof processedParams[key] === 'string' && processedParams[key].includes(',')) {
        processedParams[key] = (processedParams[key] as string).split(',');
      }
    });
    
    // Apply filters
    const filteredData = filterDatasets(processedParams);
    
    // Apply pagination
    const limit = Number(processedParams.limit) || 10;
    const offset = Number(processedParams.offset) || 0;
    const paginatedData = filteredData.slice(offset, offset + limit);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      data: paginatedData,
      total: filteredData.length,
      limit,
      offset
    };
  }
  
  /**
   * Get a single dataset by ID
   * @param id Dataset ID
   * @returns Promise resolving to the dataset or null if not found
   */
  async getDatasetById(id: string): Promise<Dataset | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const dataset = getDatasetById(id);
    return dataset || null;
  }
  
  /**
   * Search datasets by text query and filters
   * @param query Text search query
   * @param filters Additional filters to apply
   * @returns Promise resolving to API response with matching datasets
   */
  async searchDatasets(
    query: string, 
    filters: Record<string, any> = {},
    pagination: { limit?: number; offset?: number } = {}
  ): Promise<ApiResponse<Dataset[]>> {
    const params: QueryParams = {
      ...filters,
      query,
      limit: pagination.limit || 10,
      offset: pagination.offset || 0
    };
    
    return this.getDatasets(params);
  }
}

// Export a singleton instance of the service
export const mockApiService = new MockApiService();

export default mockApiService;
