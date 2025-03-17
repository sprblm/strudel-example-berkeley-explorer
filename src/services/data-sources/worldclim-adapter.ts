import { Repository } from '../../pages/search-repositories/_config/taskflow.types';
import { HttpClient } from './http-client';
import { 
  DataSourceAdapter, 
  SearchOptions, 
  SearchResult, 
  SourceMetadata 
} from './types';

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
      
      // Filter by temporal coverage
      if (options.temporal_coverage) {
        const datasetRange = dataset.temporal_coverage.split(' to ');
        if (datasetRange.length !== 2) {
          return false;
        }
        
        // If temporal_coverage is a string with format 'startDate to endDate'
        if (typeof options.temporal_coverage === 'string') {
          const [queryStart, queryEnd] = options.temporal_coverage.split(' to ');
          if (queryEnd < datasetRange[0] || queryStart > datasetRange[1]) {
            return false;
          }
        } 
        // If temporal_coverage is an object with startDate and endDate properties
        else {
          if (options.temporal_coverage.endDate < datasetRange[0] || 
              options.temporal_coverage.startDate > datasetRange[1]) {
            return false;
          }
        }
      }
      
      // Filter by spatial resolution
      if (options.spatial_resolution?.length && !options.spatial_resolution.some(r => 
        dataset.spatial_resolution.some(dr => dr.toLowerCase().includes(r.toLowerCase()))
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
      
      return true;
    });
  }

  /**
   * Generate mock WorldClim dataset repositories for demonstration
   */
  private getMockDatasets(): Repository[] {
    return [
      {
        id: 'worldclim_1',
        title: 'WorldClim Current Climate (v2.1)',
        summary: 'WorldClim version 2.1 climate data for 1970-2000. This dataset includes monthly climate data for minimum, mean, and maximum temperature, precipitation, solar radiation, wind speed, and water vapor pressure, plus bioclimatic variables.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}data/worldclim21.html`,
        },
        thumbnail: 'https://www.worldclim.org/img/screenshot_bio1.jpg',
        temporal_coverage: '1970-01-01 to 2000-12-31',
        spatial_coverage: ['Global', 'Land Only'],
        variables: ['Temperature', 'Precipitation', 'Solar Radiation', 'Wind Speed', 'Water Vapor Pressure', 'Bioclimatic Variables'],
        temporal_resolution: ['Monthly', 'Annual'],
        spatial_resolution: ['30 seconds (~1 km)', '2.5 minutes', '5 minutes', '10 minutes'],
        quality: 5,
        type: ['Gridded Data', 'Current Climate'],
        publication_date: '2020-01-15',
        tags: ['WorldClim', 'Climate', 'Bioclimatic', 'Baseline'],
        category: ['Climate', 'Baseline'],
        citation: 'Fick, S.E. and R.J. Hijmans, 2017. WorldClim 2: New 1km spatial resolution climate surfaces for global land areas. International Journal of Climatology 37 (12): 4302-4315.',
        files: [
          {
            id: 'worldclim_1_file1',
            name: 'WorldClim v2.1 Climate data - 10m Resolution',
            description: 'Complete climate data at 10 minutes (~18 km at equator) spatial resolution',
            fileType: 'zip',
            fileSize: 56000000, // 56MB
            url: 'https://biogeo.ucdavis.edu/data/worldclim/v2.1/base/wc2.1_10m.zip',
            dateAdded: '2020-01-15T00:00:00Z',
            format: 'GeoTIFF',
          },
          {
            id: 'worldclim_1_file2',
            name: 'WorldClim v2.1 Climate data - 5m Resolution',
            description: 'Complete climate data at 5 minutes (~9 km at equator) spatial resolution',
            fileType: 'zip',
            fileSize: 190000000, // 190MB
            url: 'https://biogeo.ucdavis.edu/data/worldclim/v2.1/base/wc2.1_5m.zip',
            dateAdded: '2020-01-15T00:00:00Z',
            format: 'GeoTIFF',
          },
          {
            id: 'worldclim_1_file3',
            name: 'WorldClim v2.1 Climate data - 2.5m Resolution',
            description: 'Complete climate data at 2.5 minutes (~4.5 km at equator) spatial resolution',
            fileType: 'zip',
            fileSize: 680000000, // 680MB
            url: 'https://biogeo.ucdavis.edu/data/worldclim/v2.1/base/wc2.1_2.5m.zip',
            dateAdded: '2020-01-15T00:00:00Z',
            format: 'GeoTIFF',
          },
          {
            id: 'worldclim_1_file4',
            name: 'WorldClim v2.1 Climate data - 30s Resolution',
            description: 'Complete climate data at 30 seconds (~1 km at equator) spatial resolution',
            fileType: 'zip',
            fileSize: 9800000000, // 9.8GB
            url: 'https://biogeo.ucdavis.edu/data/worldclim/v2.1/base/wc2.1_30s.zip',
            dateAdded: '2020-01-15T00:00:00Z',
            format: 'GeoTIFF',
          },
        ],
      },
      {
        id: 'worldclim_2',
        title: 'WorldClim Future Climate (CMIP6)',
        summary: 'Future climate projections for different shared socioeconomic pathways (SSPs) and time periods. Based on global climate models from CMIP6.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}data/cmip6/cmip6_clim2.5m.html`,
        },
        thumbnail: 'https://www.worldclim.org/img/screenshot_cmip6.jpg',
        temporal_coverage: '2021-01-01 to 2100-12-31',
        spatial_coverage: ['Global', 'Land Only'],
        variables: ['Temperature', 'Precipitation', 'Bioclimatic Variables'],
        temporal_resolution: ['Monthly', 'Annual'],
        spatial_resolution: ['2.5 minutes', '5 minutes', '10 minutes'],
        quality: 4,
        type: ['Gridded Data', 'Climate Projection', 'Future Climate'],
        publication_date: '2021-04-20',
        tags: ['WorldClim', 'Climate', 'Future', 'CMIP6', 'SSP'],
        category: ['Climate', 'Projection'],
        citation: 'Fick, S.E. and R.J. Hijmans. WorldClim Future Climate Data. Available at: https://www.worldclim.org/data/cmip6/cmip6_clim2.5m.html',
        files: [
          {
            id: 'worldclim_2_file1',
            name: 'CMIP6 Climate data - SSP1-2.6 (2021-2040)',
            description: 'Climate projections for SSP1-2.6 scenario, 2021-2040 period, across 9 global climate models',
            fileType: 'zip',
            fileSize: 320000000, // 320MB
            url: 'https://biogeo.ucdavis.edu/data/worldclim/v2.1/future/2.5m/wc2.1_2.5m_bioc_ACCESS-ESM1-5_ssp126_2021-2040.zip',
            dateAdded: '2021-04-20T00:00:00Z',
            format: 'GeoTIFF',
          },
          {
            id: 'worldclim_2_file2',
            name: 'CMIP6 Climate data - SSP5-8.5 (2081-2100)',
            description: 'Climate projections for SSP5-8.5 scenario, 2081-2100 period, across 9 global climate models',
            fileType: 'zip',
            fileSize: 320000000, // 320MB
            url: 'https://biogeo.ucdavis.edu/data/worldclim/v2.1/future/2.5m/wc2.1_2.5m_bioc_ACCESS-ESM1-5_ssp585_2081-2100.zip',
            dateAdded: '2021-04-20T00:00:00Z',
            format: 'GeoTIFF',
          },
        ],
      },
      {
        id: 'worldclim_3',
        title: 'WorldClim Paleo Climate (LGM)',
        summary: 'Climate data for the Last Glacial Maximum (LGM, ~21,000 years ago). Based on global climate model simulations from CMIP5/PMIP3.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}data/paleo/paleo_worldclim.html`,
        },
        thumbnail: 'https://www.worldclim.org/img/screenshot_paleo.jpg',
        temporal_coverage: '-21000-01-01 to -21000-12-31', // 21,000 years ago
        spatial_coverage: ['Global', 'Land Only'],
        variables: ['Temperature', 'Precipitation', 'Bioclimatic Variables'],
        temporal_resolution: ['Monthly', 'Annual'],
        spatial_resolution: ['2.5 minutes', '5 minutes', '10 minutes'],
        quality: 3,
        type: ['Gridded Data', 'Historical Climate', 'Paleoclimate'],
        publication_date: '2018-03-15',
        tags: ['WorldClim', 'Climate', 'Paleo', 'LGM', 'PMIP3'],
        category: ['Climate', 'Historical'],
        citation: 'Brown, J., Hill, D., Dolan, A. M., Carnaval, A. C., and Haywood, A. M. 2018. PaleoClim, high spatial resolution paleoclimate surfaces for global land areas. Scientific Data 5: 180254.',
        files: [
          {
            id: 'worldclim_3_file1',
            name: 'LGM Climate data - CCSM4 model (10m)',
            description: 'Last Glacial Maximum climate data based on the CCSM4 model at 10 minutes resolution',
            fileType: 'zip',
            fileSize: 42000000, // 42MB
            url: 'https://biogeo.ucdavis.edu/data/worldclim/v2.1/paleo/wc2.1_10m_lgm_CCSM4.zip',
            dateAdded: '2018-03-15T00:00:00Z',
            format: 'GeoTIFF',
          },
          {
            id: 'worldclim_3_file2',
            name: 'LGM Climate data - MIROC-ESM model (10m)',
            description: 'Last Glacial Maximum climate data based on the MIROC-ESM model at 10 minutes resolution',
            fileType: 'zip',
            fileSize: 42000000, // 42MB
            url: 'https://biogeo.ucdavis.edu/data/worldclim/v2.1/paleo/wc2.1_10m_lgm_MIROC-ESM.zip',
            dateAdded: '2018-03-15T00:00:00Z',
            format: 'GeoTIFF',
          },
        ],
      },
      {
        id: 'worldclim_4',
        title: 'Global Elevation Data (SRTM)',
        summary: 'Digital elevation data for the globe, derived from NASA\'s Shuttle Radar Topography Mission (SRTM). This dataset is useful for topographic analysis and as a covariate in species distribution modeling.',
        source: {
          id: this.id,
          name: this.name,
          logo: this.logoUrl,
          url: `${this.homepageUrl}data/worldclim/v2.1/base/elev.html`,
        },
        thumbnail: 'https://www.worldclim.org/img/screenshot_elev.jpg',
        temporal_coverage: '2000-02-11 to 2000-02-22', // SRTM mission duration
        spatial_coverage: ['Global', 'Land Only'],
        variables: ['Elevation', 'Slope', 'Aspect'],
        temporal_resolution: ['Static'],
        spatial_resolution: ['30 seconds (~1 km)', '2.5 minutes', '5 minutes', '10 minutes'],
        quality: 5,
        type: ['Gridded Data', 'Elevation', 'Topography'],
        publication_date: '2020-01-15',
        tags: ['WorldClim', 'SRTM', 'Elevation', 'Topography', 'DEM'],
        category: ['Topography'],
        citation: 'Jarvis A., H.I. Reuter, A. Nelson, E. Guevara, 2008, Hole-filled SRTM for the globe Version 4, available from the CGIAR-CSI SRTM 90m Database (http://srtm.csi.cgiar.org).',
        files: [
          {
            id: 'worldclim_4_file1',
            name: 'Global Elevation Data - 10m Resolution',
            description: 'SRTM-derived elevation data at 10 minutes spatial resolution',
            fileType: 'zip',
            fileSize: 4000000, // 4MB
            url: 'https://biogeo.ucdavis.edu/data/worldclim/v2.1/base/elev_10m.zip',
            dateAdded: '2020-01-15T00:00:00Z',
            format: 'GeoTIFF',
          },
          {
            id: 'worldclim_4_file2',
            name: 'Global Elevation Data - 5m Resolution',
            description: 'SRTM-derived elevation data at 5 minutes spatial resolution',
            fileType: 'zip',
            fileSize: 13000000, // 13MB
            url: 'https://biogeo.ucdavis.edu/data/worldclim/v2.1/base/elev_5m.zip',
            dateAdded: '2020-01-15T00:00:00Z',
            format: 'GeoTIFF',
          },
          {
            id: 'worldclim_4_file3',
            name: 'Global Elevation Data - 2.5m Resolution',
            description: 'SRTM-derived elevation data at 2.5 minutes spatial resolution',
            fileType: 'zip',
            fileSize: 45000000, // 45MB
            url: 'https://biogeo.ucdavis.edu/data/worldclim/v2.1/base/elev_2.5m.zip',
            dateAdded: '2020-01-15T00:00:00Z',
            format: 'GeoTIFF',
          },
          {
            id: 'worldclim_4_file4',
            name: 'Global Elevation Data - 30s Resolution',
            description: 'SRTM-derived elevation data at 30 seconds spatial resolution',
            fileType: 'zip',
            fileSize: 640000000, // 640MB
            url: 'https://biogeo.ucdavis.edu/data/worldclim/v2.1/base/elev_30s.zip',
            dateAdded: '2020-01-15T00:00:00Z',
            format: 'GeoTIFF',
          },
        ],
      },
    ];
  }
}
