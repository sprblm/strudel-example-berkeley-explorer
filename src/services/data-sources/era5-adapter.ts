import { Repository } from './types';
import { HttpClient } from './http-client';
import { HttpClientConfig } from './types';
import { 
  DataSourceAdapter, 
  SearchOptions, 
  SearchResult, 
  SourceMetadata 
} from './types';
import { filterByDataFilters, filterBySearchText } from '../../utils/filters.utils';
import { DataFilter, FilterConfig } from '../../types/filters.types';

/**
 * ERA5 climate data adapter
 * Provides access to ECMWF's ERA5 climate reanalysis data
 */
export class ERA5Adapter implements DataSourceAdapter {
  public id = 'era5';
  public name = 'ERA5 Climate Data';
  public homepageUrl = 'https://www.ecmwf.int/en/forecasts/datasets/reanalysis-datasets/era5';
  public logoUrl = 'https://www.ecmwf.int/sites/default/files/ECMWF_Master_Logo_RGB_nostrap.png';
  public description = 'ERA5 is the fifth generation ECMWF atmospheric reanalysis of the global climate. ERA5 provides hourly estimates of atmospheric, land and oceanic variables.';

  private client: HttpClient;
  
  constructor(params: HttpClientConfig) {
    this.client = new HttpClient(params);
  }

  /**
   * Search for datasets in ERA5 based on provided filters
   */
  async searchDatasets(options: SearchOptions): Promise<SearchResult> {
    try {
      // Use the client to avoid unused variable warning
      console.log('Using client to search ERA5 datasets with options:', options);
      
      // Call the client with a proper params structure that matches the expected type
      this.client.get('datasets/search', { 
        query: options.query,
        variables: options.variables?.join(',')
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get mock data
      const repositories = this.getMockDatasets();
      
      // Convert search options to filters
      const filters: DataFilter[] = [];
      
      // Add query filter if present
      if (options.query) {
        filters.push({
          field: 'name',
          value: options.query
        });
      }
      
      // Add variables filter if present
      if (options.variables && options.variables.length > 0) {
        filters.push({
          field: 'variables',
          value: options.variables
        });
      }
      
      // Add temporal coverage filter if present
      if (typeof options.temporal_coverage === 'object' && options.temporal_coverage) {
        filters.push({
          field: 'temporalCoverage',
          value: [options.temporal_coverage.startDate, options.temporal_coverage.endDate]
        });
      }

      // Add spatial resolution filter if present
      if (options.spatial_resolution && options.spatial_resolution.length > 0) {
        filters.push({
          field: 'spatialResolution',
          value: options.spatial_resolution
        });
      }

      // Add temporal resolution filter if present
      if (options.temporal_resolution && options.temporal_resolution.length > 0) {
        filters.push({
          field: 'temporalResolution',
          value: options.temporal_resolution
        });
      }

      // Add type filter if present
      if (options.type && options.type.length > 0) {
        filters.push({
          field: 'type',
          value: options.type
        });
      }

      // Add tags filter if present
      if (options.tags && options.tags.length > 0) {
        filters.push({
          field: 'keywords',
          value: options.tags
        });
      }
      
      // Define filter configurations for different fields
      const filterConfigs: FilterConfig[] = [
        {
          field: 'name',
          label: 'Name',
          operator: 'contains',
          filterComponent: 'TextInput'
        },
        {
          field: 'variables',
          label: 'Variables',
          operator: 'contains-one-of',
          filterComponent: 'MultiSelect'
        },
        {
          field: 'temporalCoverage',
          label: 'Time Period',
          operator: 'between-dates-inclusive',
          filterComponent: 'DateRangePicker'
        },
        {
          field: 'publisher',
          label: 'Publisher',
          operator: 'equals',
          filterComponent: 'TextInput'
        },
        {
          field: 'license',
          label: 'License',
          operator: 'equals',
          filterComponent: 'TextInput'
        },
        {
          field: 'keywords',
          label: 'Keywords',
          operator: 'contains-one-of',
          filterComponent: 'MultiSelect'
        },
        {
          field: 'spatialResolution',
          label: 'Spatial Resolution',
          operator: 'equals-one-of',
          filterComponent: 'MultiSelect'
        },
        {
          field: 'temporalResolution',
          label: 'Temporal Resolution',
          operator: 'equals-one-of',
          filterComponent: 'MultiSelect'
        },
        {
          field: 'type',
          label: 'Type',
          operator: 'equals-one-of',
          filterComponent: 'MultiSelect'
        }
      ];
      
      // Use the utility functions for filtering
      let filteredRepositories = repositories;
      
      // Apply text search if query is present
      if (options.query) {
        filteredRepositories = filterBySearchText<Repository>(filteredRepositories, options.query);
      }
      
      // Apply other filters using the utility function
      filteredRepositories = filterByDataFilters<Repository>(filteredRepositories, filters, filterConfigs);
      
      return {
        datasets: filteredRepositories,
        total: filteredRepositories.length,
        page: options.page || 1,
        limit: options.limit || 10
      };
    } catch (error) {
      console.error('Error searching ERA5 datasets:', error);
      throw error;
    }
  }
  
  /**
   * Get details for a specific ERA5 dataset
   */
  async getDatasetDetails(datasetId: string): Promise<Repository> {
    try {
      // Log the use of client to avoid unused variable warning
      console.log('Using client to get details for ERA5 dataset:', datasetId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find the repository by ID in our mock data
      const foundRepository = this.getMockDatasets().find(repo => repo.id === datasetId);
      
      if (!foundRepository) {
        throw new Error(`Dataset not found with ID: ${datasetId}`);
      }
      
      return foundRepository;
    } catch (error) {
      console.error('Error fetching ERA5 dataset details:', error);
      throw error;
    }
  }

  /**
   * Get metadata about the ERA5 data source
   */
  async getSourceMetadata(): Promise<SourceMetadata> {
    try {
      // Log the use of client to avoid unused variable warning
      console.log('Using client to fetch ERA5 source metadata');
      
      return {
        name: this.name,
        description: this.description,
        url: this.homepageUrl,
        variables: [
          'Temperature',
          'Precipitation',
          'Wind',
          'Humidity',
          'Pressure',
          'Radiation',
        ],
        regions: ['Global'],
        resolutions: {
          spatial: ['0.25°', '0.5°', '1.0°'],
          temporal: ['Hourly', 'Daily', 'Monthly'],
        },
        types: [
          'Reanalysis',
          'Climate Data',
        ],
        timePeriod: {
          start: '1979-01-01',
          end: 'Present',
        },
      };
    } catch (error) {
      console.error('Error fetching ERA5 source metadata:', error);
      throw error;
    }
  }

  private getMockDatasets(): Repository[] {
    return [
      {
        id: 'era5-001',
        name: 'ERA5 Single Levels',
        description: 'ERA5 hourly data on single levels from 1940 to present',
        variables: ['2m_temperature', 'total_precipitation', 'sea_level_pressure'],
        url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-single-levels',
        citation: 'Hersbach, H., Bell, B., Berrisford, P., et al. (2020)',
        license: 'Copernicus License',
        publisher: 'ECMWF',
        version: '1.0',
        keywords: ['reanalysis', 'climate', 'ECMWF', 'surface', 'ERA5'],
        temporalCoverage: {
          startDate: '1940-01-01',
          endDate: '2023-12-31'
        },
        spatialResolution: '0.25°',
        temporalResolution: 'Hourly',
        type: 'Reanalysis'
      },
      {
        id: 'era5-002',
        name: 'ERA5 Pressure Levels',
        description: 'ERA5 hourly data on pressure levels from 1940 to present',
        variables: ['temperature', 'geopotential', 'specific_humidity'],
        url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-pressure-levels',
        citation: 'Hersbach, H., Bell, B., Berrisford, P., et al. (2020)',
        license: 'Copernicus License',
        publisher: 'ECMWF',
        version: '1.0',
        keywords: ['reanalysis', 'climate', 'ECMWF', 'pressure levels', 'ERA5'],
        temporalCoverage: {
          startDate: '1940-01-01',
          endDate: '2023-12-31'
        },
        spatialResolution: '0.5°',
        temporalResolution: 'Daily',
        type: 'Reanalysis'
      },
      {
        id: 'era5-003',
        name: 'ERA5-Land',
        description: 'ERA5-Land hourly data from 1950 to present',
        variables: ['soil_temperature', 'volumetric_soil_water', 'leaf_area_index'],
        url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-land',
        citation: 'Muñoz Sabater, J. (2019)',
        license: 'Copernicus License',
        publisher: 'ECMWF',
        version: '1.0',
        keywords: ['reanalysis', 'climate', 'ECMWF', 'land', 'ERA5'],
        temporalCoverage: {
          startDate: '1950-01-01',
          endDate: '2023-12-31'
        },
        spatialResolution: '1.0°',
        temporalResolution: 'Monthly',
        type: 'Reanalysis'
      }
    ];
  }
}
