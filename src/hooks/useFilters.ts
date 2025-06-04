import { useState, useEffect, useCallback } from 'react';
import {
  filterBySearchText,
  filterByDataFilters,
} from '../utils/filters.utils';
import { DataFilter, FilterConfig } from '../types/filters.types.tsx';

export const useFilters = (
  initialData: any[] = [],
  initialFilters: DataFilter[] | null = null,
  initialFilterConfigs: FilterConfig[] | null = null,
  initialSearchText: string = ''
) => {
  const [allData, setAllData] = useState(initialData);
  const [filters, setFilters] = useState<DataFilter[] | null>(initialFilters);
  const [filterConfigs, setFilterConfigs] = useState<FilterConfig[] | null>(
    initialFilterConfigs
  );
  const [searchText, setSearchText] = useState<string>(initialSearchText);
  const [filteredData, setFilteredData] = useState(initialData);

  const updateAllFilters = useCallback((newFilters: DataFilter[] | null) => {
    setFilters(newFilters);
  }, []);

  const updateFilterConfigs = useCallback(
    (newFilterConfigs: FilterConfig[] | null) => {
      setFilterConfigs(newFilterConfigs);
    },
    []
  );

  const updateSearchText = useCallback((newSearchText: string) => {
    setSearchText(newSearchText);
  }, []);

  const updateData = useCallback((newData: any[]) => {
    setAllData(newData);
  }, []);

  useEffect(() => {
    let data = allData;

    // Apply search text filtering
    data = filterBySearchText(data, searchText);

    // Apply data filters
    data = filterByDataFilters(data, filters || [], filterConfigs);

    setFilteredData(data);
  }, [allData, filters, filterConfigs, searchText]);

  return {
    filteredData,
    filters,
    filterConfigs,
    searchText,
    updateAllFilters,
    updateFilterConfigs,
    updateSearchText,
    updateData,
  };
};
