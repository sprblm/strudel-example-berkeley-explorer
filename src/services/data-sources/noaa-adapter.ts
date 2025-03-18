import { Repository } from './types';
import { HttpClient } from './http-client';
import { 
  DataSourceAdapter, 
  SearchOptions, 
  SearchResult, 
  SourceMetadata,
  HttpClientConfig
} from './types';

/**
 * NOAA Climate Data Online API adapter
 * Documentation: https://www.ncdc.noaa.gov/cdo-web/webservices/v2
 */
export class NOAAAdapter implements DataSourceAdapter {
  public id = 'noaa';
  public name = 'NOAA Climate Data Online';
  public homepageUrl = 'https://www.ncdc.noaa.gov/cdo-web/';
  public logoUrl = 'https://www.noaa.gov/sites/default/files/styles/crop_394x394/public/thumbnails/image/FocusArea__Weather-01.jpg';
  public description = 'NOAA\'s Climate Data Online (CDO) provides free access to NCDC\'s archive of historical weather and climate data in addition to station history information.';

  private client: HttpClient;

  constructor(params: HttpClientConfig) {
    const apiKey = import.meta.env.VITE_NOAA_API_KEY as string;
    if (!apiKey) {
      throw new Error('NOAA API key missing');
    }
    
    this.client = new HttpClient({
      ...params,
      headers: {
        ...params.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
    });
  }

  /**
   * Search for datasets in NOAA CDO based on provided filters
   */
  async searchDatasets(options: SearchOptions): Promise<SearchResult> {
    try {
      // Map our generic search options to NOAA-specific parameters
      const params: Record<string, string | number | boolean | string[] | undefined> = {
        limit: options.limit || 25,
        offset: options.page ? (options.page - 1) * (options.limit || 25) : 0,
      };
      
      // Add query parameters if specified
      if (options.query) {
        params.searchterm = options.query;
      }
      
      // Add date range if specified
      if (options.temporal_coverage) {
        if (typeof options.temporal_coverage === 'string') {
          const [startDate, endDate] = options.temporal_coverage.split(' to ');
          params.startdate = startDate;
          params.enddate = endDate;
        } else {
          params.startdate = options.temporal_coverage.startDate;
          params.enddate = options.temporal_coverage.endDate;
        }
      }
      
      // Add data type filters if specified
      if (options.type?.length) {
        params.datatypeid = options.type.join(',');
      }

      // Make API request to NOAA CDO
      const response = await this.client.get<NOAAResponse<NOAADataset>>('/datasets', params);
      
      // Transform API response to our standard format
      const datasets = response.results.map(this.mapDatasetToRepository);
      
      return {
        datasets,
        total: response.metadata.resultset.count,
        page: Math.floor(response.metadata.resultset.offset / response.metadata.resultset.limit) + 1,
        limit: response.metadata.resultset.limit,
      };
    } catch (error) {
      console.error('Error searching NOAA datasets:', error);
      return {
        datasets: [],
        total: 0,
        page: options.page || 1,
        limit: options.limit || 25,
      };
    }
  }

  /**
   * Get details about a specific NOAA dataset
   * @param datasetId The ID of the dataset to fetch
   */
  async getDatasetDetails(datasetId: string): Promise<Repository> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock data for a single dataset
      const dataset: Repository = {
        id: datasetId,
        name: 'NOAA Global Surface Temperature',
        description: 'NOAA Global Surface Temperature (NOAAGlobalTemp) dataset',
        variables: ['temperature'],
        url: 'https://www.ncei.noaa.gov/products/land-based-station/noaa-global-temp',
        citation: 'NOAA National Centers for Environmental Information',
        license: 'NOAA Data License',
        publisher: 'NOAA',
        version: '5.0',
        temporalCoverage: {
          startDate: '1880-01-01',
          endDate: '2023-12-31'
        },
        spatialCoverage: {
          type: 'global',
          coordinates: [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]
        }
      };
      
      return dataset;
    } catch (error) {
      console.error(`Error fetching NOAA dataset details for ${datasetId}:`, error);
      throw error;
    }
  }

  /**
   * Get metadata about the NOAA data source
   */
  async getSourceMetadata(): Promise<SourceMetadata> {
    try {
      // Get available data types
      const dataTypesResponse = await this.client.get<NOAAResponse<NOAADataType>>('/datatypes', {
        limit: 1000,
      });
      
      // Get available locations
      const locationsResponse = await this.client.get<NOAAResponse<NOAALocation>>('/locations', {
        limit: 1000,
      });
      
      // Extract unique variables from data types
      const variables: string[] = Array.from(new Set(
        dataTypesResponse.results.map((dt: NOAADataType) => dt.name as string)
      ));
      
      // Extract unique regions from locations
      const regions: string[] = Array.from(new Set(
        locationsResponse.results.map((loc: NOAALocation) => loc.name as string)
      ));
      
      return {
        name: this.name,
        description: this.description,
        url: this.homepageUrl,
        variables,
        regions,
        resolutions: {
          spatial: ['Point', 'Regional', 'National', 'Global'],
          temporal: ['Hourly', 'Daily', 'Monthly', 'Annual'],
        },
        types: ['Temperature', 'Precipitation', 'Wind', 'Pressure', 'Humidity'],
        timePeriod: {
          start: '1750-01-01',
          end: new Date().toISOString().split('T')[0], // Current date
        },
      };
    } catch (error) {
      console.error('Error fetching NOAA metadata:', error);
      throw error;
    }
  }

  /**
   * Map NOAA dataset to our standard Repository format
   */
  private mapDatasetToRepository(dataset: NOAADataset): Repository {
    const variables = dataset.dataTypes 
      ? Array.from(new Set(dataset.dataTypes.map((dt: NOAADataType) => dt.name as string))) as string[]
      : [];
    
    // Start and end dates
    const startDate = dataset.mindate ? dataset.mindate.split('T')[0] : '1900-01-01';
    const endDate = dataset.maxdate ? dataset.maxdate.split('T')[0] : '2023-12-31';
    
    // Map to standard Repository format
    return {
      id: dataset.id,
      name: dataset.name,
      description: dataset.description || 'No description available',
      url: `${this.homepageUrl}datasets/${dataset.id}`,
      publisher: this.name,
      keywords: ['NOAA', 'Climate', 'Historical'],
      variables: variables.length ? variables : ['Temperature', 'Precipitation'],
      temporalCoverage: {
        startDate,
        endDate
      },
      spatialCoverage: {
        type: 'Polygon',
        coordinates: [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]
      },
      version: dataset.version || '1.0',
      dataFormat: 'CSV',
      license: 'NOAA Data License',
      category: dataset.id.includes('GSOY') ? 'Annual' : 'Daily',
      citation: `NOAA National Centers for Environmental Information. ${dataset.name}. Available at: ${this.homepageUrl}datasets/${dataset.id}`
    };
  }
}

interface NOAAResponse<T> {
  results: T[];
  metadata: {
    resultset: {
      count: number;
      limit: number;
      offset: number;
    };
  };
}

interface NOAADataset {
  id: string;
  name: string;
  description: string;
  mindate: string;
  maxdate: string;
  dataTypes: NOAADataType[];
  version: string;
}

interface NOAADataType {
  id: string;
  name: string;
}

interface NOAALocation {
  id: string;
  name: string;
}
