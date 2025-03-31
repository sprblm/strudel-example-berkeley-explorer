import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  FormControlLabel, 
  Checkbox, 
  TextField,
  Button,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import { ChevronDown, ChevronUp } from '../../../components/Icons';
import { useFilters } from '../../../components/FilterContext';

interface ControlsPanelProps {
  activeChart: 'timeSeries' | 'map' | 'histogram' | 'distribution';
  setActiveChart: React.Dispatch<React.SetStateAction<'timeSeries' | 'map' | 'histogram' | 'distribution'>>;
  onClose: () => void;
}

/**
 * Controls panel for the explore data page
 * Allows users to select variables and data sources
 */
export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  activeChart,
  setActiveChart,
  onClose
}) => {
  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    timeRange: true,
    variables: true,
    dataSources: true
  });

  // Toggle section expansion
  const toggleSection = (section: 'timeRange' | 'variables' | 'dataSources') => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Variables
  const [selectedVariables, setSelectedVariables] = useState({
    temperature: true,
    precipitation: false,
    humidity: false,
    windSpeed: false,
    pressure: false
  });

  // Data sources
  const [selectedDataSources, setSelectedDataSources] = useState({
    noaa: true,
    nasa: false,
    ecmwf: false,
    cmip6: false,
    worldClim: false,
    reanalysis: false
  });

  // Handle variable selection
  const handleVariableChange = (variable: keyof typeof selectedVariables) => {
    setSelectedVariables({
      ...selectedVariables,
      [variable]: !selectedVariables[variable]
    });
  };

  // Handle data source selection
  const handleDataSourceChange = (source: keyof typeof selectedDataSources) => {
    setSelectedDataSources({
      ...selectedDataSources,
      [source]: !selectedDataSources[source]
    });
  };

  // Render a collapsible section
  const renderSection = (
    title: string, 
    section: 'timeRange' | 'variables' | 'dataSources', 
    content: React.ReactNode
  ) => (
    <Box sx={{ mb: 3 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          mb: 1 
        }}
        onClick={() => toggleSection(section)}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        <IconButton size="small">
          {expandedSections[section] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </IconButton>
      </Box>
      {expandedSections[section] && content}
      <Divider sx={{ mt: 2 }} />
    </Box>
  );

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        height: '100%', 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.200'
      }}
    >
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Controls
      </Typography>

      {/* Time Range Section */}
      {renderSection('Time Period', 'timeRange', (
        <Box>
          <TextField
            label="Start Date"
            type="date"
            defaultValue="2023-01-01"
            size="small"
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            defaultValue="2023-12-31"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      ))}

      {/* Variables Section */}
      {renderSection('Variables', 'variables', (
        <Stack>
          <FormControlLabel
            control={
              <Checkbox 
                checked={selectedVariables.temperature}
                onChange={() => handleVariableChange('temperature')}
                size="small"
              />
            }
            label="Temperature (°C)"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={selectedVariables.precipitation}
                onChange={() => handleVariableChange('precipitation')}
                size="small"
              />
            }
            label="Precipitation (mm)"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={selectedVariables.humidity}
                onChange={() => handleVariableChange('humidity')}
                size="small"
              />
            }
            label="Humidity (%)"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={selectedVariables.windSpeed}
                onChange={() => handleVariableChange('windSpeed')}
                size="small"
              />
            }
            label="Wind Speed (m/s)"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={selectedVariables.pressure}
                onChange={() => handleVariableChange('pressure')}
                size="small"
              />
            }
            label="Pressure (hPa)"
          />
        </Stack>
      ))}

      {/* Data Sources Section */}
      {renderSection('Data Sources', 'dataSources', (
        <Stack>
          <FormControlLabel
            control={
              <Checkbox 
                checked={selectedDataSources.noaa}
                onChange={() => handleDataSourceChange('noaa')}
                size="small"
              />
            }
            label="NOAA Climate Data"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={selectedDataSources.nasa}
                onChange={() => handleDataSourceChange('nasa')}
                size="small"
              />
            }
            label="NASA Earth Observations"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={selectedDataSources.ecmwf}
                onChange={() => handleDataSourceChange('ecmwf')}
                size="small"
              />
            }
            label="ECMWF Climate Models"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={selectedDataSources.cmip6}
                onChange={() => handleDataSourceChange('cmip6')}
                size="small"
              />
            }
            label="CMIP6 Climate Model Outputs"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={selectedDataSources.worldClim}
                onChange={() => handleDataSourceChange('worldClim')}
                size="small"
              />
            }
            label="WorldClim"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={selectedDataSources.reanalysis}
                onChange={() => handleDataSourceChange('reanalysis')}
                size="small"
              />
            }
            label="ERA5 Reanalysis"
          />
        </Stack>
      ))}

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" fullWidth color="primary">
          Apply Filters
        </Button>
      </Box>
    </Paper>
  );
};
