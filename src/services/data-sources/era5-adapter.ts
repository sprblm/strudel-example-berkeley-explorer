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
 * ERA5 Reanalysis Data API adapter
 * ERA5 is ECMWF's fifth generation reanalysis for the global climate and weather
 */
export class ERA5Adapter implements DataSourceAdapter {
  public readonly id = 'era5';
  public readonly name = 'ERA5 Reanalysis';
  public readonly homepageUrl = 'https://www.ecmwf.int/en/forecasts/datasets/reanalysis-datasets/era5';
  public readonly logoUrl = 'https://climate.copernicus.eu/sites/default/files/2018-09/logo-C3S-Copernicus.png';
  public readonly description = 'ERA5 is the fifth generation ECMWF atmospheric reanalysis of the global climate. Reanalysis combines model data with observations to provide a globally complete and consistent dataset using the laws of physics. ERA5 provides hourly estimates of atmospheric variables, land-surface variables, and ocean wave variables.';

  private client: HttpClient;

  constructor(params: HttpClientConfig) {
    this.client = new HttpClient(params);
  }

  /**
   * Search for datasets in ERA5 based on provided filters
   */
  async searchDatasets(options: SearchOptions): Promise<SearchResult> {
    try {
      // For demonstration, we'll simulate an API response
      const datasets = this.getMockDatasets();
      const filteredDatasets = this.filterDatasets(datasets, options);
      
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
      console.error('Error searching ERA5 datasets:', error);
      return {
        datasets: [],
        total: 0,
        page: options.page || 1,
        limit: options.limit || 25,
      };
    }
  }

  /**
   * Get detailed information about a specific ERA5 dataset
   */
  async getDatasetDetails(datasetId: string): Promise<Repository> {
    try {
      // For demonstration, return the mock dataset with the matching ID
      const allDatasets = this.getMockDatasets();
      const dataset = allDatasets.find(ds => ds.id === datasetId);
      
      if (!dataset) {
        throw new Error(`Dataset not found: ${datasetId}`);
      }
      
      return this.createRepository(dataset);
    } catch (error) {
      console.error(`Error fetching ERA5 dataset details for ${datasetId}:`, error);
      throw error;
    }
  }

  /**
   * Get metadata about the ERA5 data source
   */
  async getSourceMetadata(): Promise<SourceMetadata> {
    try {
      return {
        variables: [
          'Temperature',
          'Precipitation',
          'Humidity',
          'Wind',
          'Pressure',
          'Geopotential',
          'Radiation',
          'Soil Moisture',
          'Snow Depth',
          'Sea Surface Temperature',
          'Wave Height',
          'Cloud Cover',
        ],
        regions: [
          'Global',
          'Europe',
          'North America',
          'South America',
          'Asia',
          'Africa',
          'Australia',
          'Antarctica',
          'Arctic',
          'Atlantic Ocean',
          'Pacific Ocean',
          'Indian Ocean',
        ],
        resolutions: {
          spatial: ['0.25 degree (~31km)', '0.5 degree (~56km)', '1.0 degree (~111km)'],
          temporal: ['Hourly', 'Daily', 'Monthly', 'Annual'],
        },
        types: [
          'Reanalysis',
          'Pressure Level',
          'Surface',
          'Single Level',
          'Land',
          'Ocean Waves',
        ],
        timePeriod: {
          start: '1950-01-01', // ERA5 back-extension goes back to 1950
          end: new Date().toISOString().split('T')[0], // Current date as ERA5 is continuously updated
        },
        levels: [
          'Surface',
          '1000 hPa',
          '925 hPa',
          '850 hPa',
          '700 hPa',
          '600 hPa',
          '500 hPa',
          '400 hPa',
          '300 hPa',
          '250 hPa',
          '200 hPa',
          '150 hPa',
          '100 hPa',
          '50 hPa',
          '10 hPa',
        ],
      };
    } catch (error) {
      console.error('Error fetching ERA5 metadata:', error);
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
      
      return true;
    });
  }

  /**
   * Generate mock ERA5 dataset repositories for demonstration
   */
  private getMockDatasets(): Repository[] {
    return [
      {
        id: 'era5_1',
        title: 'ERA5 Monthly Averaged Data on Pressure Levels',
        summary: 'This dataset provides monthly averaged values of upper-air parameters on pressure levels, including temperature, humidity, wind components, geopotential, and more. The data is suitable for climate monitoring, research, and education.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}#monthly-averaged-data-on-pressure-levels`,
        },
        thumbnail: 'https://climate.copernicus.eu/sites/default/files/2018-09/era5-temp850-thumbnail.png',
        temporal_coverage: '1979-01-01 to 2023-12-31',
        spatial_coverage: ['Global'],
        variables: ['Temperature', 'Geopotential', 'Specific Humidity', 'U Wind Component', 'V Wind Component', 'Vertical Velocity', 'Vorticity', 'Potential Vorticity'],
        temporal_resolution: ['Monthly'],
        spatial_resolution: ['0.25 degree (~31km)', '0.5 degree (~56km)', '1.0 degree (~111km)'],
        quality: 5,
        type: ['Reanalysis', 'Pressure Level', 'Climate Data Record'],
        publication_date: '2019-05-15',
        tags: ['ERA5', 'Reanalysis', 'Upper Air', 'Pressure Levels', 'ECMWF', 'Copernicus'],
        category: ['Atmospheric', 'Reanalysis'],
        citation: 'Hersbach, H., Bell, B., Berrisford, P., Hirahara, S., Horányi, A., Muñoz‐Sabater, J., Nicolas, J., Peubey, C., Radu, R., Schepers, D., Simmons, A., Soci, C., Abdalla, S., Abellan, X., Balsamo, G., Bechtold, P., Biavati, G., Bidlot, J., Bonavita, M., De Chiara, G., Dahlgren, P., Dee, D., Diamantakis, M., Dragani, R., Flemming, J., Forbes, R., Fuentes, M., Geer, A., Haimberger, L., Healy, S., Hogan, R.J., Hólm, E., Janisková, M., Keeley, S., Laloyaux, P., Lopez, P., Lupu, C., Radnoti, G., de Rosnay, P., Rozum, I., Vamborg, F., Villaume, S., Thépaut, J-N. (2020) The ERA5 global reanalysis. Q J R Meteorol Soc. 2020;146:1999–2049. https://doi.org/10.1002/qj.3803',
        files: [
          {
            id: 'era5_1_file1',
            name: 'ERA5 Monthly Averaged - Pressure Levels (Global)',
            description: 'Complete monthly averaged dataset for all pressure levels and variables, global coverage, 0.25 degree resolution',
            fileType: 'netcdf',
            fileSize: 120000000000, // 120GB (full dataset is very large)
            url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-pressure-levels-monthly-means',
            dateAdded: '2019-05-15T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'era5_1_file2',
            name: 'ERA5 Monthly Averaged - Temperature 850hPa (Global)',
            description: 'Monthly averaged temperature at 850hPa pressure level, global coverage, 0.25 degree resolution',
            fileType: 'netcdf',
            fileSize: 2500000000, // 2.5GB
            url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-pressure-levels-monthly-means?tab=form',
            dateAdded: '2019-05-15T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'era5_1_file3',
            name: 'ERA5 Monthly Averaged - Geopotential 500hPa (Global)',
            description: 'Monthly averaged geopotential at 500hPa pressure level, global coverage, 0.25 degree resolution',
            fileType: 'netcdf',
            fileSize: 2500000000, // 2.5GB
            url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-pressure-levels-monthly-means?tab=form',
            dateAdded: '2019-05-15T00:00:00Z',
            format: 'NetCDF',
          },
        ],
      },
      {
        id: 'era5_2',
        title: 'ERA5 Hourly Data on Single Levels',
        summary: 'This dataset provides hourly estimates of a large number of atmospheric, land and oceanic climate variables. It includes parameters such as 2m temperature, 10m wind speed and direction, mean sea level pressure, and many more surface or single level variables.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}#hourly-data-on-single-levels`,
        },
        thumbnail: 'https://climate.copernicus.eu/sites/default/files/2018-09/era5-t2m-thumbnail.png',
        temporal_coverage: '1979-01-01 to 2023-12-31',
        spatial_coverage: ['Global'],
        variables: ['2m Temperature', 'Surface Pressure', '10m Wind Speed', '10m Wind Direction', 'Precipitation', 'Radiation', 'Humidity', 'Soil Moisture', 'Snow Depth'],
        temporal_resolution: ['Hourly'],
        spatial_resolution: ['0.25 degree (~31km)'],
        quality: 5,
        type: ['Reanalysis', 'Surface', 'Single Level', 'Climate Data Record'],
        publication_date: '2019-05-15',
        tags: ['ERA5', 'Reanalysis', 'Surface', 'Hourly', 'ECMWF', 'Copernicus'],
        category: ['Atmospheric', 'Surface', 'Reanalysis'],
        citation: 'Hersbach, H., Bell, B., Berrisford, P., Hirahara, S., Horányi, A., Muñoz‐Sabater, J., Nicolas, J., Peubey, C., Radu, R., Schepers, D., Simmons, A., Soci, C., Abdalla, S., Abellan, X., Balsamo, G., Bechtold, P., Biavati, G., Bidlot, J., Bonavita, M., De Chiara, G., Dahlgren, P., Dee, D., Diamantakis, M., Dragani, R., Flemming, J., Forbes, R., Fuentes, M., Geer, A., Haimberger, L., Healy, S., Hogan, R.J., Hólm, E., Janisková, M., Keeley, S., Laloyaux, P., Lopez, P., Lupu, C., Radnoti, G., de Rosnay, P., Rozum, I., Vamborg, F., Villaume, S., Thépaut, J-N. (2020) The ERA5 global reanalysis. Q J R Meteorol Soc. 2020;146:1999–2049. https://doi.org/10.1002/qj.3803',
        files: [
          {
            id: 'era5_2_file1',
            name: 'ERA5 Hourly - Single Levels (Global)',
            description: 'Complete hourly dataset for all surface and single level variables, global coverage, 0.25 degree resolution',
            fileType: 'netcdf',
            fileSize: 500000000000, // 500GB (full dataset is extremely large)
            url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-single-levels',
            dateAdded: '2019-05-15T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'era5_2_file2',
            name: 'ERA5 Hourly - 2m Temperature (Global)',
            description: 'Hourly 2-meter temperature data, global coverage, 0.25 degree resolution',
            fileType: 'netcdf',
            fileSize: 15000000000, // 15GB
            url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-single-levels?tab=form',
            dateAdded: '2019-05-15T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'era5_2_file3',
            name: 'ERA5 Hourly - Precipitation (Global)',
            description: 'Hourly precipitation data, global coverage, 0.25 degree resolution',
            fileType: 'netcdf',
            fileSize: 15000000000, // 15GB
            url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-single-levels?tab=form',
            dateAdded: '2019-05-15T00:00:00Z',
            format: 'NetCDF',
          },
        ],
      },
      {
        id: 'era5_3',
        title: 'ERA5-Land Monthly Averaged Data',
        summary: 'ERA5-Land is a reanalysis dataset providing a consistent view of the evolution of land variables over several decades at an enhanced resolution compared to ERA5. This monthly averaged dataset includes soil temperature and moisture, snow, runoff, and more.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}#era5-land-monthly-averaged`,
        },
        thumbnail: 'https://climate.copernicus.eu/sites/default/files/2019-05/era5-land-thumbnail.png',
        temporal_coverage: '1981-01-01 to 2023-12-31',
        spatial_coverage: ['Global', 'Land Only'],
        variables: ['Soil Temperature', 'Soil Moisture', 'Snow Cover', 'Snow Depth', 'Runoff', 'Surface Latent Heat Flux', 'Surface Sensible Heat Flux', 'Evaporation'],
        temporal_resolution: ['Monthly'],
        spatial_resolution: ['0.1 degree (~9km)'],
        quality: 4,
        type: ['Reanalysis', 'Land', 'Climate Data Record'],
        publication_date: '2020-01-15',
        tags: ['ERA5', 'ERA5-Land', 'Reanalysis', 'Land Surface', 'ECMWF', 'Copernicus'],
        category: ['Land', 'Hydrology', 'Reanalysis'],
        citation: 'Muñoz-Sabater, J., Dutra, E., Agustí-Panareda, A., Albergel, C., Arduini, G., Balsamo, G., Boussetta, S., Choulga, M., Harrigan, S., Hersbach, H., Martens, B., Miralles, D. G., Piles, M., Rodríguez-Fernández, N. J., Zsoter, E., Buontempo, C., and Thépaut, J.-N.: ERA5-Land: a state-of-the-art global reanalysis dataset for land applications, Earth Syst. Sci. Data, 13, 4349–4383, https://doi.org/10.5194/essd-13-4349-2021, 2021.',
        files: [
          {
            id: 'era5_3_file1',
            name: 'ERA5-Land Monthly Averaged - Complete Dataset (Global Land)',
            description: 'Complete monthly averaged dataset for all ERA5-Land variables, global land coverage, 0.1 degree resolution',
            fileType: 'netcdf',
            fileSize: 45000000000, // 45GB
            url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-land-monthly-means',
            dateAdded: '2020-01-15T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'era5_3_file2',
            name: 'ERA5-Land Monthly Averaged - Soil Moisture (Global Land)',
            description: 'Monthly averaged volumetric soil water layer 1 (0-7cm depth), global land coverage, 0.1 degree resolution',
            fileType: 'netcdf',
            fileSize: 5000000000, // 5GB
            url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-land-monthly-means?tab=form',
            dateAdded: '2020-01-15T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'era5_3_file3',
            name: 'ERA5-Land Monthly Averaged - Snow Cover (Global Land)',
            description: 'Monthly averaged snow cover, global land coverage, 0.1 degree resolution',
            fileType: 'netcdf',
            fileSize: 5000000000, // 5GB
            url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-land-monthly-means?tab=form',
            dateAdded: '2020-01-15T00:00:00Z',
            format: 'NetCDF',
          },
        ],
      },
      {
        id: 'era5_4',
        title: 'ERA5 Ocean Analysis',
        summary: 'This dataset provides a detailed analysis of the global ocean, including sea surface temperature, ocean heat content, sea ice, currents, and wave conditions. It combines ocean observations with model forecasts to create a consistent record of ocean variables.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}#ocean-analysis`,
        },
        thumbnail: 'https://climate.copernicus.eu/sites/default/files/2018-09/era5-sst-thumbnail.png',
        temporal_coverage: '1979-01-01 to 2023-12-31',
        spatial_coverage: ['Global', 'Ocean Only'],
        variables: ['Sea Surface Temperature', 'Sea Ice Concentration', 'Wave Height', 'Wave Direction', 'Wave Period', 'Ocean Current Speed', 'Ocean Current Direction', 'Ocean Heat Content'],
        temporal_resolution: ['Hourly', 'Daily', 'Monthly'],
        spatial_resolution: ['0.25 degree (~31km)', '0.5 degree (~56km)'],
        quality: 4,
        type: ['Reanalysis', 'Ocean', 'Climate Data Record'],
        publication_date: '2019-05-15',
        tags: ['ERA5', 'Reanalysis', 'Ocean', 'Sea Surface Temperature', 'Sea Ice', 'Waves', 'ECMWF', 'Copernicus'],
        category: ['Oceanic', 'Reanalysis'],
        citation: 'Hersbach, H., Bell, B., Berrisford, P., Hirahara, S., Horányi, A., Muñoz‐Sabater, J., Nicolas, J., Peubey, C., Radu, R., Schepers, D., Simmons, A., Soci, C., Abdalla, S., Abellan, X., Balsamo, G., Bechtold, P., Biavati, G., Bidlot, J., Bonavita, M., De Chiara, G., Dahlgren, P., Dee, D., Diamantakis, M., Dragani, R., Flemming, J., Forbes, R., Fuentes, M., Geer, A., Haimberger, L., Healy, S., Hogan, R.J., Hólm, E., Janisková, M., Keeley, S., Laloyaux, P., Lopez, P., Lupu, C., Radnoti, G., de Rosnay, P., Rozum, I., Vamborg, F., Villaume, S., Thépaut, J-N. (2020) The ERA5 global reanalysis. Q J R Meteorol Soc. 2020;146:1999–2049. https://doi.org/10.1002/qj.3803',
        files: [
          {
            id: 'era5_4_file1',
            name: 'ERA5 Ocean Analysis - Monthly Means (Global Ocean)',
            description: 'Monthly averaged ocean data including sea surface temperature, currents, and waves',
            fileType: 'netcdf',
            fileSize: 35000000000, // 35GB
            url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-single-levels-monthly-means?tab=form',
            dateAdded: '2019-05-15T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'era5_4_file2',
            name: 'ERA5 Ocean Analysis - Sea Surface Temperature (Global)',
            description: 'Monthly mean sea surface temperature, global coverage, 0.25 degree resolution',
            fileType: 'netcdf',
            fileSize: 5000000000, // 5GB
            url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-single-levels-monthly-means?tab=form',
            dateAdded: '2019-05-15T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'era5_4_file3',
            name: 'ERA5 Ocean Analysis - Sea Ice Cover (Global)',
            description: 'Monthly mean sea ice cover, global coverage, 0.25 degree resolution',
            fileType: 'netcdf',
            fileSize: 5000000000, // 5GB
            url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-single-levels-monthly-means?tab=form',
            dateAdded: '2019-05-15T00:00:00Z',
            format: 'NetCDF',
          },
        ],
      },
      {
        id: 'era5_5',
        title: 'ERA5 Back Extension (1950-1978)',
        summary: 'The ERA5 back extension provides reanalysis data from 1950 to 1978, extending the main ERA5 dataset which begins in 1979. It includes the same atmospheric, land and ocean variables as the main ERA5 dataset, but with some differences in the data assimilation system due to the limited observations available for this period.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}#era5-back-extension`,
        },
        thumbnail: 'https://climate.copernicus.eu/sites/default/files/2021-09/era5-back-extension-thumbnail.png',
        temporal_coverage: '1950-01-01 to 1978-12-31',
        spatial_coverage: ['Global'],
        variables: ['Temperature', 'Precipitation', 'Humidity', 'Wind', 'Pressure', 'Geopotential', 'Radiation'],
        temporal_resolution: ['Hourly', 'Daily', 'Monthly'],
        spatial_resolution: ['0.25 degree (~31km)', '0.5 degree (~56km)', '1.0 degree (~111km)'],
        quality: 3,
        type: ['Reanalysis', 'Historical', 'Climate Data Record'],
        publication_date: '2021-06-17',
        tags: ['ERA5', 'Reanalysis', 'Historical', 'Back Extension', 'ECMWF', 'Copernicus'],
        category: ['Atmospheric', 'Reanalysis', 'Historical'],
        citation: 'Bell, B., Hersbach, H., Simmons, A., Berrisford, P., Dahlgren, P., Horányi, A., Muñoz‐Sabater, J., Nicolas, J., Radu, R., Schepers, D., Soci, C., Bidlot, J., Haimberger, L., Woollen, J., 2021: The ERA5 global reanalysis: Extension to 1950. (in preparation)',
        files: [
          {
            id: 'era5_5_file1',
            name: 'ERA5 Back Extension - Monthly Means (Global)',
            description: 'Monthly averaged data for all variables from 1950-1978, global coverage, 0.25 degree resolution',
            fileType: 'netcdf',
            fileSize: 80000000000, // 80GB
            url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-single-levels-monthly-means-preliminary-back-extension',
            dateAdded: '2021-06-17T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'era5_5_file2',
            name: 'ERA5 Back Extension - Surface Air Temperature (Global)',
            description: 'Monthly mean 2m temperature from 1950-1978, global coverage, 0.25 degree resolution',
            fileType: 'netcdf',
            fileSize: 8000000000, // 8GB
            url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-single-levels-monthly-means-preliminary-back-extension?tab=form',
            dateAdded: '2021-06-17T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'era5_5_file3',
            name: 'ERA5 Back Extension - Pressure Levels (Global)',
            description: 'Monthly mean pressure level data from 1950-1978, global coverage, 0.25 degree resolution',
            fileType: 'netcdf',
            fileSize: 80000000000, // 80GB
            url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-pressure-levels-monthly-means-preliminary-back-extension',
            dateAdded: '2021-06-17T00:00:00Z',
            format: 'NetCDF',
          },
        ],
      },
    ];
  }

  private createRepository(dataset: any): Repository {
    return {
      id: dataset.id,
      name: dataset.name,
      description: dataset.description,
      variables: dataset.variables?.map(String)
    };
  }
}
