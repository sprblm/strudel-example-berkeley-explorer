import React from 'react';
import { Box, Typography, Slider, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { taskflow } from '../_config/taskflow.config';

interface TaskflowPages {
  index: {
    filters?: {
      fields: Array<{
        field: string;
        label: string;
        type: string;
        options?: Array<{ value: string; label: string }>;
        min?: number;
        max?: number;
        step?: number;
      }>;
    };
  };
}

interface FilterFieldProps {
  filter: {
    field: string;
    label: string;
    type: string;
    options?: Array<{ value: string; label: string }>;
    min?: number;
    max?: number;
    step?: number;
  };
}

const pageConfig = (taskflow.pages as unknown as TaskflowPages)?.index;

const FiltersPanel = () => {
  const filters = pageConfig?.filters?.fields || [];

  return (
    <Box>
      {filters.map((filter) => (
        <FilterField key={filter.field} filter={filter} />
      ))}
    </Box>
  );
};

const FilterField: React.FC<FilterFieldProps> = ({ filter }) => {
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
        <Select>
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

export default FiltersPanel;
