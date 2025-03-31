import { Box, Typography, Slider, Select, MenuItem, FormControlLabel, Switch, Checkbox, Paper, Divider, FormGroup, SelectChangeEvent } from '@mui/material';
import React, { useState, useEffect, ReactNode } from 'react';
import { FilterIcon, SortAscIcon } from '../../../components/Icons';
import { useFilters } from '../../../components/FilterContext';
import { TaskflowPages, FilterFieldProps } from '../_config/taskflow.types';
import { taskflow } from '../_config/taskflow.config';

const pageConfig = (taskflow.pages as unknown as TaskflowPages)?.index;

interface FilterCategories {
  metadata: FilterFieldProps['filter'][];
  temporal: FilterFieldProps['filter'][];
  spatial: FilterFieldProps['filter'][];
  source: FilterFieldProps['filter'][];
  content: FilterFieldProps['filter'][];
  quality: FilterFieldProps['filter'][];
}

/**
 * Individual filter field component to render the appropriate input based on filter type
 */
const FilterField: React.FC<FilterFieldProps & { onChange: (field: string, value: any) => void }> = ({ filter, onChange }) => {
  const { field, label, type, options = [] } = filter;

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

  // Default fallback for other types
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>{label}</Typography>
      <Typography variant="caption" color="text.secondary">
        Filter type &quot;{type}&quot; not supported
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

  // Data formats for filter (common formats used in climate data)
  const dataFormats = [
    { id: 'netcdf', name: 'NetCDF', checked: false },
    { id: 'csv', name: 'CSV', checked: false },
    { id: 'hdf5', name: 'HDF5', checked: false },
    { id: 'geotiff', name: 'GeoTIFF', checked: false },
  ];

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

  // Handle data source checkbox changes
  const handleDataSourceChange = (sourceId: string) => {
    const newFilterValue = { 
      ...filterValues,
      source: {
        ...filterValues.source,
        [sourceId]: !filterValues.source?.[sourceId]
      }
    };
    
    // Extract the true values for the filter
    const selectedSources = Object.entries(newFilterValue.source || {})
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    // Apply it using setFilter helper function instead of direct dispatch
    if (selectedSources.length > 0) {
      setFilter('source', selectedSources);
    } else {
      // If no sources selected, set an empty array to effectively clear the filter
      setFilter('source', []);
    }
    
    setFilterValues(newFilterValue);
  };

  // Group filters by category based on Dataset interface
  const filterCategories: FilterCategories = {
    metadata: pageConfig?.filters?.fields.filter(f => 
      f.field === 'title' ||
      f.field === 'summary' ||
      f.field === 'citation' ||
      f.field === 'doi'
    ) || [],
    temporal: pageConfig?.filters?.fields.filter(f =>
      f.field === 'publication_date' ||
      f.field === 'start_date' ||
      f.field === 'end_date'
    ) || [],
    spatial: pageConfig?.filters?.fields.filter(f =>
      f.field === 'spatial_coverage' ||
      f.field === 'spatial_resolution'
    ) || [],
    source: pageConfig?.filters?.fields.filter(f =>
      f.field === 'source' ||
      f.field === 'publisher' ||
      f.field === 'distributor'
    ) || [],
    content: pageConfig?.filters?.fields.filter(f =>
      f.field === 'variables' ||
      f.field === 'category' ||
      f.field === 'tags'
    ) || [],
    quality: pageConfig?.filters?.fields.filter(f =>
      f.field === 'quality' ||
      f.field === 'usgs_mission_area'
    ) || []
  };

  // Handle sort change
  const handleSortChange = (event: SelectChangeEvent<string>, _child: ReactNode) => {
    const newSortValue = event.target.value;
    setSortBy(newSortValue);
    
    // Since FilterContext doesn't directly support sorting,
    // we can use the expandedGroup to indicate sorting preference
    // or implement sorting UI-side only
    dispatch({
      type: 'SET_EXPANDED_GROUP',
      payload: `sort:${newSortValue}`
    });
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
                      onChange={() => handleDataSourceChange(source.id)}
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

        {/* Data Formats Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500 }}>
            Data Formats
          </Typography>
          <FormGroup>
            {dataFormats.map(format => (
              <Box key={format.id}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={filterValues.format?.[format.id] || false}
                      onChange={() => {
                        // Update the format filter
                        const newFormatValue = {
                          ...filterValues,
                          format: {
                            ...(filterValues.format || {}),
                            [format.id]: !(filterValues.format?.[format.id] || false)
                          }
                        };
                        
                        // Extract the true values
                        const selectedFormats = Object.entries(newFormatValue.format || {})
                          .filter(([_, isSelected]) => isSelected)
                          .map(([id]) => id);
                        
                        // Apply it using the setFilter helper
                        if (selectedFormats.length > 0) {
                          setFilter('format', selectedFormats);
                        } else {
                          // If no formats selected, set empty array
                          setFilter('format', []);
                        }
                        
                        setFilterValues(newFormatValue);
                      }}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">{format.name}</Typography>}
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
                {filterCategories[category].map((filter: FilterFieldProps['filter']) => (
                  <FilterField 
                    key={filter.field} 
                    filter={filter}
                    onChange={handleFilterChange}
                  />
                ))}
              </Box>
            ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Sort Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SortAscIcon size={16} />
            Sort Results
          </Typography>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            fullWidth
            size="small"
            sx={{ 
              fontSize: '0.875rem',
              '& .MuiSelect-select': {
                padding: '0.5rem 1rem',
              }
            }}
          >
            <MenuItem value="relevance">Relevance</MenuItem>
            <MenuItem value="date_newest">Date (Newest First)</MenuItem>
            <MenuItem value="date_oldest">Date (Oldest First)</MenuItem>
            <MenuItem value="name_asc">Name (A-Z)</MenuItem>
            <MenuItem value="name_desc">Name (Z-A)</MenuItem>
          </Select>
        </Box>
      </Box>
    </Paper>
  );
};

export default FiltersPanel;
