import { Box, Typography, FormGroup, FormControlLabel, Checkbox, Paper, Divider } from '@mui/material';
import { useState } from 'react';
import { FilterIcon, SortAscIcon } from '../../../components/Icons';
import { useFilters } from '../../../components/FilterContext';
import { FilterOperator } from '../../../context/filterTypes';

/**
 * Filters panel component with modern styling
 * Includes data sources, formats, and sort options
 */
const FiltersPanel = () => {
  const { dispatch } = useFilters();
  const [sortBy, setSortBy] = useState('relevance');

  // Data sources for filter
  const dataSources = [
    { id: 'noaa', name: 'NOAA', checked: false },
    { id: 'nasa', name: 'NASA', checked: false },
    { id: 'ecmwf', name: 'ECMWF', checked: false },
    { id: 'worldclim', name: 'WorldClim', checked: false },
  ];

  // Data formats for filter
  const dataFormats = [
    { id: 'netcdf', name: 'NetCDF', checked: false },
    { id: 'csv', name: 'CSV', checked: false },
    { id: 'hdf5', name: 'HDF5', checked: false },
    { id: 'geotiff', name: 'GeoTIFF', checked: false },
  ];

  const handleDataSourceChange = (sourceId: string, _checked: boolean) => {
    // Update the source selection
    if (dispatch) {
      dispatch({
        type: 'SET_FILTER',
        payload: {
          field: 'source',
          value: sourceId,
          operator: FilterOperator.CONTAINS
        }
      });
    }
  };

  const handleDataFormatChange = (formatId: string, _checked: boolean) => {
    // Update the format selection
    if (dispatch) {
      dispatch({
        type: 'SET_FILTER',
        payload: {
          field: 'format',
          value: formatId,
          operator: FilterOperator.CONTAINS
        }
      });
    }
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    // Apply sorting logic here
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 0, 
        borderRadius: 2, 
        border: '1px solid',
        borderColor: 'grey.200',
        overflow: 'hidden'
      }}
    >
      {/* Filters header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'grey.200',
        backgroundColor: 'grey.50'
      }}>
        <FilterIcon size={18} />
        <Typography 
          variant="subtitle1" 
          component="h2" 
          sx={{ fontWeight: 600, ml: 1 }}
        >
          Filters
        </Typography>
      </Box>

      {/* Data Sources */}
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="subtitle2" 
          component="h3" 
          sx={{ fontWeight: 600, mb: 1.5 }}
        >
          Data Sources
        </Typography>
        <FormGroup>
          {dataSources.map((source) => (
            <FormControlLabel
              key={source.id}
              control={
                <Checkbox 
                  size="small"
                  checked={source.checked}
                  onChange={(e) => handleDataSourceChange(source.id, e.target.checked)}
                  sx={{ 
                    color: 'grey.500',
                    '&.Mui-checked': {
                      color: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'grey.700' }}>
                  {source.name}
                </Typography>
              }
              sx={{ mb: 0.5 }}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider />

      {/* Data Formats */}
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="subtitle2" 
          component="h3" 
          sx={{ fontWeight: 600, mb: 1.5 }}
        >
          Data Formats
        </Typography>
        <FormGroup>
          {dataFormats.map((format) => (
            <FormControlLabel
              key={format.id}
              control={
                <Checkbox 
                  size="small"
                  checked={format.checked}
                  onChange={(e) => handleDataFormatChange(format.id, e.target.checked)}
                  sx={{ 
                    color: 'grey.500',
                    '&.Mui-checked': {
                      color: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'grey.700' }}>
                  {format.name}
                </Typography>
              }
              sx={{ mb: 0.5 }}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider />

      {/* Sort By */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <SortAscIcon size={16} />
          <Typography 
            variant="subtitle2" 
            component="h3" 
            sx={{ fontWeight: 600, ml: 1 }}
          >
            Sort By
          </Typography>
        </Box>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox 
                size="small"
                checked={sortBy === 'relevance'}
                onChange={() => handleSortChange('relevance')}
                sx={{ 
                  color: 'grey.500',
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: 'grey.700' }}>
                Relevance
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox 
                size="small"
                checked={sortBy === 'date'}
                onChange={() => handleSortChange('date')}
                sx={{ 
                  color: 'grey.500',
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: 'grey.700' }}>
                Last Updated
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox 
                size="small"
                checked={sortBy === 'downloads'}
                onChange={() => handleSortChange('downloads')}
                sx={{ 
                  color: 'grey.500',
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: 'grey.700' }}>
                Downloads
              </Typography>
            }
          />
        </FormGroup>
      </Box>
    </Paper>
  );
};

export default FiltersPanel;
