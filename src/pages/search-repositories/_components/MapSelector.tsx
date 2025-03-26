import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import { MapContainer, TileLayer, Rectangle, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { taskflow } from '../_config/taskflow.config';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useFilters } from '../../../components/FilterContext';
import { setFilter } from '../components/FilterContext';

// Fix for default marker icons in Leaflet with webpack
// @ts-expect-error - Leaflet typings issue with imagePath
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Interface for the component props
interface MapSelectorProps {
  expanded?: boolean;
  onToggleExpand?: () => void;
} 

// Pre-defined regions for quick selection
const predefinedRegions = [
  { name: 'North America', bounds: [[24.5, -125.0], [49.5, -66.0]] },
  { name: 'South America', bounds: [[-55.0, -80.0], [12.0, -35.0]] },
  { name: 'Europe', bounds: [[36.0, -10.0], [70.0, 40.0]] },
  { name: 'Africa', bounds: [[-35.0, -20.0], [37.0, 50.0]] },
  { name: 'Asia', bounds: [[10.0, 40.0], [60.0, 150.0]] },
  { name: 'Australia', bounds: [[-45.0, 110.0], [-10.0, 155.0]] },
  { name: 'Arctic', bounds: [[66.5, -180.0], [90.0, 180.0]] },
  { name: 'Antarctic', bounds: [[-90.0, -180.0], [-60.0, 180.0]] },
];

// Reset map view control
const ResetMapView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  
  const resetView = () => {
    map.setView(center, zoom);
  };
  
  return (
    <Box 
      className="leaflet-control leaflet-bar" 
      sx={{ 
        position: 'absolute', 
        top: '80px', 
        right: '10px', 
        zIndex: 1000 
      }}
    >
      <Tooltip title="Reset View">
        <IconButton onClick={resetView} size="small" sx={{ bgcolor: 'background.paper' }}>
          <MyLocationIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

/**
 * MapSelector component for geographic selection in the Search Data Repositories task flow.
 * Allows users to visually select regions on a world map.
 */
export const MapSelector: React.FC<MapSelectorProps> = ({ expanded = false, onToggleExpand }) => {
  const { setFilter } = useFilters();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [customBounds, setCustomBounds] = useState<[[number, number], [number, number]] | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(expanded);
  
  const mapConfig = taskflow.pages.index.mapSearch || {
    enabled: true,
    defaultCenter: [0, 0],
    defaultZoom: 1,
    maxBounds: [[-90, -180], [90, 180]] as [[number, number], [number, number]],
  };
  
  // Toggle fullscreen mode
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (onToggleExpand) {
      onToggleExpand();
    }
  };
  
  // Handle region selection
  const handleRegionSelect = (regionName: string, bounds: [[number, number], [number, number]]) => {
    setSelectedRegion(regionName);
    setCustomBounds(bounds);

    // Update filter with selected region
    // Update filter with selected region
    setFilter('spatial_coverage', {
      operator: 'contains-one-of',
      value: [regionName],
    });
  };
  
  // Determine map height based on fullscreen state
  const mapHeight = isFullscreen ? '600px' : '300px';
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        position: 'relative',
        width: '100%', 
        height: mapHeight,
        transition: 'height 0.3s ease-in-out',
        mb: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden'
      }}
    >
      {/* Map Title and Controls */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          padding: 1,
          zIndex: 1000,
          backgroundColor: 'rgba(255,255,255,0.8)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Geographic Region Selection
        </Typography>
        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
          <IconButton onClick={handleToggleFullscreen} size="small">
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* The Map Component */}
      <MapContainer
        center={mapConfig.defaultCenter as [number, number]}
        zoom={mapConfig.defaultZoom}
        style={{ height: '100%', width: '100%' }}
        maxBounds={mapConfig.maxBounds}
        minZoom={1}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Display selected region */}
        {customBounds && (
          <Rectangle 
            bounds={customBounds}
            pathOptions={{ color: '#1976d2', weight: 2, fillOpacity: 0.2 }}
          />
        )}
        
        {/* Reset view control */}
        <ResetMapView center={mapConfig.defaultCenter as [number, number]} zoom={mapConfig.defaultZoom} />
      </MapContainer>
      
      {/* Region Selection Buttons */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          padding: 1,
          zIndex: 1000,
          backgroundColor: 'rgba(255,255,255,0.8)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5
        }}
      >
        {predefinedRegions.map((region) => (
          <Tooltip key={region.name} title={`Select ${region.name}`}>
            <Box 
              component="button"
              onClick={() => handleRegionSelect(region.name, region.bounds as [[number, number], [number, number]])}
              sx={{ 
                px: 1.5, 
                py: 0.5, 
                borderRadius: 1, 
                border: '1px solid',
                borderColor: selectedRegion === region.name ? 'primary.main' : 'divider',
                backgroundColor: selectedRegion === region.name ? 'primary.light' : 'background.paper',
                color: selectedRegion === region.name ? 'primary.contrastText' : 'text.primary',
                cursor: 'pointer',
                fontSize: '0.75rem',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              {region.name}
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Paper>
  );
};
