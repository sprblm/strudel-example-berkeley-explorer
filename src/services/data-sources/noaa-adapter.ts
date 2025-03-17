import { Repository } from '../../pages/search-repositories/_config/taskflow.types';
import { HttpClient } from './http-client';
import { 
  ApiParams, 
  DataSourceAdapter, 
  SearchOptions, 
  SearchResult, 
  SourceMetadata 
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
  private apiKey: string | null;

  constructor(params: ApiParams) {
    this.client = new HttpClient({
      baseUrl: params.baseUrl || 'https://www.ncdc.noaa.gov/cdo-web/api/v2',
      headers: {
        'Content-Type': 'application/json',
        'token': process.env.VITE_NOAA_API_KEY, // Read API key from environment variable
      },
      timeout: params.timeout,
    });
    this.apiKey = process.env.VITE_NOAA_API_KEY ?? null;
  }

  /**
   * Search for datasets in NOAA CDO based on provided filters
   */
  async searchDatasets(options: SearchOptions): Promise<SearchResult> {
    try {
      // Map our generic search options to NOAA-specific parameters
      const params: Record<string, any> = {
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
      const response = await this.client.get<any>('/datasets', params);
      
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
   * Get detailed information about a specific NOAA dataset
   */
  async getDatasetDetails(datasetId: string): Promise<Repository> {
    try {
      const response = await this.client.get<any>(`/datasets/${datasetId}`);
      
      // Get available data types for this dataset
      const dataTypesResponse = await this.client.get<any>('/datatypes', {
        datasetid: datasetId,
        limit: 1000,
      });
      
      // Get available locations for this dataset
      const locationsResponse = await this.client.get<any>('/locations', {
        datasetid: datasetId,
        limit: 1000,
      });
      
      // Combine all information into a complete repository object
      const dataset = response;
      dataset.dataTypes = dataTypesResponse.results;
      dataset.locations = locationsResponse.results;
      
      return this.mapDatasetToRepository(dataset, true);
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
      const dataTypesResponse = await this.client.get<any>('/datatypes', {
        limit: 1000,
      });
      
      // Get available locations
      const locationsResponse = await this.client.get<any>('/locations', {
        limit: 1000,
      });
      
      // Extract unique variables from data types
      const variables = Array.from(new Set(
        dataTypesResponse.results.map((dt: any) => dt.name)
      ));
      
      // Extract unique regions from locations
      const regions = Array.from(new Set(
        locationsResponse.results.map((loc: any) => loc.name)
      ));
      
      return {
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
  private mapDatasetToRepository(dataset: any, isDetailed = false): Repository {
    // Calculate quality score (1-5) based on data completeness and coverage
    const qualityScore = Math.min(5, Math.ceil((
      (dataset.coverage ? 2 : 0) +
      (dataset.dataTypes?.length ? 1 : 0) +
      (dataset.locations?.length ? 1 : 0) +
      1 // Base score
    )));
    
    // Format the temporal coverage
    const temporalCoverage = dataset.mindate && dataset.maxdate
      ? `${dataset.mindate.split('T')[0]} to ${dataset.maxdate.split('T')[0]}`
      : 'Unknown';
    
    // Extract available variables from data types if available
    const variables = dataset.dataTypes 
      ? Array.from(new Set(dataset.dataTypes.map((dt: any) => dt.name)))
      : [];
    
    // Determine spatial coverage from locations if available
    const spatialCoverage = dataset.locations
      ? Array.from(new Set(dataset.locations.map((loc: any) => loc.name)))
      : [];
    
    // Map to standard Repository format
    return {
      id: dataset.id,
      title: dataset.name,
      summary: dataset.description || 'No description available',
      source: {
        id: this.id,
        name: this.name,
        logo: this.logoUrl,
        url: `${this.homepageUrl}datasets/${dataset.id}`,
      },
      thumbnail: `https://www.ncdc.noaa.gov/sites/default/files/styles/datasets-thumbnail/public/${dataset.id.toLowerCase()}-thumbnail.jpg`,
      temporal_coverage: temporalCoverage,
      spatial_coverage: spatialCoverage.length ? spatialCoverage : ['Global'],
      variables: variables.length ? variables : ['Temperature', 'Precipitation'],
      temporal_resolution: dataset.datacoverage >= 0.75 ? ['Daily'] : ['Monthly'],
      spatial_resolution: ['Regional'],
      quality: qualityScore,
      type: dataset.dataTypes?.length 
        ? Array.from(new Set(dataset.dataTypes.map((dt: any) => dt.name)))
        : ['Observation'],
      publication_date: dataset.mindate ? dataset.mindate.split('T')[0] : '2000-01-01',
      tags: ['NOAA', 'Climate', 'Historical'],
      category: dataset.id.includes('GSOY') ? ['Annual'] : ['Daily'],
      citation: `NOAA National Centers for Environmental Information. ${dataset.name}. Available at: ${this.homepageUrl}datasets/${dataset.id}`,
      files: isDetailed ? this.generateSampleFiles(dataset) : [],
    };
  }

  /**
   * Generate sample files for a dataset (for demonstration purposes)
   */
  private generateSampleFiles(dataset: any): any[] {
    const files = [];
    
    // Add CSV data file
    files.push({
      id: `${dataset.id}-csv`,
      name: `${dataset.name} (CSV)`,
      description: 'Complete dataset in CSV format',
      fileType: 'csv',
      fileSize: 2500000, // 2.5MB
      url: `${this.homepageUrl}datasets/${dataset.id}/csv`,
      dateAdded: new Date().toISOString(),
      format: 'CSV',
    });
    
    // Add JSON data file
    files.push({
      id: `${dataset.id}-json`,
      name: `${dataset.name} (JSON)`,
      description: 'Complete dataset in JSON format',
      fileType: 'json',
      fileSize: 4200000, // 4.2MB
      url: `${this.homepageUrl}datasets/${dataset.id}/json`,
      dateAdded: new Date().toISOString(),
      format: 'JSON',
    });
    
    // Add documentation PDF
    files.push({
      id: `${dataset.id}-documentation`,
      name: `${dataset.name} Documentation`,
      description: 'Detailed documentation and methodology',
      fileType: 'pdf',
      fileSize: 1500000, // 1.5MB
      url: `${this.homepageUrl}datasets/${dataset.id}/documentation`,
      dateAdded: new Date().toISOString(),
      format: 'PDF',
    });
    
    return files;
  }
}
