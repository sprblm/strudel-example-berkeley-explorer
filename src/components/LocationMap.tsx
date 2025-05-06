import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationMapProps {
  location: string;
  height?: number;
  width?: string;
  showLabel?: boolean;
}

// Map coordinates for different campus locations
const LOCATION_COORDINATES: Record<string, [number, number]> = {
  'Memorial Glade': [37.8728, -122.2600],
  'Hearst Greek Theatre': [37.8743, -122.2548],
  'Sather Gate': [37.8702, -122.2590],
  'Campanile': [37.8721, -122.2578],
  'Botanical Garden': [37.8756, -122.2390],
  'Faculty Glade': [37.8718, -122.2565],
  'Lawrence Hall of Science': [37.8775, -122.2465],
};

/**
 * A reusable Leaflet map component for displaying campus locations
 */
const LocationMap: React.FC<LocationMapProps> = ({ 
  location, 
  height = 150,
  width = '100%',
  showLabel = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Get coordinates for the location or default to Memorial Glade
      const coordinates = LOCATION_COORDINATES[location] || [37.8728, -122.2600];
      
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false
      }).setView(coordinates, 16);
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Add marker for the location
      const marker = L.marker(coordinates, {
        icon: L.divIcon({
          html: `<div style="background-color: #3B82F6; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);">📍</div>`,
          className: '',
          iconSize: [24, 24]
        })
      }).addTo(map);
      
      // Store map reference
      mapRef.current = map;
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [location]);
  
  return (
    <Box sx={{ position: 'relative', height, width }}>
      <Box 
        ref={mapContainerRef} 
        sx={{ 
          height: '100%',
          width: '100%',
          borderRadius: 1,
          overflow: 'hidden'
        }} 
      />
      
      {showLabel && (
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 8, 
            right: 8, 
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem'
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {location}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LocationMap;
