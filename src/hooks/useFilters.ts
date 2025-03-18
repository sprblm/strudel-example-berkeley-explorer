import { useState, useEffect } from 'react';
import { filterBySearchText, filterByDataFilters } from '../utils/filters.utils';
import { DataFilter, FilterConfig } from '../types/filters.types';

export const useFilters = (allData: any[], filters: DataFilter[] | null, filterConfigs: FilterConfig[] | null, searchText?: string) => {
  const [filteredData, setFilteredData] = useState(allData);

  useEffect(() => {
    let data = allData;

    // Apply search text filtering
    data = filterBySearchText(data, searchText);

    // Apply data filters
    data = filterByDataFilters(data, filters, filterConfigs);

    setFilteredData(data);
  }, [allData, filters, filterConfigs, searchText]);

  return filteredData;
};
