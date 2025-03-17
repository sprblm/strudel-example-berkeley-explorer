import { Repository } from '../../pages/search-repositories/_config/taskflow.types';
import { HttpClient } from './http-client';
import { 
  DataSourceAdapter, 
  SearchOptions, 
  SearchResult, 
  SourceMetadata,
  HttpClientConfig
} from './types';

/**
 * NASA Earth Observations API adapter
 * For NASA's Earth Observations datasets
 */
export class NASAAdapter implements DataSourceAdapter {
  public id = 'nasa';
  public name = 'NASA Earth Observations';
  public homepageUrl = 'https://neo.gsfc.nasa.gov/';
  public logoUrl = 'https://www.nasa.gov/sites/default/files/thumbnails/image/nasa-logo-web-rgb.png';
  public description = 'NASA Earth Observations (NEO) provides satellite imagery and scientific datasets about our home planet. The datasets are available in different formats and resolutions to fulfill most scientific requirements.';

  private client: HttpClient;

  constructor(params: HttpClientConfig) {
    this.client = new HttpClient(params);
  }

  /**
   * Search for datasets in NASA Earth Observations based on provided filters
   */
  async searchDatasets(options: SearchOptions): Promise<SearchResult> {
    try {
      // Map generic search options to NASA-specific parameters
      const params: Record<string, any> = {
        limit: options.limit || 25,
        offset: options.page ? (options.page - 1) * (options.limit || 25) : 0,
      };
      
      // Add query parameters if specified
      if (options.query) {
        params.search = options.query;
      }
      
      // Add climate variable filter if specified
      if (options.variables?.length) {
        params.variables = options.variables.join(',');
      }
      
      // For demonstration, we'll simulate an API response
      // In a real implementation, we would use: await this.client.get<any>('/datasets', params)
      const datasets = this.getMockDatasets(options);
      const filteredDatasets = this.filterDatasets(datasets, options);
      
      return {
        datasets: filteredDatasets.slice(
          params.offset, 
          params.offset + params.limit
        ),
        total: filteredDatasets.length,
        page: Math.floor(params.offset / params.limit) + 1,
        limit: params.limit,
      };
    } catch (error) {
      console.error('Error searching NASA datasets:', error);
      return {
        datasets: [],
        total: 0,
        page: options.page || 1,
        limit: options.limit || 25,
      };
    }
  }

  /**
   * Get detailed information about a specific NASA dataset
   */
  async getDatasetDetails(datasetId: string): Promise<Repository> {
    try {
      // In a real implementation, we would use:
      // const response = await this.client.get<any>(`/datasets/${datasetId}`);
      
      // For demonstration, return the mock dataset with the matching ID
      const allDatasets = this.getMockDatasets({});
      const dataset = allDatasets.find(ds => ds.id === datasetId);
      
      if (!dataset) {
        throw new Error(`Dataset not found: ${datasetId}`);
      }
      
      return dataset;
    } catch (error) {
      console.error(`Error fetching NASA dataset details for ${datasetId}:`, error);
      throw error;
    }
  }

  /**
   * Get metadata about the NASA data source
   */
  async getSourceMetadata(): Promise<SourceMetadata> {
    try {
      return {
        variables: [
          'Aerosol Optical Depth',
          'Carbon Monoxide',
          'Chlorophyll',
          'Cloud Fraction',
          'Land Surface Temperature',
          'Net Radiation',
          'Ozone',
          'Sea Surface Temperature',
          'Snow Cover',
          'Vegetation Index',
        ],
        regions: [
          'Global',
          'North America',
          'South America',
          'Europe',
          'Africa',
          'Asia',
          'Australia',
          'Arctic',
          'Antarctic',
          'Pacific Ocean',
          'Atlantic Ocean',
          'Indian Ocean',
        ],
        resolutions: {
          spatial: ['250m', '500m', '1km', '0.1 degree', '0.25 degree', '1 degree'],
          temporal: ['Daily', '8-Day', 'Monthly', 'Annual'],
        },
        types: [
          'Radiance',
          'Reflectance',
          'Index',
          'Concentration',
          'Temperature',
        ],
        timePeriod: {
          start: '2000-01-01',
          end: new Date().toISOString().split('T')[0], // Current date
        },
      };
    } catch (error) {
      console.error('Error fetching NASA metadata:', error);
      throw error;
    }
  }

  /**
   * Filter datasets based on search options
   */
  private filterDatasets(datasets: Repository[], options: SearchOptions): Repository[] {
    return datasets.filter(dataset => {
      // Filter by query text (search in title and summary)
      if (options.query) {
        const query = options.query.toLowerCase();
        if (!dataset.title.toLowerCase().includes(query) && 
            !dataset.summary.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      // Filter by variables
      if (options.variables?.length && !options.variables.some(v => 
        dataset.variables.some(dv => dv.toLowerCase().includes(v.toLowerCase()))
      )) {
        return false;
      }
      
      // Filter by spatial coverage
      if (options.spatial_coverage?.length && !options.spatial_coverage.some(r => 
        dataset.spatial_coverage.some(dr => dr.toLowerCase().includes(r.toLowerCase()))
      )) {
        return false;
      }
      
      // Filter by temporal resolution
      if (options.temporal_resolution?.length && !options.temporal_resolution.some(tr => 
        dataset.temporal_resolution.some(dtr => dtr.toLowerCase().includes(tr.toLowerCase()))
      )) {
        return false;
      }
      
      // Filter by data type
      if (options.type?.length && !options.type.some(t => 
        dataset.type.some(dt => dt.toLowerCase().includes(t.toLowerCase()))
      )) {
        return false;
      }
      
      // Filter by quality rating
      if (options.quality !== undefined && dataset.quality < options.quality) {
        return false;
      }
      
      // Filter by tags
      if (options.tags?.length && !options.tags.some(tag => 
        dataset.tags.some(dtag => dtag.toLowerCase().includes(tag.toLowerCase()))
      )) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Generate mock NASA dataset repositories for demonstration
   */
  private getMockDatasets(options: SearchOptions): Repository[] {
    return [
      {
        id: 'neo_1',
        title: 'Sea Surface Temperature (MODIS)',
        summary: 'Sea surface temperature (SST) is the temperature of the top millimeter of the ocean\'s surface. This dataset shows SST measured by the Moderate Resolution Imaging Spectroradiometer (MODIS) on NASA\'s Aqua satellite.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}view.php?datasetId=MYD28M`,
        },
        thumbnail: 'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1576312&cs=rgb&format=JPEG&width=720&height=360',
        temporal_coverage: '2002-07-04 to 2023-12-31',
        spatial_coverage: ['Global', 'Ocean'],
        variables: ['Sea Surface Temperature'],
        temporal_resolution: ['Monthly', '8-Day'],
        spatial_resolution: ['4km', '9km'],
        quality: 5,
        type: ['Satellite Observation', 'Remote Sensing'],
        publication_date: '2002-07-04',
        tags: ['NASA', 'MODIS', 'Aqua', 'Ocean', 'Temperature'],
        category: ['Oceanic', 'Temperature'],
        citation: 'NASA. MODIS Sea Surface Temperature. NASA Earth Observations. Available at: https://neo.gsfc.nasa.gov/view.php?datasetId=MYD28M',
        files: [
          {
            id: 'neo_1_geotiff',
            name: 'SST GeoTIFF (Global)',
            description: 'Monthly global sea surface temperature data in GeoTIFF format',
            fileType: 'geotiff',
            fileSize: 25000000, // 25MB
            url: 'https://neo.gsfc.nasa.gov/archive/geotiff/MYD28M_MONTHLY',
            dateAdded: '2023-01-15T00:00:00Z',
            format: 'GeoTIFF',
          },
          {
            id: 'neo_1_netcdf',
            name: 'SST NetCDF (Global)',
            description: 'Monthly global sea surface temperature data in NetCDF format',
            fileType: 'netcdf',
            fileSize: 30000000, // 30MB
            url: 'https://neo.gsfc.nasa.gov/archive/netcdf/MYD28M_MONTHLY',
            dateAdded: '2023-01-15T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'neo_1_kmz',
            name: 'SST KMZ (Global)',
            description: 'Monthly global sea surface temperature data in KMZ format for use with Google Earth',
            fileType: 'kmz',
            fileSize: 15000000, // 15MB
            url: 'https://neo.gsfc.nasa.gov/archive/kmz/MYD28M_MONTHLY',
            dateAdded: '2023-01-15T00:00:00Z',
            format: 'KMZ',
          },
        ],
      },
      {
        id: 'neo_2',
        title: 'Vegetation Index (NDVI)',
        summary: 'The Normalized Difference Vegetation Index (NDVI) is a measure of the greenness and health of vegetation. This dataset is derived from MODIS observations and provides a global view of vegetation conditions.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}view.php?datasetId=MOD13A2_M_NDVI`,
        },
        thumbnail: 'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1506235&cs=rgb&format=JPEG&width=720&height=360',
        temporal_coverage: '2000-02-18 to 2023-12-31',
        spatial_coverage: ['Global', 'Land'],
        variables: ['Vegetation Index', 'NDVI'],
        temporal_resolution: ['Monthly', '16-Day'],
        spatial_resolution: ['1km'],
        quality: 4,
        type: ['Satellite Observation', 'Index'],
        publication_date: '2000-02-18',
        tags: ['NASA', 'MODIS', 'Terra', 'Vegetation', 'NDVI'],
        category: ['Land', 'Vegetation'],
        citation: 'NASA. Vegetation Index (NDVI). NASA Earth Observations. Available at: https://neo.gsfc.nasa.gov/view.php?datasetId=MOD13A2_M_NDVI',
        files: [
          {
            id: 'neo_2_geotiff',
            name: 'NDVI GeoTIFF (Global)',
            description: 'Monthly global vegetation index data in GeoTIFF format',
            fileType: 'geotiff',
            fileSize: 22000000, // 22MB
            url: 'https://neo.gsfc.nasa.gov/archive/geotiff/MOD13A2_M_NDVI',
            dateAdded: '2023-01-15T00:00:00Z',
            format: 'GeoTIFF',
          },
          {
            id: 'neo_2_png',
            name: 'NDVI PNG (Global)',
            description: 'Monthly global vegetation index data in PNG format',
            fileType: 'png',
            fileSize: 5000000, // 5MB
            url: 'https://neo.gsfc.nasa.gov/archive/png/MOD13A2_M_NDVI',
            dateAdded: '2023-01-15T00:00:00Z',
            format: 'PNG',
          },
        ],
      },
      {
        id: 'neo_3',
        title: 'Carbon Monoxide (MOPITT)',
        summary: 'Carbon monoxide (CO) is an important trace gas in Earth\'s atmosphere. This dataset shows carbon monoxide concentrations measured by the MOPITT (Measurements of Pollution in the Troposphere) instrument on NASA\'s Terra satellite.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}view.php?datasetId=MOPITT_CO_M`,
        },
        thumbnail: 'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1642535&cs=rgb&format=JPEG&width=720&height=360',
        temporal_coverage: '2000-03-01 to 2023-12-31',
        spatial_coverage: ['Global', 'Atmosphere'],
        variables: ['Carbon Monoxide', 'CO'],
        temporal_resolution: ['Monthly'],
        spatial_resolution: ['22km'],
        quality: 4,
        type: ['Satellite Observation', 'Concentration'],
        publication_date: '2000-03-01',
        tags: ['NASA', 'MOPITT', 'Terra', 'Atmosphere', 'Pollution'],
        category: ['Atmospheric', 'Air Quality'],
        citation: 'NASA. Carbon Monoxide (MOPITT). NASA Earth Observations. Available at: https://neo.gsfc.nasa.gov/view.php?datasetId=MOPITT_CO_M',
        files: [
          {
            id: 'neo_3_geotiff',
            name: 'CO GeoTIFF (Global)',
            description: 'Monthly global carbon monoxide data in GeoTIFF format',
            fileType: 'geotiff',
            fileSize: 18000000, // 18MB
            url: 'https://neo.gsfc.nasa.gov/archive/geotiff/MOPITT_CO_M',
            dateAdded: '2023-01-15T00:00:00Z',
            format: 'GeoTIFF',
          },
          {
            id: 'neo_3_netcdf',
            name: 'CO NetCDF (Global)',
            description: 'Monthly global carbon monoxide data in NetCDF format',
            fileType: 'netcdf',
            fileSize: 24000000, // 24MB
            url: 'https://neo.gsfc.nasa.gov/archive/netcdf/MOPITT_CO_M',
            dateAdded: '2023-01-15T00:00:00Z',
            format: 'NetCDF',
          },
        ],
      },
      {
        id: 'neo_4',
        title: 'Land Surface Temperature Anomaly (Day)',
        summary: 'Land surface temperature anomalies show how much warmer or cooler a region is compared to the long-term average. This dataset shows daytime land surface temperature anomalies measured by MODIS.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}view.php?datasetId=MOD_LSTD_CLIM_M`,
        },
        thumbnail: 'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1973637&cs=rgb&format=JPEG&width=720&height=360',
        temporal_coverage: '2000-03-01 to 2023-12-31',
        spatial_coverage: ['Global', 'Land'],
        variables: ['Land Surface Temperature', 'Temperature Anomaly'],
        temporal_resolution: ['Monthly'],
        spatial_resolution: ['1km'],
        quality: 5,
        type: ['Satellite Observation', 'Anomaly'],
        publication_date: '2000-03-01',
        tags: ['NASA', 'MODIS', 'Terra', 'Land', 'Temperature', 'Climate Change'],
        category: ['Land', 'Temperature', 'Climate Change'],
        citation: 'NASA. Land Surface Temperature Anomaly (Day). NASA Earth Observations. Available at: https://neo.gsfc.nasa.gov/view.php?datasetId=MOD_LSTD_CLIM_M',
        files: [
          {
            id: 'neo_4_geotiff',
            name: 'LST Anomaly GeoTIFF (Global)',
            description: 'Monthly global land surface temperature anomaly data in GeoTIFF format',
            fileType: 'geotiff',
            fileSize: 20000000, // 20MB
            url: 'https://neo.gsfc.nasa.gov/archive/geotiff/MOD_LSTD_CLIM_M',
            dateAdded: '2023-01-15T00:00:00Z',
            format: 'GeoTIFF',
          },
          {
            id: 'neo_4_kmz',
            name: 'LST Anomaly KMZ (Global)',
            description: 'Monthly global land surface temperature anomaly data in KMZ format for use with Google Earth',
            fileType: 'kmz',
            fileSize: 12000000, // 12MB
            url: 'https://neo.gsfc.nasa.gov/archive/kmz/MOD_LSTD_CLIM_M',
            dateAdded: '2023-01-15T00:00:00Z',
            format: 'KMZ',
          },
        ],
      },
      {
        id: 'neo_5',
        title: 'Chlorophyll Concentration',
        summary: 'Chlorophyll is a green pigment found in plants and algae. This dataset shows chlorophyll concentrations in the ocean, which indicates the abundance of phytoplankton, the foundation of the marine food web.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}view.php?datasetId=MY1DMM_CHLORA`,
        },
        thumbnail: 'https://neo.gsfc.nasa.gov/servlet/RenderData?si=1712363&cs=rgb&format=JPEG&width=720&height=360',
        temporal_coverage: '2002-07-04 to 2023-12-31',
        spatial_coverage: ['Global', 'Ocean'],
        variables: ['Chlorophyll', 'Phytoplankton'],
        temporal_resolution: ['Monthly', '8-Day'],
        spatial_resolution: ['4km', '9km'],
        quality: 4,
        type: ['Satellite Observation', 'Concentration'],
        publication_date: '2002-07-04',
        tags: ['NASA', 'MODIS', 'Aqua', 'Ocean', 'Biology'],
        category: ['Oceanic', 'Biology'],
        citation: 'NASA. Chlorophyll Concentration. NASA Earth Observations. Available at: https://neo.gsfc.nasa.gov/view.php?datasetId=MY1DMM_CHLORA',
        files: [
          {
            id: 'neo_5_geotiff',
            name: 'Chlorophyll GeoTIFF (Global)',
            description: 'Monthly global chlorophyll concentration data in GeoTIFF format',
            fileType: 'geotiff',
            fileSize: 22000000, // 22MB
            url: 'https://neo.gsfc.nasa.gov/archive/geotiff/MY1DMM_CHLORA',
            dateAdded: '2023-01-15T00:00:00Z',
            format: 'GeoTIFF',
          },
          {
            id: 'neo_5_netcdf',
            name: 'Chlorophyll NetCDF (Global)',
            description: 'Monthly global chlorophyll concentration data in NetCDF format',
            fileType: 'netcdf',
            fileSize: 28000000, // 28MB
            url: 'https://neo.gsfc.nasa.gov/archive/netcdf/MY1DMM_CHLORA',
            dateAdded: '2023-01-15T00:00:00Z',
            format: 'NetCDF',
          },
        ],
      },
    ];
  }
}
