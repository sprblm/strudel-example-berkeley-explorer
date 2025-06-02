/**
 * FiltersPanel component for the Explore Data section.
 * Provides UI for filtering environmental data by various criteria such as location, date, and data types.
 */
import React from 'react';
import {
  Box, 
  Typography, 
  Slider, 
  Select, 
  MenuItem, 
  Paper, 
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Stack,
  Divider,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFilters } from '../../../components/FilterContext';
import { useTaskflow } from '../../../hooks/useTaskflow';

interface FiltersPanelProps {
  onClose: () => void;
}

/**
 * Panel that contains filter controls for the data view.
 * Uses the FilterContext to manage filter state across components.
 */
export const FiltersPanel: React.FC<FiltersPanelProps> = ({ onClose }) => {
  const { activeFilters, setFilter, clearFilters } = useFilters();
  const { filterConfigs = [] } = useTaskflow();

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleRangeFilterChange = (field: string, value: number[]) => {
    setFilter(field, value);
  };

  const handleToggleFilterChange = (field: string, checked: boolean) => {
    setFilter(field, checked);
  };

  const handleSelectFilterChange = (field: string, value: string) => {
    setFilter(field, value);
  };

  return (
    <Paper elevation={0} sx={{ height: '100%', p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
      
      <Button 
        variant="outlined" 
        fullWidth 
        onClick={handleClearFilters}
        sx={{ mb: 3 }}
      >
        Clear All Filters
      </Button>
      
      <Stack spacing={3}>
        {filterConfigs.map((filter: any) => {
          const { field, label, type, options } = filter;
          const filterValue = activeFilters[field];
          
          // Range filter (for numeric values)
          if (type === 'range' && options?.min !== undefined && options?.max !== undefined) {
            const value = Array.isArray(filterValue) ? filterValue : [options.min, options.max];
            return (
              <Box key={field}>
                <Typography gutterBottom>{label}</Typography>
                <Slider
                  value={Array.isArray(value) ? value : [options.min, options.max]}
                  onChange={(_, newValue) => handleRangeFilterChange(field, newValue as number[])}
                  valueLabelDisplay="auto"
                  min={options.min}
                  max={options.max}
                  step={options.step || 1}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="caption">{options.min}</Typography>
                  <Typography variant="caption">{options.max}</Typography>
                </Box>
                <Divider sx={{ mt: 2 }} />
              </Box>
            );
          }
          
          // Select filter (for dropdowns)
          if (type === 'select' && Array.isArray(options)) {
            const value = typeof filterValue !== 'undefined' ? String(filterValue) : '';
            return (
              <Box key={field}>
                <Typography gutterBottom>{label}</Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={value}
                    onChange={(e) => handleSelectFilterChange(field, e.target.value as string)}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>All</em>
                    </MenuItem>
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Divider sx={{ mt: 2 }} />
              </Box>
            );
          }
          
          // Toggle filter (for boolean values)
          if (type === 'toggle') {
            const checked = Boolean(filterValue);
            return (
              <Box key={field}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleToggleFilterChange(field, e.target.checked)}
                        size="small"
                      />
                    }
                    label={label}
                  />
                </FormGroup>
                <Divider sx={{ mt: 2 }} />
              </Box>
            );
          }
          
          return null;
        })}
      </Stack>
    </Paper>
  );
};
