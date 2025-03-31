import React, { PropsWithChildren, useContext, useReducer } from 'react';
import { DataFilter, FilterOperator } from '../context/filterTypes';

interface FilterState {
  activeFilters: DataFilter[];
  expandedGroup: string | number | boolean;
}

interface FilterContextType {
  activeFilters: DataFilter[];
  expandedGroup: string | number | boolean;
  dispatch: React.Dispatch<FilterAction>;
  setFilter: (field: string, value: unknown) => void;
  clearFilters: () => void;
}

const FilterContextAPI = React.createContext<FilterContextType | undefined>(
  undefined
);

const initialState: FilterState = {
  activeFilters: [],
  expandedGroup: false,
};

export type FilterAction =
  | {
      type: 'SET_FILTER';
      payload: {
        field: string;
        value: unknown;
        operator: FilterOperator; // Explicitly use FilterOperator
      };
    }
  | { type: 'SET_ACTIVE_FILTERS'; payload: FilterState['activeFilters'] }
  | { type: 'SET_EXPANDED_GROUP'; payload: FilterState['expandedGroup'] };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_FILTER': {
      const filter = action.payload;
      const existingIndex = state.activeFilters.findIndex(
        (f) => f.field === filter.field
      );
      if (existingIndex >= 0) {
        const updatedFilters = [...state.activeFilters];
        updatedFilters[existingIndex] = {
          field: filter.field,
          value: filter.value,
          operator: filter.operator,
        };
        return { ...state, activeFilters: updatedFilters };
      }
      return {
        ...state,
        activeFilters: [
          ...state.activeFilters,
          {
            field: filter.field,
            value: filter.value,
            operator: filter.operator,
          },
        ],
      };
    }
    case 'SET_ACTIVE_FILTERS':
      return { ...state, activeFilters: action.payload };
    case 'SET_EXPANDED_GROUP':
      return { ...state, expandedGroup: action.payload };
    default:
      return state;
  }
}

export const FilterContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(filterReducer, initialState);

const setFilter = (field: string, value: unknown) => {
  dispatch({
    type: 'SET_FILTER',
    payload: {
      field,
      value: Array.isArray(value) ? value : [value],
      operator: FilterOperator.EQUALS,
    },
  });
};
  const clearFilters = () => {
    dispatch({ type: 'SET_ACTIVE_FILTERS', payload: [] });
  };

  const value = {
    activeFilters: state.activeFilters,
    expandedGroup: state.expandedGroup,
    dispatch,
    setFilter,
    clearFilters,
  };

  return (
    <FilterContextAPI.Provider value={value}>
      {children}
    </FilterContextAPI.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContextAPI);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterContext');
  }
  return context;
};

export type { DataFilter } from '../context/filterTypes';
