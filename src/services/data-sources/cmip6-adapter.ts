import { Repository } from '../../pages/search-repositories/_config/taskflow.types';
import { HttpClient } from './http-client';
import { HttpClientConfig } from './types';
import { 
  DataSourceAdapter, 
  SearchOptions, 
  SearchResult, 
  SourceMetadata 
} from './types';

/**
 * CMIP6 API adapter
 * For accessing data from the Coupled Model Intercomparison Project Phase 6
 */
export class CMIP6Adapter implements DataSourceAdapter {
  public readonly id = 'cmip6';
  public readonly name = 'CMIP6 Climate Models';
  public readonly homepageUrl = 'https://esgf-node.llnl.gov/projects/cmip6/';
  public readonly logoUrl = 'https://pcmdi.llnl.gov/CMIP6/ArchiveStatistics/CMIP6_logo_web.png';
  public readonly description = 'The Coupled Model Intercomparison Project Phase 6 (CMIP6) is the sixth phase of an ongoing coordinated international climate model experiment. CMIP6 provides a framework for climate model simulations that inform the IPCC assessment reports.';

  private client: HttpClient;
  private cache = new Map<string, any>();

  constructor(params: HttpClientConfig) {
    this.client = new HttpClient(params);
  }

  /**
   * Search for datasets in CMIP6 based on provided filters
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
      console.error('Error searching CMIP6 datasets:', error);
      return {
        datasets: [],
        total: 0,
        page: options.page || 1,
        limit: options.limit || 25,
      };
    }
  }

  /**
   * Get detailed information about a specific CMIP6 dataset
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
      console.error(`Error fetching CMIP6 dataset details for ${datasetId}:`, error);
      throw error;
    }
  }

  /**
   * Get metadata about the CMIP6 data source
   */
  async getSourceMetadata(): Promise<SourceMetadata> {
    try {
      return {
        variables: [
          'Temperature',
          'Precipitation', 
          'Sea Level Pressure',
          'Surface Wind',
          'Ocean Temperature',
          'Ocean Salinity',
          'Sea Ice',
          'Land Ice',
          'Carbon Cycle',
          'Aerosols',
          'Cloud Cover',
          'Atmospheric Chemistry',
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
          spatial: ['100km', '50km', '25km', 'Native Model Resolution'],
          temporal: ['Monthly', 'Daily', '6-Hourly', '3-Hourly', 'Hourly'],
        },
        types: [
          'Historical',
          'ScenarioMIP (SSP)',
          'DECK',
          'AerChemMIP',
          'C4MIP',
          'DCPP',
          'HighResMIP',
          'ISMIP6',
          'LUMIP',
          'OMIP',
          'PAMIP',
          'RFMIP',
          'VolMIP',
        ],
        timePeriod: {
          start: '1850-01-01',
          end: '2300-12-31', // Some scenarios extend to 2300
        },
        models: [
          'ACCESS-CM2',
          'ACCESS-ESM1-5',
          'BCC-CSM2-MR',
          'CanESM5',
          'CESM2',
          'CNRM-CM6-1',
          'CNRM-ESM2-1',
          'EC-Earth3',
          'EC-Earth3-Veg',
          'GFDL-ESM4',
          'INM-CM4-8',
          'INM-CM5-0',
          'IPSL-CM6A-LR',
          'MIROC-ES2L',
          'MIROC6',
          'MPI-ESM1-2-HR',
          'MPI-ESM1-2-LR',
          'MRI-ESM2-0',
          'NorESM2-LM',
          'NorESM2-MM',
          'UKESM1-0-LL',
        ],
        experiments: [
          'historical',
          'ssp119',
          'ssp126',
          'ssp245',
          'ssp370',
          'ssp585',
          'piControl',
          'abrupt-4xCO2',
          '1pctCO2',
          'amip',
        ],
      };
    } catch (error) {
      console.error('Error fetching CMIP6 metadata:', error);
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

  private createRepository(dataset: any): Repository {
    return {
      id: dataset.id,
      name: dataset.name,
      description: dataset.description,
      variables: dataset.variables?.map(String),
      spatial_coverage: dataset.spatial_range 
        ? `${dataset.spatial_range.minLat}-${dataset.spatial_range.maxLat}, ${dataset.spatial_range.minLon}-${dataset.spatial_range.maxLon}`
        : undefined
    };
  }

  /**
   * Generate mock CMIP6 dataset repositories for demonstration
   */
  private getMockDatasets(): Repository[] {
    return [
      {
        id: 'cmip6_1',
        title: 'CMIP6 Historical Simulations (1850-2014)',
        summary: 'Historical climate simulations from the Coupled Model Intercomparison Project Phase 6 (CMIP6). These runs simulate Earth\'s climate from 1850 to 2014 using observed atmospheric composition changes from both anthropogenic and natural sources.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}?experiment_id=historical`,
        },
        thumbnail: 'https://pcmdi.llnl.gov/CMIP6/ArchiveStatistics/esgf_data_holdings/CMIP6/global_air_temperature_anomaly.png',
        temporal_coverage: '1850-01-01 to 2014-12-31',
        spatial_coverage: ['Global'],
        variables: ['Temperature', 'Precipitation', 'Humidity', 'Surface Pressure', 'Wind', 'Radiation', 'Carbon Cycle'],
        temporal_resolution: ['Monthly', 'Daily'],
        spatial_resolution: ['Native Model Resolution', '100km', '50km'],
        quality: 5,
        type: ['Climate Model', 'Historical', 'CMIP6 DECK'],
        publication_date: '2019-05-20',
        tags: ['CMIP6', 'Historical', 'Climate Model', 'IPCC', 'AR6'],
        category: ['Climate', 'Model Output'],
        citation: 'Eyring, V., Bony, S., Meehl, G. A., Senior, C. A., Stevens, B., Stouffer, R. J., and Taylor, K. E., 2016: Overview of the Coupled Model Intercomparison Project Phase 6 (CMIP6) experimental design and organization, Geosci. Model Dev., 9, 1937-1958, doi:10.5194/gmd-9-1937-2016.',
        files: [
          {
            id: 'cmip6_1_file1',
            name: 'CMIP6 Historical Temperature Data (Monthly)',
            description: 'Monthly mean surface air temperature from historical simulations across multiple models',
            fileType: 'netcdf',
            fileSize: 4500000000, // 4.5GB
            url: 'https://esgf-node.llnl.gov/search/cmip6/?mip_era=CMIP6&activity_id=CMIP&experiment_id=historical&variable_id=tas&frequency=mon',
            dateAdded: '2019-05-20T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'cmip6_1_file2',
            name: 'CMIP6 Historical Precipitation Data (Monthly)',
            description: 'Monthly mean precipitation from historical simulations across multiple models',
            fileType: 'netcdf',
            fileSize: 4200000000, // 4.2GB
            url: 'https://esgf-node.llnl.gov/search/cmip6/?mip_era=CMIP6&activity_id=CMIP&experiment_id=historical&variable_id=pr&frequency=mon',
            dateAdded: '2019-05-20T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'cmip6_1_file3',
            name: 'CMIP6 Historical Sea Level Pressure Data (Monthly)',
            description: 'Monthly mean sea level pressure from historical simulations across multiple models',
            fileType: 'netcdf',
            fileSize: 3800000000, // 3.8GB
            url: 'https://esgf-node.llnl.gov/search/cmip6/?mip_era=CMIP6&activity_id=CMIP&experiment_id=historical&variable_id=psl&frequency=mon',
            dateAdded: '2019-05-20T00:00:00Z',
            format: 'NetCDF',
          },
        ],
      },
      {
        id: 'cmip6_2',
        title: 'CMIP6 SSP5-8.5 Scenario (2015-2100)',
        summary: 'Future climate projections based on the SSP5-8.5 scenario from the Coupled Model Intercomparison Project Phase 6 (CMIP6). This scenario represents a high fossil fuel development pathway with high challenges to mitigation and low challenges to adaptation.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}?experiment_id=ssp585`,
        },
        thumbnail: 'https://pcmdi.llnl.gov/CMIP6/ArchiveStatistics/esgf_data_holdings/ScenarioMIP/ssp585_warming.png',
        temporal_coverage: '2015-01-01 to 2100-12-31',
        spatial_coverage: ['Global'],
        variables: ['Temperature', 'Precipitation', 'Humidity', 'Surface Pressure', 'Wind', 'Radiation', 'Carbon Cycle', 'Ocean Temperature', 'Sea Ice'],
        temporal_resolution: ['Monthly', 'Daily'],
        spatial_resolution: ['Native Model Resolution', '100km', '50km'],
        quality: 4,
        type: ['Climate Model', 'Projection', 'ScenarioMIP', 'SSP5-8.5'],
        publication_date: '2019-09-15',
        tags: ['CMIP6', 'SSP5-8.5', 'Climate Projection', 'IPCC', 'AR6', 'High Emissions'],
        category: ['Climate', 'Model Output', 'Projection'],
        citation: 'O\'Neill, B. C., Tebaldi, C., van Vuuren, D. P., Eyring, V., Friedlingstein, P., Hurtt, G., Knutti, R., Kriegler, E., Lamarque, J.-F., Lowe, J., Meehl, G. A., Moss, R., Riahi, K., and Sanderson, B. M., 2016: The Scenario Model Intercomparison Project (ScenarioMIP) for CMIP6, Geosci. Model Dev., 9, 3461-3482, doi:10.5194/gmd-9-3461-2016.',
        files: [
          {
            id: 'cmip6_2_file1',
            name: 'CMIP6 SSP5-8.5 Temperature Data (Monthly)',
            description: 'Monthly mean surface air temperature projections for SSP5-8.5 across multiple models',
            fileType: 'netcdf',
            fileSize: 5200000000, // 5.2GB
            url: 'https://esgf-node.llnl.gov/search/cmip6/?mip_era=CMIP6&activity_id=ScenarioMIP&experiment_id=ssp585&variable_id=tas&frequency=mon',
            dateAdded: '2019-09-15T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'cmip6_2_file2',
            name: 'CMIP6 SSP5-8.5 Precipitation Data (Monthly)',
            description: 'Monthly mean precipitation projections for SSP5-8.5 across multiple models',
            fileType: 'netcdf',
            fileSize: 4800000000, // 4.8GB
            url: 'https://esgf-node.llnl.gov/search/cmip6/?mip_era=CMIP6&activity_id=ScenarioMIP&experiment_id=ssp585&variable_id=pr&frequency=mon',
            dateAdded: '2019-09-15T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'cmip6_2_file3',
            name: 'CMIP6 SSP5-8.5 Sea Surface Temperature Data (Monthly)',
            description: 'Monthly mean sea surface temperature projections for SSP5-8.5 across multiple models',
            fileType: 'netcdf',
            fileSize: 6500000000, // 6.5GB
            url: 'https://esgf-node.llnl.gov/search/cmip6/?mip_era=CMIP6&activity_id=ScenarioMIP&experiment_id=ssp585&variable_id=tos&frequency=mon',
            dateAdded: '2019-09-15T00:00:00Z',
            format: 'NetCDF',
          },
        ],
      },
      {
        id: 'cmip6_3',
        title: 'CMIP6 SSP1-2.6 Scenario (2015-2100)',
        summary: 'Future climate projections based on the SSP1-2.6 scenario from the Coupled Model Intercomparison Project Phase 6 (CMIP6). This scenario represents a sustainable development pathway with low challenges to mitigation and low challenges to adaptation, consistent with achieving the Paris Agreement targets.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}?experiment_id=ssp126`,
        },
        thumbnail: 'https://pcmdi.llnl.gov/CMIP6/ArchiveStatistics/esgf_data_holdings/ScenarioMIP/ssp126_warming.png',
        temporal_coverage: '2015-01-01 to 2100-12-31',
        spatial_coverage: ['Global'],
        variables: ['Temperature', 'Precipitation', 'Humidity', 'Surface Pressure', 'Wind', 'Radiation', 'Carbon Cycle', 'Ocean Temperature', 'Sea Ice'],
        temporal_resolution: ['Monthly', 'Daily'],
        spatial_resolution: ['Native Model Resolution', '100km', '50km'],
        quality: 4,
        type: ['Climate Model', 'Projection', 'ScenarioMIP', 'SSP1-2.6'],
        publication_date: '2019-09-15',
        tags: ['CMIP6', 'SSP1-2.6', 'Climate Projection', 'IPCC', 'AR6', 'Low Emissions', 'Paris Agreement'],
        category: ['Climate', 'Model Output', 'Projection'],
        citation: 'O\'Neill, B. C., Tebaldi, C., van Vuuren, D. P., Eyring, V., Friedlingstein, P., Hurtt, G., Knutti, R., Kriegler, E., Lamarque, J.-F., Lowe, J., Meehl, G. A., Moss, R., Riahi, K., and Sanderson, B. M., 2016: The Scenario Model Intercomparison Project (ScenarioMIP) for CMIP6, Geosci. Model Dev., 9, 3461-3482, doi:10.5194/gmd-9-3461-2016.',
        files: [
          {
            id: 'cmip6_3_file1',
            name: 'CMIP6 SSP1-2.6 Temperature Data (Monthly)',
            description: 'Monthly mean surface air temperature projections for SSP1-2.6 across multiple models',
            fileType: 'netcdf',
            fileSize: 5100000000, // 5.1GB
            url: 'https://esgf-node.llnl.gov/search/cmip6/?mip_era=CMIP6&activity_id=ScenarioMIP&experiment_id=ssp126&variable_id=tas&frequency=mon',
            dateAdded: '2019-09-15T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'cmip6_3_file2',
            name: 'CMIP6 SSP1-2.6 Precipitation Data (Monthly)',
            description: 'Monthly mean precipitation projections for SSP1-2.6 across multiple models',
            fileType: 'netcdf',
            fileSize: 4700000000, // 4.7GB
            url: 'https://esgf-node.llnl.gov/search/cmip6/?mip_era=CMIP6&activity_id=ScenarioMIP&experiment_id=ssp126&variable_id=pr&frequency=mon',
            dateAdded: '2019-09-15T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'cmip6_3_file3',
            name: 'CMIP6 SSP1-2.6 Sea Ice Data (Monthly)',
            description: 'Monthly mean sea ice concentration projections for SSP1-2.6 across multiple models',
            fileType: 'netcdf',
            fileSize: 3800000000, // 3.8GB
            url: 'https://esgf-node.llnl.gov/search/cmip6/?mip_era=CMIP6&activity_id=ScenarioMIP&experiment_id=ssp126&variable_id=siconc&frequency=mon',
            dateAdded: '2019-09-15T00:00:00Z',
            format: 'NetCDF',
          },
        ],
      },
      {
        id: 'cmip6_4',
        title: 'CMIP6 HighResMIP Global High-Resolution Models',
        summary: 'High-resolution global climate model simulations from the High Resolution Model Intercomparison Project (HighResMIP) for CMIP6. These simulations aim to assess the robust benefits of increased horizontal resolution in climate models.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}?activity_id=HighResMIP`,
        },
        thumbnail: 'https://pcmdi.llnl.gov/CMIP6/ArchiveStatistics/esgf_data_holdings/HighResMIP/highres_thumbnail.png',
        temporal_coverage: '1950-01-01 to 2050-12-31',
        spatial_coverage: ['Global'],
        variables: ['Temperature', 'Precipitation', 'Wind', 'Sea Surface Temperature', 'Tropical Cyclones', 'Blocking Events', 'Ocean Circulation'],
        temporal_resolution: ['Daily', '3-Hourly'],
        spatial_resolution: ['25km', '50km'],
        quality: 5,
        type: ['Climate Model', 'High Resolution', 'HighResMIP'],
        publication_date: '2019-10-10',
        tags: ['CMIP6', 'HighResMIP', 'High Resolution', 'Extreme Events', 'IPCC', 'AR6'],
        category: ['Climate', 'Model Output', 'High Resolution'],
        citation: 'Haarsma, R. J., Roberts, M. J., Vidale, P. L., Senior, C. A., Bellucci, A., Bao, Q., Chang, P., Corti, S., Fučkar, N. S., Guemas, V., von Hardenberg, J., Hazeleger, W., Kodama, C., Koenigk, T., Leung, L. R., Lu, J., Luo, J.-J., Mao, J., Mizielinski, M. S., Mizuta, R., Nobre, P., Satoh, M., Scoccimarro, E., Semmler, T., Small, J., and von Storch, J.-S., 2016: High Resolution Model Intercomparison Project (HighResMIP v1.0) for CMIP6, Geosci. Model Dev., 9, 4185-4208, doi:10.5194/gmd-9-4185-2016.',
        files: [
          {
            id: 'cmip6_4_file1',
            name: 'HighResMIP Daily Temperature Data',
            description: 'Daily mean surface air temperature from high-resolution models',
            fileType: 'netcdf',
            fileSize: 8500000000, // 8.5GB
            url: 'https://esgf-node.llnl.gov/search/cmip6/?mip_era=CMIP6&activity_id=HighResMIP&variable_id=tas&frequency=day',
            dateAdded: '2019-10-10T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'cmip6_4_file2',
            name: 'HighResMIP Daily Precipitation Data',
            description: 'Daily mean precipitation from high-resolution models',
            fileType: 'netcdf',
            fileSize: 7800000000, // 7.8GB
            url: 'https://esgf-node.llnl.gov/search/cmip6/?mip_era=CMIP6&activity_id=HighResMIP&variable_id=pr&frequency=day',
            dateAdded: '2019-10-10T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'cmip6_4_file3',
            name: 'HighResMIP Tropical Cyclone Tracking Data',
            description: 'Tropical cyclone track data from high-resolution models',
            fileType: 'csv',
            fileSize: 250000000, // 250MB
            url: 'https://esgf-node.llnl.gov/search/cmip6/?mip_era=CMIP6&activity_id=HighResMIP&variable_id=track',
            dateAdded: '2019-10-10T00:00:00Z',
            format: 'CSV',
          },
        ],
      },
      {
        id: 'cmip6_5',
        title: 'CMIP6 DAMIP Detection and Attribution Experiments',
        summary: 'Climate model simulations from the Detection and Attribution Model Intercomparison Project (DAMIP) for CMIP6. These simulations aim to facilitate detection and attribution studies of observed climate changes to specific forcings, such as greenhouse gases, aerosols, and natural forcings.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}?activity_id=DAMIP`,
        },
        thumbnail: 'https://pcmdi.llnl.gov/CMIP6/ArchiveStatistics/esgf_data_holdings/DAMIP/damip_thumbnail.png',
        temporal_coverage: '1850-01-01 to 2020-12-31',
        spatial_coverage: ['Global'],
        variables: ['Temperature', 'Precipitation', 'Radiation', 'Ocean Heat Content'],
        temporal_resolution: ['Monthly', 'Annual'],
        spatial_resolution: ['100km', 'Native Model Resolution'],
        quality: 4,
        type: ['Climate Model', 'Detection and Attribution', 'DAMIP'],
        publication_date: '2019-08-05',
        tags: ['CMIP6', 'DAMIP', 'Attribution', 'Climate Change', 'IPCC', 'AR6'],
        category: ['Climate', 'Model Output', 'Attribution'],
        citation: 'Gillett, N. P., Shiogama, H., Funke, B., Hegerl, G., Knutti, R., Matthes, K., Santer, B. D., Stone, D., and Tebaldi, C., 2016: The Detection and Attribution Model Intercomparison Project (DAMIP v1.0) contribution to CMIP6, Geosci. Model Dev., 9, 3685-3697, doi:10.5194/gmd-9-3685-2016.',
        files: [
          {
            id: 'cmip6_5_file1',
            name: 'DAMIP GHG-only Temperature Data',
            description: 'Monthly mean surface air temperature from greenhouse-gas-only forced simulations',
            fileType: 'netcdf',
            fileSize: 3600000000, // 3.6GB
            url: 'https://esgf-node.llnl.gov/search/cmip6/?mip_era=CMIP6&activity_id=DAMIP&experiment_id=hist-GHG&variable_id=tas&frequency=mon',
            dateAdded: '2019-08-05T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'cmip6_5_file2',
            name: 'DAMIP Aerosol-only Temperature Data',
            description: 'Monthly mean surface air temperature from aerosol-only forced simulations',
            fileType: 'netcdf',
            fileSize: 3600000000, // 3.6GB
            url: 'https://esgf-node.llnl.gov/search/cmip6/?mip_era=CMIP6&activity_id=DAMIP&experiment_id=hist-aer&variable_id=tas&frequency=mon',
            dateAdded: '2019-08-05T00:00:00Z',
            format: 'NetCDF',
          },
          {
            id: 'cmip6_5_file3',
            name: 'DAMIP Natural-only Temperature Data',
            description: 'Monthly mean surface air temperature from natural-only forced simulations',
            fileType: 'netcdf',
            fileSize: 3600000000, // 3.6GB
            url: 'https://esgf-node.llnl.gov/search/cmip6/?mip_era=CMIP6&activity_id=DAMIP&experiment_id=hist-nat&variable_id=tas&frequency=mon',
            dateAdded: '2019-08-05T00:00:00Z',
            format: 'NetCDF',
          },
        ],
      },
    ];
  }
}
