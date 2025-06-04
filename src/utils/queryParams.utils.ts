import { DataFilter, FilterConfig } from '../types/filters.types';
import * as d3Fetch from 'd3-fetch';
import * as d3Dsv from 'd3-dsv';
import { createDataSource } from '../services/data-sources';
import { SearchOptions } from '../services/data-sources/types';

/**
 * Convert an array of values to a URL param by
 * joining the values with a separator.
 */
const toParamArrayString = (
  field: string,
  value: DataFilter['value'],
  separator = ','
) => {
  if (Array.isArray(value)) {
    return `${field}=${value.join(separator)}`;
  } else {
    return '';
  }
};

/**
 * Convert an array of values to URL params by
 * repeating the param for each value in the array.
 */
const toParamRepeated = (field: string, value: DataFilter['value']) => {
  let paramsString = '';
  if (Array.isArray(value)) {
    const valuesLength = value?.length;
    value.forEach((optionValue, k) => {
      paramsString = paramsString.concat(`${field}=${optionValue}`);
      if (k < valuesLength - 1) {
        paramsString = paramsString.concat('&');
      }
    });
  }
  return paramsString;
};

/**
 * Convert an array [min, max] to two URL params,
 * one for the min value and one for the max value.
 */
const toParamMinMax = (
  field: string,
  value: DataFilter['value'],
  minParam?: string,
  maxParam?: string
) => {
  if (Array.isArray(value) && minParam && maxParam) {
    const minParamString = `${minParam}=${value[0]}`;
    const maxParamString = `${maxParam}=${value[1]}`;
    return `${minParamString}&${maxParamString}`;
  } else {
    return '';
  }
};

/**
 * Using an array of active filters and a corresponding array of filter
 * config objects, build a valid query params string for the URL.
 */
export const buildParamsString = (
  filters: DataFilter[],
  filterConfigs: FilterConfig[]
) => {
  let paramsString = '';
  filters.forEach((filter, i) => {
    const filterConfig = filterConfigs.find((c) => c.field === filter.field);
    switch (filterConfig?.paramType) {
      case 'array-string':
        paramsString = paramsString.concat(
          toParamArrayString(
            filter.field,
            filter.value,
            filterConfig.paramTypeOptions?.separator || ','
          )
        );
        break;
      case 'repeated':
        paramsString = paramsString.concat(
          toParamRepeated(filter.field, filter.value)
        );
        break;
      case 'minmax':
        paramsString = paramsString.concat(
          toParamMinMax(
            filter.field,
            filter.value,
            filterConfig.paramTypeOptions?.minParam ||
              `min_${filterConfig.field}`,
            filterConfig.paramTypeOptions?.maxParam ||
              `max_${filterConfig.field}`
          )
        );
        break;
      default:
        paramsString = paramsString.concat(`${filter.field}=${filter.value}`);
    }
    if (i < filters.length - 1) {
      paramsString = paramsString.concat('&');
    }
  });
  return paramsString;
};

export const createFilterParams = (
  filters: DataFilter[],
  filterConfigs: FilterConfig[]
) => {
  const params = new URLSearchParams();
  filters.forEach((filter) => {
    const filterConfig = filterConfigs.find((c) => c.field === filter.field);
    const options = filterConfig?.paramTypeOptions;
    switch (filterConfig?.paramType) {
      case 'array-string':
        if (Array.isArray(filter.value)) {
          const separator = options?.separator || ',';
          params.append(filter.field, filter.value.join(separator));
        }
        break;
      case 'minmax':
        if (
          Array.isArray(filter.value) &&
          options?.minParam &&
          options?.maxParam
        ) {
          params.append(
            options?.minParam || `min_${filter.field}`,
            filter.value[0].toString()
          );
          params.append(
            options?.maxParam || `max_${filter.field}`,
            filter.value[1].toString()
          );
        }
        break;
      case 'repeated':
        if (Array.isArray(filter.value)) {
          filter.value.forEach((value) => {
            params.append(filter.field, value.toString());
          });
        }
        break;
      default:
        if (filter.value) {
          params.append(filter.field, filter.value.toString());
        }
    }
  });
  return params;
};

/**
 * Cleans a URL by removing any trailing slash
 */
export const cleanUrl = (url: string): string => {
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

/**
 * Cleans a path by removing duplicate slashes
 */
export const cleanPath = (url: string): string => {
  return url.replace(/\/\//g, '/');
};

/**
 * Parse an adapter URL to extract the adapter name and path
 * Example: "worldclim://datasets" -> { adapterName: "worldclim", path: "datasets" }
 */
export const parseAdapterUrl = (
  url: string
): { adapterName: string; path: string } | null => {
  const adapterUrlPattern = /^([a-z0-9-]+):\/\/(.*)$/i;
  const match = url.match(adapterUrlPattern);

  if (!match) {
    return null;
  }

  return {
    adapterName: match[1],
    path: match[2],
  };
};

/**
 * Handle a request via an adapter URL by calling the appropriate adapter's methods
 */
export const handleAdapterUrl = async (
  url: string,
  queryParams: URLSearchParams
): Promise<any> => {
  console.log('handleAdapterUrl: Processing adapter URL', {
    url,
    queryParams: queryParams.toString(),
  });

  const parsedUrl = parseAdapterUrl(url);
  if (!parsedUrl) {
    throw new Error(`Invalid adapter URL format: ${url}`);
  }

  const { adapterName, path } = parsedUrl;
  console.log('handleAdapterUrl: Parsed URL', { adapterName, path });

  // Create the appropriate adapter instance
  const adapter = createDataSource(adapterName);
  if (!adapter) {
    throw new Error(`Unknown adapter: ${adapterName}`);
  }

  console.log(
    `handleAdapterUrl: Using ${adapterName} adapter to handle request`
  );

  // Convert query params to options object
  const searchOptions: SearchOptions = {
    query: queryParams.get('query') || '',
    limit: parseInt(queryParams.get('limit') || '25', 10),
    page: parseInt(queryParams.get('page') || '1', 10),
  };

  if (queryParams.has('variables')) {
    searchOptions.variables = queryParams.get('variables')?.split(',') || [];
  }

  if (path === 'datasets') {
    console.log(
      'handleAdapterUrl: Calling searchDatasets with options',
      searchOptions
    );
    return await adapter.searchDatasets(searchOptions);
  } else if (path.startsWith('datasets/')) {
    const datasetId = path.replace('datasets/', '');
    console.log('handleAdapterUrl: Calling getDatasetDetails for', datasetId);
    return await adapter.getDatasetDetails(datasetId);
  } else {
    throw new Error(`Unsupported adapter path: ${path}`);
  }
};

/**
 * Fetch data from a local CSV, TSV, or JSON, or an external API
 * that returns JSON.
 */
export const fetchData = async (dataSource: string, signal?: AbortSignal) => {
  // Check if this is an adapter URL (e.g., worldclim://datasets)
  const isAdapter =
    dataSource.includes('://') && !dataSource.startsWith('http');
  if (isAdapter) {
    console.log('fetchData: Detected adapter URL, parsing query params');
    // Extract query params if they exist
    let queryParams = new URLSearchParams();
    const queryStringIndex = dataSource.indexOf('?');
    if (queryStringIndex !== -1) {
      const queryString = dataSource.substring(queryStringIndex + 1);
      queryParams = new URLSearchParams(queryString);
      dataSource = dataSource.substring(0, queryStringIndex);
    }

    try {
      console.log('fetchData: Handling adapter URL', {
        dataSource,
        queryParams: queryParams.toString(),
      });
      const result = await handleAdapterUrl(dataSource, queryParams);
      console.log('fetchData: Adapter returned result', result);
      return result;
    } catch (error) {
      console.error('fetchData: Error handling adapter URL:', error);
      throw error;
    }
  }

  // Get the base portion of the URL. Will be blank when running locally.
  const base = document.querySelector('base')?.getAttribute('href') ?? '';
  // Use the VITE_BASE_URL env variable to specify a path prefix that
  // should be added to routes and local requests
  const basePath = import.meta.env.VITE_BASE_URL || '';
  const basename = base + basePath;
  const fileExtension = dataSource.split('.').pop();
  const isExternal = dataSource.startsWith('http');
  const dataSourcePath = isExternal
    ? cleanUrl(dataSource)
    : cleanUrl(`${basename}/${dataSource}`);
  let data: any = [];

  console.log('fetchData: Attempting to fetch data', {
    dataSource,
    fileExtension,
    isExternal,
    base,
    basePath,
    basename,
    dataSourcePath,
  });

  try {
    if (fileExtension === 'csv') {
      // d3-fetch doesn't support AbortController, so we'll use fetch directly
      if (signal) {
        const response = await fetch(dataSourcePath, { signal });
        const text = await response.text();
        data = d3Dsv.csvParse(text);
      } else {
        data = await d3Fetch.csv(dataSourcePath);
      }
    } else if (fileExtension === 'tsv') {
      if (signal) {
        const response = await fetch(dataSourcePath, { signal });
        const text = await response.text();
        data = d3Dsv.tsvParse(text);
      } else {
        data = await d3Fetch.tsv(dataSourcePath);
      }
    } else if (fileExtension === 'json' || isExternal) {
      console.log(`fetchData: Fetching JSON from ${dataSourcePath}`);
      try {
        const response = await fetch(dataSourcePath, { signal });
        console.log('fetchData: Response status:', response.status);
        if (!response.ok) {
          console.error(`fetchData: Error response status: ${response.status}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('fetchData: Successfully loaded JSON data', result);

        // Special handling for adapter responses like WorldClim
        if (isAdapter && result && result.datasets) {
          console.log(
            'fetchData: Detected adapter response with datasets property, extracting datasets'
          );
          data = result.datasets;
        } else {
          data = result;
        }

        console.log('fetchData: Final data to return', {
          dataLength: Array.isArray(data) ? data.length : 'non-array',
        });
      } catch (fetchError) {
        console.error('fetchData: Error during fetch operation:', fetchError);
        throw fetchError;
      }
    }
    return data;
  } catch (error) {
    // Don't throw if it's an abort error
    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'AbortError'
    ) {
      console.log('Fetch request was cancelled');
      return null;
    }
    console.error('fetchData: Error fetching data:', error);
    throw error;
  }
};
