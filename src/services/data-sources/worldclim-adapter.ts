import { Repository } from './types';
import { HttpClient } from './http-client';
import { 
  DataSourceAdapter, 
  SearchOptions, 
  SearchResult, 
  SourceMetadata,
  HttpClientConfig
} from './types';
import { filterByDataFilters, filterBySearchText } from '../../utils/filters.utils';
import { DataFilter, FilterConfig } from '../../types/filters.types';

/**
 * WorldClim API adapter
 * WorldClim is a set of global climate layers (climate grids) with spatial resolution of 1 km²
 */
export class WorldClimAdapter implements DataSourceAdapter {
  public id = 'worldclim';
  public name = 'WorldClim';
  public homepageUrl = 'https://www.worldclim.org/';
  public logoUrl = 'https://www.worldclim.org/img/worldclim_logo.png';
  public description = 'WorldClim is a database of high spatial resolution global weather and climate data. These data can be used for mapping and spatial modeling.';

  private client: HttpClient;

  constructor(params: HttpClientConfig) {
    this.client = new HttpClient({
      baseUrl: params.baseUrl || 'https://www.worldclim.org/data',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: params.timeout,
    });
  }

  /**
   * Search for datasets in WorldClim based on provided filters
   */
  async searchDatasets(options: SearchOptions): Promise<SearchResult> {
    try {
      // Use client in a simulated API call
      console.log('Using client to search WorldClim datasets:', options);
      
      // Make a client request to show usage
      this.client.get('datasets/search', { 
        query: options.query,
        variables: options.variables?.join(',')
      });
      
      // For demonstration, we'll simulate an API response
      const datasets = this.getMockDatasets();
      
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
        }
      ];
      
      // Use the utility functions for filtering
      let filteredDatasets = datasets;
      
      // Apply text search if query is present
      if (options.query) {
        filteredDatasets = filterBySearchText<Repository>(filteredDatasets, options.query);
      }
      
      // Apply other filters using the utility function
      filteredDatasets = filterByDataFilters<Repository>(filteredDatasets, filters, filterConfigs);
      
      // Apply pagination
      const limit = options.limit || 25;
      const page = options.page || 1;
      const offset = (page - 1) * limit;
      
      return {
        datasets: filteredDatasets.slice(offset, offset + limit),
        total: filteredDatasets.length,
        page: page,
        limit: limit,
      };
    } catch (error) {
      console.error('Error searching WorldClim datasets:', error);
      return {
        datasets: [],
        total: 0,
        page: options.page || 1,
        limit: options.limit || 25,
      };
    }
  }

  /**
   * Get detailed information about a specific WorldClim dataset
   */
  async getDatasetDetails(datasetId: string): Promise<Repository> {
    try {
      // Use client in a simulated API call
      console.log('Using client to get WorldClim dataset details:', datasetId);
      this.client.get(`datasets/${datasetId}`, {});
      
      // For demonstration, return the mock dataset with the matching ID
      const allDatasets = this.getMockDatasets();
      const dataset = allDatasets.find(ds => ds.id === datasetId);
      
      if (!dataset) {
        throw new Error(`Dataset not found: ${datasetId}`);
      }
      
      return dataset;
    } catch (error) {
      console.error(`Error fetching WorldClim dataset details for ${datasetId}:`, error);
      throw error;
    }
  }

  /**
   * Get metadata about the WorldClim data source
   */
  async getSourceMetadata(): Promise<SourceMetadata> {
    try {
      return {
        name: this.name,
        description: this.description,
        url: this.homepageUrl,
        variables: [
          'Temperature',
          'Precipitation',
          'Solar Radiation',
          'Wind Speed',
          'Water Vapor Pressure',
          'Bioclimatic Variables',
        ],
        regions: [
          'Global',
          'Land Only',
        ],
        resolutions: {
          spatial: ['30 seconds (~1 km)', '2.5 minutes', '5 minutes', '10 minutes'],
          temporal: ['Monthly', 'Annual'],
        },
        types: [
          'Current Climate',
          'Future Climate',
          'Past Climate',
          'Elevation',
        ],
        timePeriod: {
          start: '1970-01-01',
          end: '2100-12-31', // Includes future climate projections
        },
      };
    } catch (error) {
      console.error('Error fetching WorldClim metadata:', error);
      throw error;
    }
  }

  /**
   * Generate mock WorldClim dataset repositories for demonstration
   */
  private getMockDatasets(): Repository[] {
    return [
      {
        id: 'worldclim_1',
        name: 'WorldClim Current Climate (v2.1)',
        description: 'WorldClim version 2.1 climate data for 1970-2000. This dataset includes monthly climate data for minimum, mean, and maximum temperature, precipitation, solar radiation, wind speed, and water vapor pressure, plus bioclimatic variables.',
        url: `${this.homepageUrl}data/worldclim21.html`,
        variables: ['Temperature', 'Precipitation', 'Solar Radiation', 'Wind Speed', 'Water Vapor Pressure', 'Bioclimatic Variables'],
        citation: 'Fick, S.E. and R.J. Hijmans, 2017. WorldClim 2: New 1km spatial resolution climate surfaces for global land areas. International Journal of Climatology 37 (12): 4302-4315.',
        license: 'CC BY 4.0',
        publisher: 'WorldClim',
        keywords: ['WorldClim', 'Climate', 'Bioclimatic', 'Baseline'],
        version: '2.1',
        temporalCoverage: {
          startDate: '1970-01-01',
          endDate: '2000-12-31'
        }
      },
      {
        id: 'worldclim_2',
        name: 'WorldClim Future Climate (CMIP6)',
        description: 'Future climate projections based on the Shared Socioeconomic Pathways (SSPs) from CMIP6 global climate models, downscaled and bias-corrected.',
        url: `${this.homepageUrl}data/cmip6/`,
        variables: ['Temperature', 'Precipitation', 'Bioclimatic Variables'],
        citation: 'WorldClim, 2020. Future climate data. Available at: https://www.worldclim.org/data/cmip6/cmip6_clim2.5m.html',
        license: 'CC BY 4.0',
        publisher: 'WorldClim',
        keywords: ['Future Climate', 'CMIP6', 'SSP', 'Projections'],
        version: '2.1',
        temporalCoverage: {
          startDate: '2021-01-01',
          endDate: '2100-12-31'
        }
      },
      {
        id: 'worldclim_3',
        name: 'WorldClim Elevation Data',
        description: 'Elevation data at various spatial resolutions derived from the SRTM DEM and GTOPO30.',
        url: `${this.homepageUrl}data/worldclim21.html`,
        variables: ['Elevation'],
        citation: 'WorldClim, 2020. Elevation data. Available at: https://www.worldclim.org/data/worldclim21.html',
        license: 'CC BY 4.0',
        publisher: 'WorldClim',
        keywords: ['Elevation', 'Topography', 'SRTM', 'DEM'],
        version: '2.1'
      }
    ];
  }
}
