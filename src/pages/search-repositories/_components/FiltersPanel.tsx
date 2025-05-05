import { 
  Box, 
  Typography, 
  Slider, 
  Select, 
  MenuItem, 
  TextField,
  Paper, 
  Button,
  ButtonGroup
} from '@mui/material';
import React, { useState } from 'react';
import { Forest, FilterAlt, LocationOn } from '@mui/icons-material';

/**
 * Filters panel component with tabbed interface for Trees, Air Quality, and Locations
 */
const FiltersPanel: React.FC = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<number>(2); // Default to Locations tab
  
  // State for Trees filters
  const [species, setSpecies] = useState('');
  const [health, setHealth] = useState('Any');
  const [minHeight, setMinHeight] = useState<number>(0);
  const [maxHeight, setMaxHeight] = useState<number>(100);
  
  // State for Air Quality filters
  const [dataSource, setDataSource] = useState('Any');
  const [minPm25, setMinPm25] = useState<number>(0);
  const [maxPm25, setMaxPm25] = useState<number>(50);
  
  // State for Locations filters
  const [locationName, setLocationName] = useState('');
  const [locationType, setLocationType] = useState('Any');
  
  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
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
          Data Source
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
          max={50}
          sx={{
            color: '#2196F3', // Blue color for slider
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
          Max PM2.5 (µg/m³): {maxPm25}
        </Typography>
        <Slider
          value={maxPm25}
          onChange={(e, val) => setMaxPm25(val as number)}
          aria-labelledby="max-pm25-slider"
          valueLabelDisplay="auto"
          min={0}
          max={50}
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

        {/* Button-style tabs */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Button
            variant="text"
            startIcon={<Forest fontSize="small" />}
            onClick={() => handleTabChange(0)}
            sx={{
              textTransform: 'none',
              color: activeTab === 0 ? '#4CAF50' : 'text.primary',
              border: activeTab === 0 ? '1px solid #4CAF50' : '1px solid transparent',
              borderRadius: 1,
              backgroundColor: activeTab === 0 ? 'rgba(76, 175, 80, 0.04)' : 'transparent',
              '&:hover': {
                backgroundColor: activeTab === 0 ? 'rgba(76, 175, 80, 0.08)' : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Trees
          </Button>
          
          <Button
            variant="text"
            startIcon={<FilterAlt fontSize="small" />}
            onClick={() => handleTabChange(1)}
            sx={{
              textTransform: 'none',
              color: activeTab === 1 ? '#4CAF50' : 'text.primary',
              border: activeTab === 1 ? '1px solid #4CAF50' : '1px solid transparent',
              borderRadius: 1,
              backgroundColor: activeTab === 1 ? 'rgba(76, 175, 80, 0.04)' : 'transparent',
              '&:hover': {
                backgroundColor: activeTab === 1 ? 'rgba(76, 175, 80, 0.08)' : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Air Quality
          </Button>
          
          <Button
            variant="text"
            startIcon={<LocationOn fontSize="small" />}
            onClick={() => handleTabChange(2)}
            sx={{
              textTransform: 'none',
              color: activeTab === 2 ? '#4CAF50' : 'text.primary',
              border: activeTab === 2 ? '1px solid #4CAF50' : '1px solid transparent',
              borderRadius: 1,
              backgroundColor: activeTab === 2 ? 'rgba(76, 175, 80, 0.04)' : 'transparent',
              '&:hover': {
                backgroundColor: activeTab === 2 ? 'rgba(76, 175, 80, 0.08)' : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Locations
          </Button>
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
