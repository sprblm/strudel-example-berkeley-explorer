import { NOAAAdapter } from './noaa-adapter';
import { NASAAdapter } from './nasa-adapter';
import { WorldClimAdapter } from './worldclim-adapter';
import { CMIP6Adapter } from './cmip6-adapter';
import { ERA5Adapter } from './era5-adapter';
import { UserContributedAdapter } from './user-contributed-adapter';
import { DataSourceAdapter, HttpClientConfig } from './types';
import { UrbanTreeInventoryAdapter } from './urban-tree-inventory-adapter';
import { AirQualityAdapter } from './air-quality-adapter';

/**
 * Factory function to create all data source adapters
 * @param params Optional API parameters that will be applied to all adapters
 * @returns Array of all data source adapters
 */
export function createAllDataSources(params: Partial<HttpClientConfig> = {}): DataSourceAdapter[] {
  return [
    new UrbanTreeInventoryAdapter({
      baseUrl: import.meta.env.VITE_URBAN_TREE_INVENTORY_API_URL as string || '',
      ...params,
    }),
    new AirQualityAdapter({
      baseUrl: import.meta.env.VITE_AIR_QUALITY_API_URL as string || '',
      ...params,
    }),
    new UserContributedAdapter({
      baseUrl: import.meta.env.VITE_USER_CONTRIBUTED_API_URL as string || '',
      ...params,
    }),
  ];
}

/**
 * Factory function to create a specific data source adapter by ID
 * @param sourceId ID of the data source adapter to create
 * @param params Optional API parameters
 * @returns The requested data source adapter or undefined if not found
 */
export function createDataSource(sourceId: string, params: Partial<HttpClientConfig> = {}): DataSourceAdapter | undefined {
  switch (sourceId.toLowerCase()) {
    case 'urban-tree-inventory':
      return new UrbanTreeInventoryAdapter({
        baseUrl: params.baseUrl || '',
        headers: params.headers,
        timeout: params.timeout
      });
    case 'air-quality':
      return new AirQualityAdapter({
        baseUrl: params.baseUrl || '',
        headers: params.headers,
        timeout: params.timeout
      });
    // Add cases for other data sources if necessary
    case 'noaa':
      return new NOAAAdapter({
        baseUrl: import.meta.env.VITE_NOAA_API_URL as string || '',
        ...params,
      });
    case 'nasa':
      return new NASAAdapter({
        baseUrl: import.meta.env.VITE_NASA_API_URL as string || '',
        ...params,
      });
    case 'worldclim':
      return new WorldClimAdapter({
        baseUrl: import.meta.env.VITE_WORLDCLIM_API_URL as string || '',
        ...params,
      });
    case 'cmip6':
      return new CMIP6Adapter({
        baseUrl: import.meta.env.VITE_CMIP6_API_URL as string || '',
        ...params,
      });
    case 'era5':
      return new ERA5Adapter({
        baseUrl: import.meta.env.VITE_ERA5_API_URL as string || '',
        ...params,
      });
    case 'user-contributed':
      return new UserContributedAdapter({
        baseUrl: import.meta.env.VITE_USER_CONTRIBUTED_API_URL as string || '',
        ...params,
      });
    default:
      return undefined;
  }
}

// Export all adapter classes
export { NOAAAdapter };
export { NASAAdapter };
export { WorldClimAdapter };
export { CMIP6Adapter };
export { ERA5Adapter };
export { UserContributedAdapter };
