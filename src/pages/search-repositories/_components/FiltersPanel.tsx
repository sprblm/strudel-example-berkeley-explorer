import { Box, Typography, Slider, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import React, { useState, useEffect } from 'react';
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

const FilterField: React.FC<FilterFieldProps & { onChange: (field: string, value: any) => void }> = ({ filter, onChange }) => {
  const { field, label, type, options = [] } = filter;

  if (type === 'range' && filter.min !== undefined && filter.max !== undefined) {
    return (
      <Box key={field}>
        <Typography>{label}</Typography>
        <Slider
          min={filter.min}
          max={filter.max}
          step={filter.step}
          valueLabelDisplay="auto"
        />
      </Box>
    );
  }

  if (type === 'select') {
    return (
      <Box key={field}>
        <Typography>{label}</Typography>
        <Select onChange={(e) => onChange(field, e.target.value)}>
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
      <Box key={field}>
        <FormControlLabel
          control={<Switch />}
          label={label}
        />
      </Box>
    );
  }

  return null;
};

const FiltersPanel = () => {
  const [filterValues, setFilterValues] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/datasets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(filterValues),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        // Implement proper error handling
        if (err instanceof Error) {
          alert('An error occurred while fetching data: ' + err.message);
        } else {
          alert('An unexpected error occurred');
        }
      }
    };

    fetchData();
  }, [filterValues]);

  const handleFilterChange = (field: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Group filters by category based on Dataset interface
  const filterCategories: FilterCategories = {
    metadata: pageConfig.filters?.fields.filter(f => 
      f.field === 'title' ||
      f.field === 'summary' ||
      f.field === 'citation' ||
      f.field === 'doi'
    ) || [],
    temporal: pageConfig.filters?.fields.filter(f =>
      f.field === 'publication_date' ||
      f.field === 'start_date' ||
      f.field === 'end_date'
    ) || [],
    spatial: pageConfig.filters?.fields.filter(f =>
      f.field === 'spatial_coverage' ||
      f.field === 'spatial_resolution'
    ) || [],
    source: pageConfig.filters?.fields.filter(f =>
      f.field === 'source' ||
      f.field === 'publisher' ||
      f.field === 'distributor'
    ) || [],
    content: pageConfig.filters?.fields.filter(f =>
      f.field === 'variables' ||
      f.field === 'category' ||
      f.field === 'tags'
    ) || [],
    quality: pageConfig.filters?.fields.filter(f =>
      f.field === 'quality' ||
      f.field === 'type'
    ) || []
  };

  return (
    <Box>
      {(Object.keys(filterCategories) as (keyof FilterCategories)[]).map((category) => (
        <Box key={category}>
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
  );
};

export default FiltersPanel;
