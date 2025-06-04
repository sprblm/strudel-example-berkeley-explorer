/**
 * DataViewHeader component for the Explore Data section.
 * Provides search, filter, and view mode controls for the data visualization interface.
 */
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TableChartIcon from '@mui/icons-material/TableChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import MapIcon from '@mui/icons-material/Map';
import {
  Button,
  Stack,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import React from 'react';

interface DataViewHeaderProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onToggleFiltersPanel: () => void;
  viewMode: string;
  onViewModeChange: (mode: string) => void;
}

/**
 * Data table header section with filters button, view options, and search bar
 */
export const DataViewHeader: React.FC<DataViewHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  onToggleFiltersPanel,
  viewMode,
  onViewModeChange,
}) => {
  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    setSearchTerm(evt.target.value);
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: string
  ) => {
    if (newViewMode !== null) {
      onViewModeChange(newViewMode);
    }
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{
        overflow: 'hidden',
        padding: 2,
      }}
    >
      <Typography variant="h6" component="h2" flex={1}>
        Climate Data Explorer
      </Typography>

      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewModeChange}
        aria-label="view mode"
        size="small"
      >
        <Tooltip title="Table View">
          <ToggleButton value="table" aria-label="table view">
            <TableChartIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Card View">
          <ToggleButton value="card" aria-label="card view">
            <ViewModuleIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Chart View">
          <ToggleButton value="chart" aria-label="chart view">
            <BarChartIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Map View">
          <ToggleButton value="map" aria-label="map view">
            <MapIcon />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>

      <Button
        startIcon={<FilterListIcon />}
        onClick={onToggleFiltersPanel}
        variant="outlined"
        size="small"
      >
        Filters
      </Button>

      <TextField
        variant="outlined"
        label="Search"
        size="small"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ minWidth: '200px' }}
      />
    </Stack>
  );
};
