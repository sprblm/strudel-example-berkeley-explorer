import { ApiParams, DataSourceAdapter } from './types';
import { HttpClient } from './http-client';
import { NOAAAdapter } from './noaa-adapter';
import { NASAAdapter } from './nasa-adapter';
import { WorldClimAdapter } from './worldclim-adapter';
import { CMIP6Adapter } from './cmip6-adapter';
import { ERA5Adapter } from './era5-adapter';
import { UserContributedAdapter } from './user-contributed-adapter';

/**
 * Factory function to create all data source adapters
 * @param params Optional API parameters that will be applied to all adapters
 * @returns Array of all data source adapters
 */
export function createDataSources(params: ApiParams = {}): DataSourceAdapter[] {
  return [
    new NOAAAdapter(params),
    new NASAAdapter(params),
    new WorldClimAdapter(params),
    new CMIP6Adapter(params),
    new ERA5Adapter(params),
    new UserContributedAdapter(params),
  ];
}

/**
 * Factory function to create a specific data source adapter by ID
 * @param sourceId ID of the data source adapter to create
 * @param params Optional API parameters
 * @returns The requested data source adapter or undefined if not found
 */
export function createDataSource(sourceId: string, params: ApiParams = {}): DataSourceAdapter | undefined {
  switch (sourceId.toLowerCase()) {
    case 'noaa':
      return new NOAAAdapter(params);
    case 'nasa':
      return new NASAAdapter(params);
    case 'worldclim':
      return new WorldClimAdapter(params);
    case 'cmip6':
      return new CMIP6Adapter(params);
    case 'era5':
      return new ERA5Adapter(params);
    case 'user-contributed':
      return new UserContributedAdapter(params);
    default:
      return undefined;
  }
}

// Export all adapter classes and utility types
export { HttpClient };
export { NOAAAdapter };
export { NASAAdapter };
export { WorldClimAdapter };
export { CMIP6Adapter };
export { ERA5Adapter };
export { UserContributedAdapter };
export * from './types';
