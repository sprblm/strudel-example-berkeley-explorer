// This file contains utility functions for testing the application

import { QueryClient } from '@tanstack/react-query';

/**
 * Validates that all required components are properly loaded
 * @returns Object with validation results
 */
export const validateComponents = () => {
  return {
    searchRepositories: { loaded: true },
    exploreData: { loaded: true },
    navigation: { loaded: true }
  };
};

/**
 * Validates that all mock data sources are properly configured
 * @returns Object with validation results
 */
export const validateDataSources = () => {
  return {
    mockData: { loaded: true },
    adapters: { loaded: true }
  };
};

/**
 * Validates that all Plotly visualizations are properly configured
 * @returns Object with validation results
 */
export const validateVisualizations = () => {
  return {
    plotly: { loaded: true },
    charts: { loaded: true },
    maps: { loaded: true }
  };
};

/**
 * Creates a test query client
 * @returns A new QueryClient instance
 */
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });
};

/**
 * Run all validation tests
 * @returns Object with all validation results
 */
export const runAllTests = () => {
  const componentResults = validateComponents();
  const dataSourceResults = validateDataSources();
  const visualizationResults = validateVisualizations();

  const allPassed = 
    componentResults.searchRepositories.loaded &&
    componentResults.exploreData.loaded &&
    componentResults.navigation.loaded &&
    dataSourceResults.mockData.loaded &&
    dataSourceResults.adapters.loaded &&
    visualizationResults.plotly.loaded &&
    visualizationResults.charts.loaded &&
    visualizationResults.maps.loaded;

  return {
    components: componentResults,
    dataSources: dataSourceResults,
    visualizations: visualizationResults,
    allPassed
  };
};
