/**
 * Mock Data Index
 * This file exports all mock datasets for use in the application
 */

import noaaDatasets from './noaa-datasets.json';
import nasaDatasets from './nasa-datasets.json';
import worldclimDatasets from './worldclim-datasets.json';
import cmip6Datasets from './cmip6-datasets.json';
import era5Datasets from './era5-datasets.json';
import userDatasets from './user-datasets.json';
import { Dataset } from '../../pages/search-repositories/_config/taskflow.types';

/**
 * All datasets from all sources combined
 */
export const allDatasets: Dataset[] = [
  ...noaaDatasets,
  ...nasaDatasets,
  ...worldclimDatasets,
  ...cmip6Datasets,
  ...era5Datasets,
  ...userDatasets
];

/**
 * Datasets organized by source
 */
export const datasetsBySource = {
  noaa: noaaDatasets,
  nasa: nasaDatasets,
  worldclim: worldclimDatasets,
  cmip6: cmip6Datasets,
  era5: era5Datasets,
  user: userDatasets
};

/**
 * Get datasets by source
 * @param source The data source identifier
 * @returns Array of datasets from the specified source
 */
export const getDatasetsBySource = (source: string): Dataset[] => {
  return datasetsBySource[source as keyof typeof datasetsBySource] || [];
};

/**
 * Get a dataset by ID
 * @param id The dataset ID
 * @returns The dataset or undefined if not found
 */
export const getDatasetById = (id: string): Dataset | undefined => {
  return allDatasets.find(dataset => dataset.id === id);
};

/**
 * Filter datasets by various criteria
 * @param filters Object containing filter criteria
 * @returns Filtered array of datasets
 */
export const filterDatasets = (filters: Record<string, any>): Dataset[] => {
  let results = [...allDatasets];
  
  // Filter by source
  if (filters.source && filters.source.length > 0) {
    results = results.filter(dataset => 
      filters.source.includes(dataset.source)
    );
  }
  
  // Filter by variables
  if (filters.variables && filters.variables.length > 0) {
    results = results.filter(dataset => 
      dataset.variables && dataset.variables.some(v => 
        filters.variables.includes(v)
      )
    );
  }
  
  // Filter by geographic region
  if (filters.spatial_coverage && filters.spatial_coverage.length > 0) {
    results = results.filter(dataset => 
      dataset.tags && dataset.tags.some(tag => 
        filters.spatial_coverage.includes(tag)
      )
    );
  }
  
  // Filter by time period
  if (filters.start_date) {
    results = results.filter(dataset => 
      !dataset.end_date || new Date(dataset.end_date) >= new Date(filters.start_date)
    );
  }
  
  if (filters.end_date) {
    results = results.filter(dataset => 
      !dataset.start_date || new Date(dataset.start_date) <= new Date(filters.end_date)
    );
  }
  
  // Filter by category
  if (filters.category && filters.category.length > 0) {
    results = results.filter(dataset => 
      filters.category.includes(dataset.category)
    );
  }
  
  // Text search
  if (filters.query) {
    const query = filters.query.toLowerCase();
    results = results.filter(dataset => 
      dataset.title.toLowerCase().includes(query) ||
      dataset.summary.toLowerCase().includes(query) ||
      (dataset.tags && dataset.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }
  
  return results;
};

export default {
  allDatasets,
  datasetsBySource,
  getDatasetsBySource,
  getDatasetById,
  filterDatasets
};
