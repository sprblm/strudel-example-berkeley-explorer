/**
 * Mock API Index
 * 
 * This file exports all mock API functionality for easy importing
 */

export { mockApiService } from './mock-api-service';
export { setupMockApi, mockApiHandler } from './mock-api-handler';
export type { QueryParams, ApiResponse } from './mock-api-service';

/**
 * Initialize the mock API system
 * Only activates if VITE_USE_MOCK_API is set to 'true'
 */
export const initMockApi = (): void => {
  const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';
  
  if (useMockApi) {
    const { setupMockApi } = require('./mock-api-handler');
    setupMockApi();
    console.log('🔄 Mock API initialized - using mock data sources');
  } else {
    console.log('🔄 Mock API disabled - using real data sources');
  }
};

export default { initMockApi };
