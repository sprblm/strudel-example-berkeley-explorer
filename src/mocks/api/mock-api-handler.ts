/**
 * Mock API Handler
 * 
 * This module intercepts API requests and serves responses from mock data
 * It can be enabled/disabled via environment variables
 */

import { mockApiService } from './mock-api-service';

/**
 * Parse query parameters from URL
 * @param url URL with query parameters
 * @returns Object with parsed query parameters
 */
const parseQueryParams = (url: string): Record<string, any> => {
  const params: Record<string, any> = {};
  const queryString = url.split('?')[1];
  
  if (!queryString) return params;
  
  const searchParams = new URLSearchParams(queryString);
  searchParams.forEach((value, key) => {
    // Handle array-like parameters (e.g., source=noaa,nasa)
    if (value.includes(',')) {
      params[key] = value.split(',');
    } else {
      params[key] = value;
    }
  });
  
  return params;
};

/**
 * Mock API request handler
 * @param url Request URL
 * @param options Request options
 * @returns Promise resolving to Response object
 */
export const mockApiHandler = async (url: string, options: RequestInit = {}): Promise<Response> => {
  console.log(`[Mock API] Intercepted request to: ${url}`);
  
  // Extract path and query parameters
  const [path, queryString] = url.split('?');
  const params = parseQueryParams(url);
  
  // Handle different API endpoints
  try {
    // GET /api/datasets - List datasets with optional filtering
    if (path.endsWith('/api/datasets')) {
      const response = await mockApiService.getDatasets(params);
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // GET /api/dataset/:id - Get a single dataset by ID
    if (path.match(/\/api\/dataset\/[^\/]+$/)) {
      const id = path.split('/').pop() || '';
      const dataset = await mockApiService.getDatasetById(id);
      
      if (!dataset) {
        return new Response(JSON.stringify({ error: 'Dataset not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ data: dataset }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // GET /api/search - Search datasets
    if (path.endsWith('/api/search')) {
      const { query = '', ...filters } = params;
      const { limit, offset } = params;
      const pagination = { limit: Number(limit) || 10, offset: Number(offset) || 0 };
      
      const response = await mockApiService.searchDatasets(query, filters, pagination);
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Fallback for unhandled endpoints
    console.warn(`[Mock API] Unhandled endpoint: ${path}`);
    return new Response(JSON.stringify({ error: 'Endpoint not implemented in mock API' }), {
      status: 501,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('[Mock API] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * Setup function to install the mock API interceptor
 */
export const setupMockApi = (): void => {
  const originalFetch = window.fetch;
  
  window.fetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    // Only intercept if it's a string URL and starts with /api/
    if (typeof input === 'string' && input.startsWith('/api/')) {
      return mockApiHandler(input, init);
    }
    
    // Otherwise, pass through to the original fetch
    return originalFetch(input, init);
  };
  
  console.log('[Mock API] Installed mock API interceptor');
};

export default setupMockApi;
