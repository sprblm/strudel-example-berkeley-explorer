import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Select,
  Slider,
  Stack,
  Switch,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { useFilters } from '../../../components/FilterContext';
import { taskflow } from '../_config/taskflow.config';
import { MapSelector } from './MapSelector';

interface FiltersPanelProps {
  onClose: () => void;
}

// Add proper type for filter parameter
interface FilterFieldProps {
  filter: {
    field: string;
    label: string;
    type: string;
    options?:
      | {
          min?: number;
          max?: number;
          step?: number;
          value?: string;
          label?: string;
        }
      | {
          value: string;
          label: string;
        }[];
  };
}

/**
 * Panel that contains filter controls for the dataset repositories.
 * Uses the FilterContext to manage filter state across components.
 */
export const FiltersPanel: React.FC<FiltersPanelProps> = ({ onClose }) => {
  const [expandedMap, setExpandedMap] = useState(false);
  const { activeFilters, clearFilters, setFilter } = useFilters();

  const toggleMapExpand = () => {
    setExpandedMap(!expandedMap);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleRangeFilterChange = (field: string, value: number[]) => {
    useFilters().setFilter(field, value as [number, number]);
  };

  const handleSelectFilterChange = (field: string, value: string) => {
    useFilters().setFilter(field, value);
  };

  const handleToggleFilterChange = (field: string, checked: boolean) => {
    useFilters().setFilter(field, checked);
  };
  // Group filters by category
  const filterCategories = {
    source: taskflow.pages.index.cardFilters.filter(
      (f) => f.field === 'source'
    ),
    variables: taskflow.pages.index.cardFilters.filter(
      (f) => f.field === 'variables'
    ),
    temporal: taskflow.pages.index.cardFilters.filter(
      (f) =>
        f.field === 'temporal_coverage' || f.field === 'temporal_resolution'
    ),
    spatial: taskflow.pages.index.cardFilters.filter(
      (f) => f.field === 'spatial_resolution' || f.field === 'spatial_coverage'
    ),
    type: taskflow.pages.index.cardFilters.filter(
      (f) => f.field === 'type' || f.field === 'quality'
    ),
    tags: taskflow.pages.index.cardFilters.filter(
      (f) => f.field === 'category' || f.field === 'tags'
    ),
  };

  const climateFilterConfigs = [
    {
      field: 'region',
      label: 'Geographic Region',
      type: 'select',
      options: [
        { value: 'global', label: 'Global' },
        { value: 'north_america', label: 'North America' },
        { value: 'europe', label: 'Europe' },
        { value: 'asia', label: 'Asia' },
        { value: 'africa', label: 'Africa' },
        { value: 'south_america', label: 'South America' },
        { value: 'australia', label: 'Australia' },
      ],
    },
    {
      field: 'data_source',
      label: 'Data Source',
      type: 'select',
      options: [
        { value: 'noaa', label: 'NOAA' },
        { value: 'nasa', label: 'NASA' },
        { value: 'ipcc', label: 'IPCC' },
        { value: 'world_bank', label: 'World Bank' },
      ],
    },
    {
      field: 'climate_variable',
      label: 'Climate Variable',
      type: 'select',
      options: [
        { value: 'temperature', label: 'Temperature' },
        { value: 'precipitation', label: 'Precipitation' },
        { value: 'sea_level', label: 'Sea Level' },
        { value: 'co2', label: 'CO2 Emissions' },
      ],
    },
    {
      field: 'time_period',
      label: 'Time Period',
      type: 'range',
      options: {
        min: 1900,
        max: 2100,
        step: 10,
      },
    },
  ];

  const additionalClimateFilters = [
    {
      field: 'resolution',
      label: 'Resolution',
      type: 'select',
      options: [
        { value: 'daily', label: 'Daily' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
        { value: 'decadal', label: 'Decadal' },
      ],
    },
    {
      field: 'dataset_type',
      label: 'Dataset Type',
      type: 'select',
      options: [
        { value: 'observational', label: 'Observational' },
        { value: 'model', label: 'Model' },
        { value: 'reanalysis', label: 'Reanalysis' },
      ],
    },
    {
      field: 'scenario',
      label: 'Scenario',
      type: 'select',
      options: [
        { value: 'ssp126', label: 'SSP1-2.6' },
        { value: 'ssp245', label: 'SSP2-4.5' },
        { value: 'ssp585', label: 'SSP5-8.5' },
      ],
    },
    {
      field: 'license',
      label: 'License Type',
      type: 'select',
      options: [
        { value: 'cc_by', label: 'CC BY' },
        { value: 'cc_by_sa', label: 'CC BY-SA' },
        { value: 'public_domain', label: 'Public Domain' },
      ],
    },
  ];

  const allFilters = [
    ...filterCategories.source,
    ...filterCategories.variables,
    ...filterCategories.temporal,
    ...filterCategories.spatial,
    ...filterCategories.type,
    ...filterCategories.tags,
    ...climateFilterConfigs,
    ...additionalClimateFilters,
  ];

  const FilterField: React.FC<FilterFieldProps> = ({ filter }) => {
    const { activeFilters, setFilter } = useFilters();
    const { field, label, type, options = [] } = filter;
    // Range filter (for numeric values)
    if (
      type === 'range' &&
      options?.min !== undefined &&
      options?.max !== undefined
    ) {
      const value = activeFilters[field] || [options.min, options.max];
      return (
        <Box key={field}>
          <Typography gutterBottom>{label}</Typography>
          <Slider
            value={Number(value?.value) || options.min}
            onChange={(_, newValue) =>
              handleRangeFilterChange(field, newValue as number[])
            }
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
              value={
                typeof activeFilters[field] === 'string'
                  ? activeFilters[field]
                  : ''
              }
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
                  onChange={(e) =>
                    handleToggleFilterChange(field, e.target.checked)
                  }
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
  };

  return (
    <Box sx={{ border: 'none', overflowY: 'auto', maxHeight: '100vh', p: 2 }}>
      {/* Map for geographic selection */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Geographic Region
        </Typography>
        <MapSelector expanded={expandedMap} onToggleExpand={toggleMapExpand} />
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6">Refine Your Search</Typography>
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

      {/* Map for geographic selection */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Geographic Region
        </Typography>
        {/* <MapSelector expanded={expandedMap} onToggleExpand={toggleMapExpand} /> */}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Data Sources Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">Data Sources</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {filterCategories.source.map((filter) => (
            <FilterField key={filter.field} filter={filter} />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Climate Variables Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">Climate Variables</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {filterCategories.variables.map((filter) => (
            <FilterField key={filter.field} filter={filter} />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Time Period Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">Time Period</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {filterCategories.temporal.map((filter) => (
            <FilterField key={filter.field} filter={filter} />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Resolution Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">Resolution</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {filterCategories.spatial.map((filter) => (
            <FilterField key={filter.field} filter={filter} />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Data Type & Quality Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">Data Type & Quality</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {filterCategories.type.map((filter) => (
            <FilterField key={filter.field} filter={filter} />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Categories & Tags Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="medium">Categories & Tags</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {filterCategories.tags.map((filter) => (
            <FilterField key={filter.field} filter={filter} />
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
