import dayjs from 'dayjs';
import { DataFilter, FilterConfig } from '../types/filters.types';

export const filterBySearchText = <T extends Record<string, unknown>>(allData: T[], searchText?: string) => {
  let filteredData = allData;
  if (searchText) {
    filteredData = allData.filter((d) => {
      const rowString = JSON.stringify(d).toLowerCase();
      return rowString.indexOf(searchText.toLowerCase()) > -1;
    });
  }
  return filteredData;
};

export const filterByDataFilters = <T extends Record<string, unknown>>(
  allData: T[],
  filters: DataFilter[] | null,
  filterConfigs: FilterConfig[] | null
) => {
  if (!filters) return allData;

  let filteredData = allData;
  if (filters.length > 0) {
    // Pre build map of filter to operator for performance boost
    const filterOperatorMap: Record<string, string | undefined> = {};
    filters.forEach((f) => {
      if (filterConfigs) {
        const filterConfig = filterConfigs.find((c) => c.field === f.field);
        filterOperatorMap[f.field] = filterConfig?.operator;
      }
    });
    filteredData = allData.filter((d) => {
      let include = true;
      // All filters have to be matched for a row to be included in the filtered data
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
            case 'contains-one-of': {
              if (Array.isArray(f.value)) {
                f.value.forEach((v) => {
                  if (!match) {
                    const fieldValue = d[f.field as keyof typeof d];
                    if (Array.isArray(fieldValue)) {
                      if (fieldValue.indexOf(v) > -1) {
                        match = true;
                      }
                    } else if (fieldValue === v) {
                      match = true;
                    }
                  }
                });
              }
              break;
            }
            case 'equals-one-of': {
              if (Array.isArray(f.value)) {
                f.value.forEach((v) => {
                  if (!match) {
                    const fieldValue = d[f.field as keyof typeof d];
                    if (fieldValue === v) {
                      match = true;
                    }
                  }
                });
              }
              break;
            }
            case 'between-inclusive': {
              if (Array.isArray(f.value)) {
                const min = f.value[0];
                const max = f.value[1];
                const fieldValue = d[f.field as keyof typeof d];
                if (typeof fieldValue === 'number' && typeof min === 'number' && typeof max === 'number' && 
                    fieldValue >= min && fieldValue <= max) {
                  match = true;
                }
              }
              break;
            }
            case 'between-dates-inclusive': {
              const fieldValue = d[f.field as keyof typeof d];
              if (
                typeof fieldValue === 'string' &&
                Array.isArray(f.value) &&
                f.value[0] &&
                f.value[1]
              ) {
                const dateValue = dayjs(fieldValue);
                if (
                  dateValue.isAfter(f.value[0]) &&
                  dateValue.isBefore(f.value[1])
                ) {
                  match = true;
                }
              } else {
                match = true;
              }
              break;
            }
            default:
              break;
          }
        }
        if (!match) include = false;
      });
      return include;
    });
  }
  return filteredData;
};

export const filterData = <T extends Record<string, unknown>>(
  allData: T[],
  filters: DataFilter[],
  filterConfigs: FilterConfig[],
  searchText?: string
) => {
  const filteredByText = filterBySearchText(allData, searchText);
  const filteredByTextAndDataFilters = filterByDataFilters(
    filteredByText,
    filters,
    filterConfigs
  );
  return filteredByTextAndDataFilters;
};

export const initSliderTicks = (
  ticks: number | null,
  domain: number[],
  scale?: { ticks: (count: number) => number[] }
) => {
  if (ticks === 2) {
    return domain;
  } else if (ticks !== null) {
    return scale?.ticks(ticks);
  } else {
    return;
  }
};
