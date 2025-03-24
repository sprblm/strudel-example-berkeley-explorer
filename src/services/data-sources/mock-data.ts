import { Repository } from './types';

/**
 * Mock climate datasets for development and testing
 */
export const mockClimateDatasets: Repository[] = [
  {
    id: 'worldclim_1',
    name: 'WorldClim Current Climate (v2.1)',
    description: 'WorldClim version 2.1 climate data for 1970-2000. This dataset includes monthly climate data for minimum, mean, and maximum temperature, precipitation, solar radiation, wind speed, and water vapor pressure, plus bioclimatic variables.',
    url: 'https://www.worldclim.org/data/worldclim21.html',
    variables: ['Temperature', 'Precipitation', 'Solar Radiation', 'Wind Speed', 'Water Vapor Pressure', 'Bioclimatic Variables'],
    citation: 'Fick, S.E. and R.J. Hijmans, 2017. WorldClim 2: New 1km spatial resolution climate surfaces for global land areas. International Journal of Climatology 37 (12): 4302-4315.',
    license: 'CC BY 4.0',
    publisher: 'WorldClim',
    keywords: ['WorldClim', 'Climate', 'Bioclimatic', 'Baseline'],
    version: '2.1',
    source: 'WorldClim',
    temporalCoverage: {
      startDate: '1970-01-01',
      endDate: '2000-12-31'
    },
    spatialCoverage: {
      type: 'global',
      coordinates: [[-180, -90], [180, 90]]
    },
    category: 'Climate',
    tags: ['Climate Change', 'Global Warming'],
    quality: 5,
    spatial_resolution: 'high',
    temporal_resolution: 'monthly',
    type: 'observed',
    thumbnail_url: 'https://www.worldclim.org/img/worldclim_logo.png'
  },
  {
    id: 'worldclim_2',
    name: 'WorldClim Future Climate (CMIP6)',
    description: 'Future climate projections based on the Shared Socioeconomic Pathways (SSPs) from CMIP6 global climate models, downscaled and bias-corrected.',
    url: 'https://www.worldclim.org/data/cmip6/',
    variables: ['Temperature', 'Precipitation', 'Bioclimatic Variables'],
    citation: 'WorldClim, 2020. Future climate data. Available at: https://www.worldclim.org/data/cmip6/cmip6_clim2.5m.html',
    license: 'CC BY 4.0',
    publisher: 'WorldClim',
    keywords: ['Future Climate', 'CMIP6', 'SSP', 'Projections'],
    version: '2.1',
    source: 'WorldClim',
    temporalCoverage: {
      startDate: '2021-01-01',
      endDate: '2100-12-31'
    },
    spatialCoverage: {
      type: 'global',
      coordinates: [[-180, -90], [180, 90]]
    },
    category: 'Climate',
    tags: ['Climate Change', 'Global Warming', 'Projections'],
    quality: 4,
    spatial_resolution: 'medium',
    temporal_resolution: 'monthly',
    type: 'projected',
    thumbnail_url: 'https://www.worldclim.org/img/worldclim_logo.png'
  },
  {
    id: 'noaa_1',
    name: 'NOAA Global Historical Climatology Network',
    description: 'The Global Historical Climatology Network (GHCN) is an integrated database of climate summaries from land surface stations across the globe.',
    url: 'https://www.ncdc.noaa.gov/data-access/land-based-station-data/land-based-datasets/global-historical-climatology-network-ghcn',
    variables: ['Temperature', 'Precipitation'],
    citation: 'Menne, M.J., I. Durre, R.S. Vose, B.E. Gleason, and T.G. Houston, 2012: An overview of the Global Historical Climatology Network-Daily Database. Journal of Atmospheric and Oceanic Technology, 29, 897-910.',
    license: 'Public Domain',
    publisher: 'NOAA',
    keywords: ['NOAA', 'GHCN', 'Historical', 'Station Data'],
    version: '4.0',
    source: 'NOAA',
    temporalCoverage: {
      startDate: '1763-01-01',
      endDate: '2023-12-31'
    },
    spatialCoverage: {
      type: 'global',
      coordinates: [[-180, -90], [180, 90]]
    },
    category: 'Climate',
    tags: ['Climate Change', 'Historical Data'],
    quality: 5,
    spatial_resolution: 'high',
    temporal_resolution: 'daily',
    type: 'observed',
    thumbnail_url: 'https://www.ncdc.noaa.gov/sites/default/files/NOAA%20logo.svg'
  },
  {
    id: 'nasa_1',
    name: 'NASA GISS Surface Temperature Analysis (GISTEMP)',
    description: 'The GISS Surface Temperature Analysis (GISTEMP) is an estimate of global surface temperature change.',
    url: 'https://data.giss.nasa.gov/gistemp/',
    variables: ['Temperature'],
    citation: 'GISTEMP Team, 2023: GISS Surface Temperature Analysis (GISTEMP), version 4. NASA Goddard Institute for Space Studies.',
    license: 'Public Domain',
    publisher: 'NASA',
    keywords: ['NASA', 'GISS', 'Temperature', 'Global Warming'],
    version: '4.0',
    source: 'NASA',
    temporalCoverage: {
      startDate: '1880-01-01',
      endDate: '2023-12-31'
    },
    spatialCoverage: {
      type: 'global',
      coordinates: [[-180, -90], [180, 90]]
    },
    category: 'Climate',
    tags: ['Climate Change', 'Global Warming', 'Temperature'],
    quality: 5,
    spatial_resolution: 'medium',
    temporal_resolution: 'monthly',
    type: 'observed',
    thumbnail_url: 'https://www.nasa.gov/sites/default/files/thumbnails/image/nasa-logo-web-rgb.png'
  },
  {
    id: 'cmip6_1',
    name: 'CMIP6 Multi-Model Ensemble',
    description: 'The Coupled Model Intercomparison Project Phase 6 (CMIP6) multi-model ensemble of climate projections.',
    url: 'https://esgf-node.llnl.gov/projects/cmip6/',
    variables: ['Temperature', 'Precipitation', 'Humidity', 'Wind Speed', 'Pressure', 'Solar Radiation'],
    citation: 'Eyring, V., Bony, S., Meehl, G. A., Senior, C. A., Stevens, B., Stouffer, R. J., and Taylor, K. E., 2016: Overview of the Coupled Model Intercomparison Project Phase 6 (CMIP6) experimental design and organization, Geosci. Model Dev., 9, 1937-1958.',
    license: 'CC BY 4.0',
    publisher: 'WCRP',
    keywords: ['CMIP6', 'Climate Models', 'Projections'],
    version: '6.0',
    source: 'CMIP6',
    temporalCoverage: {
      startDate: '1850-01-01',
      endDate: '2100-12-31'
    },
    spatialCoverage: {
      type: 'global',
      coordinates: [[-180, -90], [180, 90]]
    },
    category: 'Climate',
    tags: ['Climate Change', 'Global Warming', 'Projections'],
    quality: 4,
    spatial_resolution: 'low',
    temporal_resolution: 'monthly',
    type: 'model',
    thumbnail_url: 'https://pcmdi.llnl.gov/CMIP6/ArchiveStatistics/esgf_data_holdings/CMIP6_institution_id.png'
  },
  {
    id: 'era5_1',
    name: 'ERA5 Reanalysis',
    description: 'ERA5 is the fifth generation ECMWF atmospheric reanalysis of the global climate covering the period from 1979 to present.',
    url: 'https://www.ecmwf.int/en/forecasts/datasets/reanalysis-datasets/era5',
    variables: ['Temperature', 'Precipitation', 'Humidity', 'Wind Speed', 'Pressure', 'Cloud Cover'],
    citation: 'Hersbach, H., Bell, B., Berrisford, P., et al., 2020: The ERA5 global reanalysis. Q J R Meteorol Soc., 146, 1999-2049.',
    license: 'Copernicus License',
    publisher: 'ECMWF',
    keywords: ['ERA5', 'Reanalysis', 'ECMWF'],
    version: '5.0',
    source: 'ERA5',
    temporalCoverage: {
      startDate: '1979-01-01',
      endDate: '2023-12-31'
    },
    spatialCoverage: {
      type: 'global',
      coordinates: [[-180, -90], [180, 90]]
    },
    category: 'Climate',
    tags: ['Reanalysis', 'Climate Change'],
    quality: 5,
    spatial_resolution: 'medium',
    temporal_resolution: 'hourly',
    type: 'reanalysis',
    thumbnail_url: 'https://www.ecmwf.int/sites/default/files/ECMWF_Master_Logo_RGB_nostrap.png'
  },
  {
    id: 'user_1',
    name: 'Urban Heat Island Study - New York City',
    description: 'A comprehensive dataset of temperature measurements across New York City boroughs showing urban heat island effects.',
    url: 'https://example.com/uhi-nyc',
    variables: ['Temperature'],
    citation: 'Smith, J. et al., 2022. Urban Heat Island Effects in New York City 2018-2022. Journal of Urban Climate, 15, 45-67.',
    license: 'CC BY-NC 4.0',
    publisher: 'NYC Environmental Research Group',
    keywords: ['Urban Heat Island', 'New York', 'Temperature', 'Urban Climate'],
    version: '1.2',
    source: 'User',
    temporalCoverage: {
      startDate: '2018-06-01',
      endDate: '2022-09-30'
    },
    spatialCoverage: {
      type: 'region',
      coordinates: [[-74.25, 40.5], [-73.7, 40.9]]
    },
    category: 'Urban Climate',
    tags: ['Urban Climate', 'Heat Island', 'City'],
    quality: 4,
    spatial_resolution: 'high',
    temporal_resolution: 'hourly',
    type: 'observed',
    thumbnail_url: 'https://example.com/uhi-nyc-thumbnail.jpg'
  },
  {
    id: 'user_2',
    name: 'Coastal Flooding Dataset - Southeast Asia',
    description: 'Measurements and projections of sea level rise and coastal flooding events across Southeast Asian coastal cities.',
    url: 'https://example.com/coastal-flooding-sea',
    variables: ['Sea Level', 'Precipitation'],
    citation: 'Nguyen, T. et al., 2023. Coastal Flooding Vulnerability in Southeast Asia. Coastal Engineering Journal, 28(3), 210-235.',
    license: 'CC BY 4.0',
    publisher: 'Southeast Asia Climate Consortium',
    keywords: ['Coastal Flooding', 'Sea Level Rise', 'Southeast Asia', 'Climate Change'],
    version: '2.0',
    source: 'User',
    temporalCoverage: {
      startDate: '2000-01-01',
      endDate: '2050-12-31'
    },
    spatialCoverage: {
      type: 'region',
      coordinates: [[95, 0], [130, 25]]
    },
    category: 'Sea Level Rise',
    tags: ['Coastal', 'Flooding', 'Sea Level Rise'],
    quality: 4,
    spatial_resolution: 'medium',
    temporal_resolution: 'daily',
    type: 'observed',
    thumbnail_url: 'https://example.com/coastal-sea-thumbnail.jpg'
  }
];
