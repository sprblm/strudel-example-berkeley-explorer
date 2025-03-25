import React from 'react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFilters } from '../../../components/FilterContext';
import { taskflow } from '../_config/taskflow.config';

interface FiltersPanelProps {
  onClose: () => void;
}

/**
 * Panel that contains filter controls for the dataset repositories.
 * Uses the FilterContext to manage filter state across components.
 */
export const FiltersPanel: React.FC<FiltersPanelProps> = ({ onClose }) => {
  const { activeFilters, setFilter, clearFilters } = useFilters();
  const filterConfigs = taskflow.pages.index.cardFilters;

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleRangeFilterChange = (field: string, value: number[]) => {
    setFilter(field, value);
  };

  const handleSelectFilterChange = (field: string, value: string) => {
    setFilter(field, value);
  };

  const handleToggleFilterChange = (field: string, checked: boolean) => {
    setFilter(field, checked);
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
        {filterConfigs.map((filter) => {
          const { field, label, type, options } = filter;
          
          // Range filter (for numeric values)
          if (type === 'range' && options?.min !== undefined && options?.max !== undefined) {
            const value = activeFilters[field] || [options.min, options.max];
            return (
              <Box key={field}>
                <Typography gutterBottom>{label}</Typography>
                <Slider
                  value={value}
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
          
          // Select filter (dropdown)
          if (type === 'select' && Array.isArray(options)) {
            return (
              <Box key={field}>
                <Typography gutterBottom>{label}</Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={activeFilters[field] || ''}
                    onChange={(e) => handleSelectFilterChange(field, e.target.value)}
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
          
          // Toggle filter (checkbox/switch)
          if (type === 'toggle') {
            return (
              <Box key={field}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!activeFilters[field]}
                        onChange={(e) => handleToggleFilterChange(field, e.target.checked)}
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
