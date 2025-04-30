import dayjs from 'dayjs';
import { DataFilter, FilterConfig } from '../types/filters.types';

export const filterData = <T extends Record<string, unknown>>(
  allData: T[] | null,
  filters: DataFilter[] | null,
  filterConfigs: FilterConfig[] | null,
  searchText?: string
) => {
  if (!allData) return [];
  let filteredData = allData;

  // Filter by search text
  if (searchText) {
    filteredData = filteredData.filter((d) => {
      const rowString = JSON.stringify(d).toLowerCase();
      return rowString.indexOf(searchText.toLowerCase()) > -1;
    });
  }

  // Filter by data filters
  if (filters && filters.length > 0) {
    // Pre-build map of filter to operator for performance boost
    const filterOperatorMap: Record<string, string | undefined> = {};
    filters.forEach((f) => {
      if (filterConfigs) {
        const filterConfig = filterConfigs.find((c) => c.field === f.field);
        filterOperatorMap[f.field] = filterConfig?.operator;
      }
    });

    filteredData = filteredData.filter((d) => {
      let include = true;
      filters.forEach((f) => {
        let match = false;
        if (include === true) {
          switch (filterOperatorMap[f.field]) {
            case 'contains': {
              const fieldValue = d[f.field as keyof typeof d];
              if (typeof fieldValue === 'string' && typeof f.value === 'string' && fieldValue.indexOf(f.value) > -1) {
                match = true;
              }
              break;
            }
            // Add more cases for other operators if necessary
          }
        }
        include = include && match;
      });
      return include;
    });
  }

  return filteredData;
};
