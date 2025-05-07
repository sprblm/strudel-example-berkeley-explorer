import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  FormControl, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  Popover,
  List,
  ListItemButton,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import { ChevronDown, MapIcon } from '../../../components/Icons';

// Types for comparison options
export type ComparisonType = 'locations' | 'timePeriods' | 'dataSources';
export type DataSource = 'Official Sensors' | 'Student Contributions' | 'Historical Records';
export type Location = 'Memorial Glade' | 'Hearst Greek Theatre' | 'Campanile Esplanade' | 'Faculty Glade' | 'Doe Library' | 'Sather Tower (Campanile)' | 'Valley Life Sciences Building';

interface ComparisonSettingsProps {
  onComparisonTypeChange?: (type: ComparisonType) => void;
  onDataSourceAChange?: (source: DataSource) => void;
  onDataSourceBChange?: (source: DataSource) => void;
  onLocationAChange?: (location: Location) => void;
  onLocationBChange?: (location: Location) => void;
}

/**
 * Comparison Settings component for the compare-data page
 * Allows users to select comparison type and data sources or locations
 */
const ComparisonSettings: React.FC<ComparisonSettingsProps> = ({
  onComparisonTypeChange,
  onDataSourceAChange,
  onDataSourceBChange,
  onLocationAChange,
  onLocationBChange
}) => {
  // State for comparison settings
  const [comparisonType, setComparisonType] = useState<ComparisonType>('dataSources');
  const [dataSourceA, setDataSourceA] = useState<DataSource>('Official Sensors');
  const [dataSourceB, setDataSourceB] = useState<DataSource>('Student Contributions');
  const [locationA, setLocationA] = useState<Location>('Memorial Glade');
  const [locationB, setLocationB] = useState<Location>('Hearst Greek Theatre');
  
  // State for dropdown menus
  const [compareByAnchorEl, setCompareByAnchorEl] = useState<HTMLElement | null>(null);
  const [dataSourceAAnchorEl, setDataSourceAAnchorEl] = useState<HTMLElement | null>(null);
  const [dataSourceBAnchorEl, setDataSourceBAnchorEl] = useState<HTMLElement | null>(null);
  const [locationAAnchorEl, setLocationAAnchorEl] = useState<HTMLElement | null>(null);
  const [locationBAnchorEl, setLocationBAnchorEl] = useState<HTMLElement | null>(null);

  // Handle comparison type change
  const handleComparisonTypeChange = (type: ComparisonType) => {
    setComparisonType(type);
    setCompareByAnchorEl(null);
    if (onComparisonTypeChange) {
      onComparisonTypeChange(type);
    }
  };

  // Handle data source changes
  const handleDataSourceAChange = (source: DataSource) => {
    setDataSourceA(source);
    setDataSourceAAnchorEl(null);
    if (onDataSourceAChange) {
      onDataSourceAChange(source);
    }
  };

  const handleDataSourceBChange = (source: DataSource) => {
    setDataSourceB(source);
    setDataSourceBAnchorEl(null);
    if (onDataSourceBChange) {
      onDataSourceBChange(source);
    }
  };

  // Handle location changes
  const handleLocationAChange = (location: Location) => {
    setLocationA(location);
    setLocationAAnchorEl(null);
    if (onLocationAChange) {
      onLocationAChange(location);
    }
  };

  const handleLocationBChange = (location: Location) => {
    setLocationB(location);
    setLocationBAnchorEl(null);
    if (onLocationBChange) {
      onLocationBChange(location);
    }
  };

  // Get label based on comparison type
  const getSourceLabel = () => {
    switch (comparisonType) {
      case 'locations':
        return 'Location';
      case 'timePeriods':
        return 'Time Period';
      case 'dataSources':
        return 'Data Source';
      default:
        return 'Data Source';
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 2, 
        border: '1px solid',
        borderColor: 'grey.200'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <MapIcon size={16} color="#666" />
        <Typography variant="subtitle1" fontWeight={600} sx={{ ml: 1 }}>
          Comparison Settings
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select what you want to compare to see the differences
      </Typography>
      
      {/* Comparison Type Selection */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Compare By:
        </Typography>
        
        {/* Custom Dropdown for Compare By */}
        <Box 
          onClick={(e) => setCompareByAnchorEl(e.currentTarget)}
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 1,
            p: 1,
            bgcolor: 'white',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'grey.400'
            }
          }}
        >
          <Typography variant="body1">
            {comparisonType === 'locations' ? 'Campus Locations' : 
             comparisonType === 'timePeriods' ? 'Time Periods' : 'Data Sources'}
          </Typography>
          <ChevronDown size={16} color="#666" />
        </Box>
        
        <Popover
          open={Boolean(compareByAnchorEl)}
          anchorEl={compareByAnchorEl}
          onClose={() => setCompareByAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          sx={{
            '& .MuiPaper-root': {
              width: compareByAnchorEl?.offsetWidth,
              mt: 0.5,
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <List sx={{ p: 0 }}>
            <ListItemButton 
              selected={comparisonType === 'locations'}
              onClick={() => handleComparisonTypeChange('locations')}
            >
              <ListItemText primary="Campus Locations" />
            </ListItemButton>
            <ListItemButton 
              selected={comparisonType === 'timePeriods'}
              onClick={() => handleComparisonTypeChange('timePeriods')}
            >
              <ListItemText primary="Time Periods" />
            </ListItemButton>
            <ListItemButton 
              selected={comparisonType === 'dataSources'}
              onClick={() => handleComparisonTypeChange('dataSources')}
            >
              <ListItemText primary="Data Sources" />
            </ListItemButton>
          </List>
        </Popover>
      </Box>
      
      {/* Source Selection Row */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Source A */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {getSourceLabel()} A:
          </Typography>
          
          {comparisonType === 'locations' ? (
            // Location A Dropdown
            <Box 
              onClick={(e) => setLocationAAnchorEl(e.currentTarget)}
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 1,
                p: 1,
                bgcolor: 'white',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'grey.400'
                }
              }}
            >
              <Typography variant="body1">{locationA}</Typography>
              <ChevronDown size={16} color="#666" />
            </Box>
          ) : (
            // Data Source A Dropdown
            <Box 
              onClick={(e) => setDataSourceAAnchorEl(e.currentTarget)}
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 1,
                p: 1,
                bgcolor: 'white',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'grey.400'
                }
              }}
            >
              <Typography variant="body1">{dataSourceA}</Typography>
              <ChevronDown size={16} color="#666" />
            </Box>
          )}
          
          {/* Location A Popover */}
          <Popover
            open={Boolean(locationAAnchorEl)}
            anchorEl={locationAAnchorEl}
            onClose={() => setLocationAAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            sx={{
              '& .MuiPaper-root': {
                width: locationAAnchorEl?.offsetWidth,
                mt: 0.5,
                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <RadioGroup value={locationA} onChange={(e) => handleLocationAChange(e.target.value as Location)}>
              <List sx={{ p: 0 }}>
                {['Memorial Glade', 'Hearst Greek Theatre', 'Doe Library', 'Sather Tower (Campanile)', 'Valley Life Sciences Building'].map((location) => (
                  <ListItemButton key={location} dense>
                    <FormControlLabel 
                      value={location} 
                      control={<Radio size="small" />} 
                      label={location} 
                      sx={{ m: 0 }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </RadioGroup>
          </Popover>
          
          {/* Data Source A Popover */}
          <Popover
            open={Boolean(dataSourceAAnchorEl)}
            anchorEl={dataSourceAAnchorEl}
            onClose={() => setDataSourceAAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            sx={{
              '& .MuiPaper-root': {
                width: dataSourceAAnchorEl?.offsetWidth,
                mt: 0.5,
                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <List sx={{ p: 0 }}>
              <ListItemButton 
                selected={dataSourceA === 'Official Sensors'}
                onClick={() => handleDataSourceAChange('Official Sensors')}
              >
                <ListItemText primary="Official Sensors" />
              </ListItemButton>
              <ListItemButton 
                selected={dataSourceA === 'Student Contributions'}
                onClick={() => handleDataSourceAChange('Student Contributions')}
              >
                <ListItemText primary="Student Contributions" />
              </ListItemButton>
              <ListItemButton 
                selected={dataSourceA === 'Historical Records'}
                onClick={() => handleDataSourceAChange('Historical Records')}
              >
                <ListItemText primary="Historical Records" />
              </ListItemButton>
            </List>
          </Popover>
        </Box>
        
        {/* Source B */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {getSourceLabel()} B:
          </Typography>
          
          {comparisonType === 'locations' ? (
            // Location B Dropdown
            <Box 
              onClick={(e) => setLocationBAnchorEl(e.currentTarget)}
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 1,
                p: 1,
                bgcolor: 'white',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'grey.400'
                }
              }}
            >
              <Typography variant="body1">{locationB}</Typography>
              <ChevronDown size={16} color="#666" />
            </Box>
          ) : (
            // Data Source B Dropdown
            <Box 
              onClick={(e) => setDataSourceBAnchorEl(e.currentTarget)}
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 1,
                p: 1,
                bgcolor: 'white',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'grey.400'
                }
              }}
            >
              <Typography variant="body1">{dataSourceB}</Typography>
              <ChevronDown size={16} color="#666" />
            </Box>
          )}
          
          {/* Location B Popover */}
          <Popover
            open={Boolean(locationBAnchorEl)}
            anchorEl={locationBAnchorEl}
            onClose={() => setLocationBAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            sx={{
              '& .MuiPaper-root': {
                width: locationBAnchorEl?.offsetWidth,
                mt: 0.5,
                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <RadioGroup value={locationB} onChange={(e) => handleLocationBChange(e.target.value as Location)}>
              <List sx={{ p: 0 }}>
                {['Memorial Glade', 'Hearst Greek Theatre', 'Doe Library', 'Sather Tower (Campanile)', 'Valley Life Sciences Building'].map((location) => (
                  <ListItemButton key={location} dense>
                    <FormControlLabel 
                      value={location} 
                      control={<Radio size="small" />} 
                      label={location} 
                      sx={{ m: 0 }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </RadioGroup>
          </Popover>
          
          {/* Data Source B Popover */}
          <Popover
            open={Boolean(dataSourceBAnchorEl)}
            anchorEl={dataSourceBAnchorEl}
            onClose={() => setDataSourceBAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            sx={{
              '& .MuiPaper-root': {
                width: dataSourceBAnchorEl?.offsetWidth,
                mt: 0.5,
                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <List sx={{ p: 0 }}>
              <ListItemButton 
                selected={dataSourceB === 'Official Sensors'}
                onClick={() => handleDataSourceBChange('Official Sensors')}
              >
                <ListItemText primary="Official Sensors" />
              </ListItemButton>
              <ListItemButton 
                selected={dataSourceB === 'Student Contributions'}
                onClick={() => handleDataSourceBChange('Student Contributions')}
              >
                <ListItemText primary="Student Contributions" />
              </ListItemButton>
              <ListItemButton 
                selected={dataSourceB === 'Historical Records'}
                onClick={() => handleDataSourceBChange('Historical Records')}
              >
                <ListItemText primary="Historical Records" />
              </ListItemButton>
            </List>
          </Popover>
        </Box>
      </Box>
    </Paper>
  );
};

export default ComparisonSettings;