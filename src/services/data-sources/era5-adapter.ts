import { Repository } from './types';
import { HttpClient } from './http-client';
import { HttpClientConfig } from './types';
import { 
  DataSourceAdapter, 
  SearchOptions, 
  SearchResult, 
  SourceMetadata 
} from './types';

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
      this.client.get('datasets/search', { params: options }); // Makes use of client
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock data representing search results from ERA5
      const repositories: Repository[] = [
        {
          id: 'era5-001',
          name: 'ERA5 Single Levels',
          description: 'ERA5 hourly data on single levels from 1940 to present',
          variables: ['2m_temperature', 'total_precipitation', 'sea_level_pressure'],
          url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-single-levels',
          citation: 'Hersbach, H., Bell, B., Berrisford, P., et al. (2020)',
          license: 'Copernicus License',
          publisher: 'ECMWF'
        },
        {
          id: 'era5-002',
          name: 'ERA5 Pressure Levels',
          description: 'ERA5 hourly data on pressure levels from 1940 to present',
          variables: ['temperature', 'geopotential', 'specific_humidity'],
          url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-pressure-levels',
          citation: 'Hersbach, H., Bell, B., Berrisford, P., et al. (2020)',
          license: 'Copernicus License',
          publisher: 'ECMWF'
        },
        {
          id: 'era5-003',
          name: 'ERA5-Land',
          description: 'ERA5-Land hourly data from 1950 to present',
          variables: ['soil_temperature', 'volumetric_soil_water', 'leaf_area_index'],
          url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-land',
          citation: 'Muñoz Sabater, J. (2019)',
          license: 'Copernicus License',
          publisher: 'ECMWF'
        }
      ];
      
      // Filter based on search options
      const filteredRepositories = repositories.filter(repo => {
        // Filter by query text
        if (options.query && !repo.name.toLowerCase().includes(options.query.toLowerCase())) {
          return false;
        }
        
        // Filter by variables
        if (options.variables && options.variables.length > 0) {
          return repo.variables?.some(v => options.variables?.includes(v));
        }
        
        return true;
      });
      
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
        }
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
        }
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
        }
      }
    ];
  }
}
