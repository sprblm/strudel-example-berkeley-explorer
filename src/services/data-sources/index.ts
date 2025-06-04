import { DataSourceAdapter, HttpClientConfig } from './types';
import { UrbanTreeInventoryAdapter } from './urban-tree-inventory-adapter';
import { AirQualityAdapter } from './air-quality-adapter';

/**
 * Factory function to create all data source adapters
 * @param params Optional API parameters that will be applied to all adapters
 * @returns Array of all data source adapters
 */
export function createAllDataSources(
  params: Partial<HttpClientConfig> = {}
): DataSourceAdapter[] {
  return [
    new UrbanTreeInventoryAdapter({
      baseUrl:
        (import.meta.env.VITE_URBAN_TREE_INVENTORY_API_URL as string) || '',
      ...params,
    }),
    new AirQualityAdapter({
      baseUrl: (import.meta.env.VITE_AIR_QUALITY_API_URL as string) || '',
      ...params,
    }),
  ];
}

/**
 * Factory function to create a specific data source adapter by ID
 * @param sourceId The ID of the data source to create
 * @param params Optional API parameters
 * @returns The created data source adapter or null if not found
 */
export function createDataSource(
  sourceId: string,
  params: Partial<HttpClientConfig> = {}
): DataSourceAdapter | null {
  switch (sourceId) {
    case 'urban-tree-inventory':
      return new UrbanTreeInventoryAdapter({
        baseUrl:
          (import.meta.env.VITE_URBAN_TREE_INVENTORY_API_URL as string) || '',
        ...params,
      });
    case 'air-quality':
      return new AirQualityAdapter({
        baseUrl: (import.meta.env.VITE_AIR_QUALITY_API_URL as string) || '',
        ...params,
      });
    default:
      return null;
  }
}

// Export all adapters
export { UrbanTreeInventoryAdapter };
export { AirQualityAdapter };
