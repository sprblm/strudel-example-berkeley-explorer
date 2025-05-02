import { Box, Typography, Slider, Select, MenuItem, FormControlLabel, Switch, Checkbox, Paper, Divider, FormGroup, SelectChangeEvent } from '@mui/material';
import React, { useState, useEffect, ReactNode } from 'react';
import { FilterIcon, SortAscIcon } from '../../../components/Icons';
import { useFilters } from '../../../components/FilterContext';
import { TaskflowPages, FilterFieldProps } from '../_config/taskflow.types';
import { taskflow } from '../_config/taskflow.config';

const pageConfig = (taskflow.pages as unknown as TaskflowPages)?.index;

interface FilterCategories {
  urbanTreeInventory: FilterFieldProps['filter'][];
  airQuality: FilterFieldProps['filter'][];
  spatial: FilterFieldProps['filter'][];
  temporal: FilterFieldProps['filter'][];
}

/**
 * Individual filter field component to render the appropriate input based on filter type
 */
const FilterField: React.FC<FilterFieldProps & { onChange: (field: string, value: any) => void }> = ({ filter, onChange }) => {
  const { field, label, type, options = [] } = filter;

  // Add specific filter fields for urban tree inventory and air quality
  if (field === 'tree-species') {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>{label}</Typography>
        <Select
          size="small"
          fullWidth
          value={options[0]?.value || ''}
          onChange={(e: SelectChangeEvent) => onChange(field, e.target.value)}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
    );
  }

  if (field === 'air-quality-parameter') {
    // Similar implementation for air quality parameter filter
  }

  if (type === 'range' && filter.min !== undefined && filter.max !== undefined) {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>{label}</Typography>
        <Slider
          min={filter.min}
          max={filter.max}
          step={filter.step || 1}
          valueLabelDisplay="auto"
          onChange={(_, value) => onChange(field, value)}
          sx={{ 
            width: '90%',
            ml: 1
          }}
        />
      </Box>
    );
  }

  if (type === 'select') {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>{label}</Typography>
        <Select
          size="small"
          fullWidth
          onChange={(e) => onChange(field, e.target.value)}
          sx={{ 
            fontSize: '0.875rem',
            '& .MuiSelect-select': {
              padding: '0.5rem 1rem',
            }
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
    );
  }

  if (type === 'toggle') {
    return (
      <Box sx={{ mb: 1 }}>
        <FormControlLabel
          control={<Switch size="small" />}
          label={<Typography variant="body2">{label}</Typography>}
          onChange={(e, checked) => onChange(field, checked)}
        />
      </Box>
    );
  }

  if (type === 'checkbox') {
    return (
      <Box sx={{ mb: 0.5 }}>
        <FormControlLabel
          control={<Checkbox size="small" />}
          label={<Typography variant="body2">{label}</Typography>}
          onChange={(e, checked) => onChange(field, checked)}
        />
      </Box>
    );
  }

  if (type === 'date-range') {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>{label}</Typography>
        {/* Implement date range picker here */}
        <input
          type="date"
          onChange={(e) => onChange(field, e.target.value)}
          placeholder="Start Date"
        />
        <input
          type="date"
          onChange={(e) => onChange(field, e.target.value)}
          placeholder="End Date"
        />
      </Box>
    );
  }

  // Default fallback for other types
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>{label}</Typography>
      <Typography variant="caption" color="text.secondary">
        Filter type "{type}" not supported
      </Typography>
    </Box>
  );
};

/**
 * Filters panel component with modern styling
 * Includes data sources, formats, and other filtering options
 */
const FiltersPanel: React.FC = () => {
  const { dispatch, setFilter } = useFilters();
  const [sortBy, setSortBy] = useState('relevance');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  // Data sources based on configured repositories
  const dataSources = taskflow.data.repositories.map(repo => ({
    id: repo.id as string,
    name: repo.name as string,
    checked: false
  }));

  // Use filter fields from taskflow.config
  const filters = pageConfig?.filters?.fields || [];

  // Fetch data based on filter changes
  useEffect(() => {
    const applyFilters = () => {
      try {
        // Apply filters to the current context
        Object.entries(filterValues).forEach(([field, value]) => {
          if (value !== undefined && value !== null) {
            // The setFilter function handles determining the appropriate operator based on value type
            setFilter(field, value);
          }
        });
      } catch (err) {
        // Implement proper error handling instead of console.error
        if (err instanceof Error) {
          // Handle error appropriately, such as showing an error message to the user
          dispatch({
            type: 'SET_EXPANDED_GROUP',
            payload: `Error applying filters: ${err.message}`
          });
        }
      }
    };

    if (Object.keys(filterValues).length > 0) {
      applyFilters();
    }
  }, [filterValues, dispatch, setFilter]);

  // Handle filter changes
  const handleFilterChange = (field: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Group filters by category based on Dataset interface
  const filterCategories: FilterCategories = {
    urbanTreeInventory: filters.filter((f: any) =>
      ['species', 'dbh', 'healthCondition', 'observationDate'].includes(f.field)
    ),
    airQuality: filters.filter((f: any) =>
      f.field === 'air-quality-parameter'
    ),
    spatial: filters.filter((f: any) =>
      f.field === 'location'
    ),
    temporal: filters.filter((f: any) =>
      f.field === 'time-period'
    ),
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 2,
        height: '100%',
        overflow: 'auto'
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon size={18} />
          <Typography variant="subtitle1" fontWeight={500}>
            Filters
          </Typography>
        </Box>
      </Box>

      {/* Filter Content */}
      <Box sx={{ p: 2 }}>
        {/* Data Sources Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500 }}>
            Data Sources
          </Typography>
          <FormGroup>
            {dataSources.map(source => (
              <Box key={source.id}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={filterValues.source?.[source.id] || false}
                      onChange={() => handleFilterChange('source', source.id)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">{source.name}</Typography>}
                />
              </Box>
            ))}
          </FormGroup>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Advanced Filters from taskflow config */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500 }}>
            Advanced Filters
          </Typography>
          
          {(Object.keys(filterCategories) as (keyof FilterCategories)[])
            .filter(category => filterCategories[category].length > 0)
            .map((category) => (
              <Box key={category} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ 
                  mb: 1,
                  fontWeight: 500,
                  color: 'text.secondary',
                  textTransform: 'capitalize'
                }}>
                  {category}
                </Typography>
                {filterCategories[category].map((filter: any) => (
                  <FilterField 
                    key={filter.field} 
                    filter={filter}
                    onChange={handleFilterChange}
                  />
                ))}
              </Box>
            ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Sort Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SortAscIcon size={16} />
          Sort Results
        </Typography>
      </Box>
    </Paper>
  );
};

export default FiltersPanel;
