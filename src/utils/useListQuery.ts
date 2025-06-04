import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { DataFilter } from '../components/FilterContext';
import { FilterConfig } from '../types/filters.types';
import { createFilterParams, fetchData } from './queryParams.utils';
import { useRef, useEffect } from 'react';

interface DataQueryConfig {
  activeFilters: DataFilter[];
  dataSource: string;
  filterConfigs: FilterConfig[];
  offset: number;
  page: number;
  pageSize: number;
  queryMode: 'server' | 'client';
  staticParams: Record<string, string> | null | undefined;
}

/**
 * Helper hook that wraps around the useQuery hook and inputs the config
 * options specified in the taskflow config as well as other filtering options.
 */
export const useListQuery = (dataQueryConfig: DataQueryConfig): any => {
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up any pending requests when the component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // If in server mode, create query params from the active filters
  const queryParams =
    dataQueryConfig.queryMode === 'server'
      ? createFilterParams(
          dataQueryConfig.activeFilters,
          dataQueryConfig.filterConfigs
        )
      : new URLSearchParams();

  // Tack on the static query params
  if (dataQueryConfig.staticParams) {
    Object.keys(dataQueryConfig.staticParams).forEach((param) => {
      if (dataQueryConfig.staticParams) {
        queryParams.append(
          param,
          dataQueryConfig.staticParams[param].toString()
        );
      }
    });
  }

  // If in server mode, tack on pagination query params
  if (dataQueryConfig.queryMode === 'server') {
    queryParams.append('limit', dataQueryConfig.pageSize.toString());
    queryParams.append('offset', dataQueryConfig.offset.toString());
  }

  // The queryKey only needs to change dynamically in server mode
  const queryKey =
    dataQueryConfig.queryMode === 'server'
      ? [
          dataQueryConfig.dataSource,
          {
            ...dataQueryConfig.activeFilters,
            pageSize: dataQueryConfig.pageSize,
            offset: dataQueryConfig.offset,
          },
        ]
      : [dataQueryConfig.dataSource];

  // Define query for this page and fetch data items
  const { isPending, isFetching, isError, data, error } = useQuery({
    queryKey,
    queryFn: async (): Promise<any> => {
      // Create a new AbortController for this request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const queryString = queryParams.toString();
      let fullDataSourcePath = dataQueryConfig.dataSource;
      if (queryString && queryString.length > 0) {
        fullDataSourcePath = `${dataQueryConfig.dataSource}?${queryString}`;
      }

      console.log('useListQuery: Fetching data from', fullDataSourcePath);
      const results = await fetchData(
        fullDataSourcePath,
        abortControllerRef.current.signal
      );
      console.log('useListQuery: Raw results from fetchData:', results);

      // Normalize the data format
      // If the results is an array, return it directly
      // If results has a datasets property, return it as an array
      if (Array.isArray(results)) {
        console.log('useListQuery: Results is an array, returning directly');
        return results;
      } else if (results && typeof results === 'object') {
        if (results.datasets && Array.isArray(results.datasets)) {
          console.log(
            'useListQuery: Results has datasets array, returning datasets'
          );
          return results.datasets;
        } else if (results.results && Array.isArray(results.results)) {
          console.log(
            'useListQuery: Results has results array, returning results'
          );
          return results.results;
        }
      }

      // If we can't normalize, return as is
      console.log('useListQuery: Could not normalize results, returning as is');
      return results;
    },
    placeholderData: keepPreviousData,
  });
  return { isPending, isFetching, isError, data, error };
};
