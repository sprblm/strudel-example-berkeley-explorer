/**
 * FiltersPanel component for the Search Repositories section.
 * Provides a tabbed interface for filtering environmental data by Trees, Air Quality, and Locations.
 * Includes sliders, selects, and other controls for refining search results based on various criteria.
 */
import { 
  Box, 
  Typography, 
  Slider, 
  Select, 
  MenuItem, 
  TextField,
  Paper, 
  Button
} from '@mui/material';
import React, { useState } from 'react';
import { TreeIcon, AirQualityIcon, LocationIcon } from '../../../components/Icons';
import { useFilters } from '../../../components/FilterContext';
import { styled } from '@mui/material/styles';

const LayerButton = styled(Button)<{ selected?: boolean }>(({ theme, selected }) => ({
  border: '1.5px solid',
  borderColor: selected ? theme.palette.primary.main : theme.palette.grey[300],
  background: selected ? theme.palette.action.selected : 'transparent',
  color: selected ? theme.palette.primary.main : theme.palette.text.primary,
  fontWeight: 500,
  borderRadius: 8,
  boxShadow: 'none',
  textTransform: 'none',
  minHeight: 40,
  justifyContent: 'flex-start',
  px: 2,
  py: 1,
  gap: 1,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    background: theme.palette.action.hover,
  },
}));

const FiltersPanel: React.FC = () => {
  const { setFilter, clearFilters } = useFilters();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<number>(2); // Default to Locations tab
  
  // State for Trees filters
  const [species, setSpecies] = useState('');
  const [health, setHealth] = useState('Any');
  const [minHeight, setMinHeight] = useState<number>(0);
  const [maxHeight, setMaxHeight] = useState<number>(100);
  
  // State for Air Quality filters
  const [dataSource, setDataSource] = useState('Any');
  const [aqParam, setAqParam] = useState<string>('PM2.5');
  const [minPm25, setMinPm25] = useState<number>(0);
  const [maxPm25, setMaxPm25] = useState<number>(100);
  const [minOzone, setMinOzone] = useState<number>(0);
  const [maxOzone, setMaxOzone] = useState<number>(200);
  
  // State for Locations filters
  const [locationName, setLocationName] = useState('');
  const [locationType, setLocationType] = useState('Any');
  
  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Handle search for Locations
  const handleLocationSearch = () => {
    clearFilters(); // Clear previous filters
    
    // Apply location-specific filters
    setFilter('type', 'location');
    
    if (locationName && locationName !== '') {
      setFilter('name', locationName);
    }
    
    if (locationType && locationType !== 'Any') {
      setFilter('location_type', locationType);
    }
  };
  
  // Handle search for Trees
  const handleTreeSearch = () => {
    clearFilters(); // Clear previous filters
    
    // Apply tree-specific filters
    setFilter('type', 'tree');
    
    if (species && species !== '') {
      setFilter('species', species);
    }
    
    if (health && health !== 'Any') {
      setFilter('health', health);
    }
    
    if (minHeight > 0) {
      // Use a custom field name to indicate filter type
      setFilter('height_min', minHeight);
    }
    
    if (maxHeight < 100) {
      // Use a custom field name to indicate filter type
      setFilter('height_max', maxHeight);
    }
  };
  
  // Handle search for Air Quality
  const handleAirQualitySearch = () => {
    clearFilters(); // Clear previous filters
    
    // Apply air quality-specific filters
    setFilter('type', 'air');
    
    if (dataSource && dataSource !== 'Any') {
      setFilter('source', dataSource);
    }
    
    if (aqParam && aqParam !== 'Any') {
      setFilter('parameter', aqParam);
    }
    
    // Handle PM2.5 range
    if (minPm25 > 0) {
      setFilter('pm25_min', minPm25);
    }
    
    if (maxPm25 < 100) {
      setFilter('pm25_max', maxPm25);
    }
    
    // Handle Ozone range
    if (minOzone > 0) {
      setFilter('ozone_min', minOzone);
    }
    
    if (maxOzone < 200) {
      setFilter('ozone_max', maxOzone);
    }
  };
  
  // Trees filter content
  const renderTreesFilters = () => (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
          Species
        </Typography>
        <TextField 
          fullWidth
          variant="outlined" 
          size="small" 
          placeholder="e.g. Oak, Redwood"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
        />
      </Box>
      
      <Box>
        <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
          Health
        </Typography>
        <Select
          fullWidth
          size="small"
          value={health}
          onChange={(e) => setHealth(e.target.value as string)}
          displayEmpty
        >
          <MenuItem value="Any">Any</MenuItem>
          <MenuItem value="Good">Good</MenuItem>
          <MenuItem value="Fair">Fair</MenuItem>
          <MenuItem value="Poor">Poor</MenuItem>
        </Select>
      </Box>
      
      <Box>
        <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
          Min Height (ft): {minHeight}
        </Typography>
        <Slider
          value={minHeight}
          onChange={(e, val) => setMinHeight(val as number)}
          aria-labelledby="min-height-slider"
          valueLabelDisplay="auto"
          min={0}
          max={100}
          sx={{
            color: '#4CAF50', // Green color for slider
            '& .MuiSlider-thumb': {
              borderRadius: '50%',
              width: 16,
              height: 16,
              backgroundColor: '#fff',
              border: '2px solid currentColor',
            },
            '& .MuiSlider-track': {
              height: 6,
              borderRadius: 3,
            },
            '& .MuiSlider-rail': {
              height: 6,
              borderRadius: 3,
              opacity: 0.5,
              backgroundColor: '#bfbfbf',
            },
          }}
        />
      </Box>
      
      <Box>
        <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
          Max Height (ft): {maxHeight}
        </Typography>
        <Slider
          value={maxHeight}
          onChange={(e, val) => setMaxHeight(val as number)}
          aria-labelledby="max-height-slider"
          valueLabelDisplay="auto"
          min={0}
          max={100}
          sx={{
            color: '#4CAF50', // Green color for slider
            '& .MuiSlider-thumb': {
              borderRadius: '50%',
              width: 16,
              height: 16,
              backgroundColor: '#fff',
              border: '2px solid currentColor',
            },
            '& .MuiSlider-track': {
              height: 6,
              borderRadius: 3,
            },
            '& .MuiSlider-rail': {
              height: 6,
              borderRadius: 3,
              opacity: 0.5,
              backgroundColor: '#bfbfbf',
            },
          }}
        />
      </Box>
      
      <Button 
        variant="contained" 
        fullWidth
        sx={{ 
          mt: 1, 
          bgcolor: '#4CAF50', 
          '&:hover': { bgcolor: '#388E3C' },
          textTransform: 'none',
          py: 1.5
        }}
        onClick={handleTreeSearch}
      >
        Search Trees
      </Button>
    </Box>
  );
  
  // Air Quality filter content
  const renderAirQualityFilters = () => (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
          Sensor
        </Typography>
        <Select
          fullWidth
          size="small"
          value={dataSource}
          onChange={(e) => setDataSource(e.target.value as string)}
          displayEmpty
        >
          <MenuItem value="Any">Any</MenuItem>
          <MenuItem value="Sensor A">Sensor A</MenuItem>
          <MenuItem value="Sensor B">Sensor B</MenuItem>
        </Select>
      </Box>
      {/* Parameter selection */}
      <Box>
        <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
          Parameter
        </Typography>
        <Select
          fullWidth
          size="small"
          value={aqParam}
          onChange={e => setAqParam(e.target.value as string)}
        >
          <MenuItem value="PM2.5">PM2.5</MenuItem>
          <MenuItem value="OZONE">Ozone</MenuItem>
        </Select>
      </Box>
      {/* Dynamic sliders for selected AQ param */}
      {aqParam === 'PM2.5' && (
        <>
          <Box>
            <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
              Min PM2.5 (µg/m³): {minPm25}
            </Typography>
            <Slider
              value={minPm25}
              onChange={(e, val) => setMinPm25(val as number)}
              aria-labelledby="min-pm25-slider"
              valueLabelDisplay="auto"
              min={0}
              max={100}
              sx={{ color: '#2196F3', '& .MuiSlider-thumb': { borderRadius: '50%', width: 16, height: 16, backgroundColor: '#fff', border: '2px solid currentColor' }, '& .MuiSlider-track': { height: 6, borderRadius: 3 }, '& .MuiSlider-rail': { height: 6, borderRadius: 3, opacity: 0.5, backgroundColor: '#bfbfbf' } }}
            />
          </Box>
          <Box>
            <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
              Max PM2.5 (µg/m³): {maxPm25}
            </Typography>
            <Slider
              value={maxPm25}
              onChange={(e, val) => setMaxPm25(val as number)}
              aria-labelledby="max-pm25-slider"
              valueLabelDisplay="auto"
              min={0}
              max={100}
              sx={{ color: '#4CAF50', '& .MuiSlider-thumb': { borderRadius: '50%', width: 16, height: 16, backgroundColor: '#fff', border: '2px solid currentColor' }, '& .MuiSlider-track': { height: 6, borderRadius: 3 }, '& .MuiSlider-rail': { height: 6, borderRadius: 3, opacity: 0.5, backgroundColor: '#bfbfbf' } }}
            />
          </Box>
        </>
      )}
      {aqParam === 'OZONE' && (
        <>
          <Box>
            <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
              Min Ozone (ppb): {minOzone}
            </Typography>
            <Slider
              value={minOzone}
              onChange={(e, val) => setMinOzone(val as number)}
              aria-labelledby="min-ozone-slider"
              valueLabelDisplay="auto"
              min={0}
              max={200}
              sx={{ color: '#2196F3', '& .MuiSlider-thumb': { borderRadius: '50%', width: 16, height: 16, backgroundColor: '#fff', border: '2px solid currentColor' }, '& .MuiSlider-track': { height: 6, borderRadius: 3 }, '& .MuiSlider-rail': { height: 6, borderRadius: 3, opacity: 0.5, backgroundColor: '#bfbfbf' } }}
            />
          </Box>
          <Box>
            <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
              Max Ozone (ppb): {maxOzone}
            </Typography>
            <Slider
              value={maxOzone}
              onChange={(e, val) => setMaxOzone(val as number)}
              aria-labelledby="max-ozone-slider"
              valueLabelDisplay="auto"
              min={0}
              max={200}
              sx={{ color: '#4CAF50', '& .MuiSlider-thumb': { borderRadius: '50%', width: 16, height: 16, backgroundColor: '#fff', border: '2px solid currentColor' }, '& .MuiSlider-track': { height: 6, borderRadius: 3 }, '& .MuiSlider-rail': { height: 6, borderRadius: 3, opacity: 0.5, backgroundColor: '#bfbfbf' } }}
            />
          </Box>
        </>
      )}
      
      <Button 
        variant="contained" 
        fullWidth
        sx={{ 
          mt: 1, 
          bgcolor: '#4CAF50', 
          '&:hover': { bgcolor: '#388E3C' },
          textTransform: 'none',
          py: 1.5
        }}
        onClick={handleAirQualitySearch}
      >
        Search Air Quality
      </Button>
    </Box>
  );
  
  // Locations filter content
  const renderLocationsFilters = () => (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
          Name
        </Typography>
        <TextField 
          fullWidth
          variant="outlined" 
          size="small" 
          placeholder="e.g. Doe Library"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />
      </Box>
      
      <Box>
        <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
          Location Type
        </Typography>
        <Select
          fullWidth
          size="small"
          value={locationType}
          onChange={(e) => setLocationType(e.target.value as string)}
          displayEmpty
        >
          <MenuItem value="Any">Any</MenuItem>
          <MenuItem value="Building">Building</MenuItem>
          <MenuItem value="Landmark">Landmark</MenuItem>
          <MenuItem value="Open Space">Open Space</MenuItem>
        </Select>
      </Box>
      
      <Button 
        variant="contained" 
        fullWidth
        sx={{ 
          mt: 1, 
          bgcolor: '#4CAF50', 
          '&:hover': { bgcolor: '#388E3C' },
          textTransform: 'none',
          py: 1.5
        }}
        onClick={handleLocationSearch}
      >
        Search Locations
      </Button>
    </Box>
  );

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        width: '100%',
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
          Search Filters
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Find specific trees, air quality data, or campus locations
        </Typography>

        {/* Button-style tabs - replaced with LayerButton for visual match */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
          <LayerButton
            startIcon={<TreeIcon size={20} />}
            selected={activeTab === 0}
            variant="outlined"
            onClick={() => handleTabChange(0)}
          >
            Trees
          </LayerButton>
          <LayerButton
            startIcon={<AirQualityIcon size={20} />}
            selected={activeTab === 1}
            variant="outlined"
            onClick={() => handleTabChange(1)}
          >
            Air Quality
          </LayerButton>
          <LayerButton
            startIcon={<LocationIcon size={20} />}
            selected={activeTab === 2}
            variant="outlined"
            onClick={() => handleTabChange(2)}
          >
            Location
          </LayerButton>
        </Box>
      </Box>

      {/* Render content based on selected tab */}
      {activeTab === 0 && renderTreesFilters()}
      {activeTab === 1 && renderAirQualityFilters()}
      {activeTab === 2 && renderLocationsFilters()}
    </Paper>
  );
};

export default FiltersPanel;
