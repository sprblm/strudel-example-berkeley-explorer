/**
 * Mock Data and API Index
 * 
 * This file exports all mock functionality for easy importing
 */

// Export mock data
export * from './data';

// Export mock API
export * from './api';

// Initialize function that sets up all mock systems
export const initMocks = (): void => {
  const { initMockApi } = require('./api');
  
  // Initialize mock API if enabled
  initMockApi();
  
  console.log('🔄 Mock systems initialized');
};

export default { initMocks };
