import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DataPoint {
  id: string;
  type: 'tree' | 'air';
  lat: number;
  lng: number;
  title: string;
  value?: number;
}

interface CampusDataMapProps {
  height?: number | string;
  width?: string | number;
  showControls?: boolean;
  dataPoints?: DataPoint[];
  onPointClick?: (point: DataPoint) => void;
}

// Mock data points for the map
const DEFAULT_DATA_POINTS: DataPoint[] = [
  { id: '1', type: 'tree', lat: 37.8716, lng: -122.2727, title: 'Coast Live Oak' },
  { id: '2', type: 'tree', lat: 37.8710, lng: -122.2695, title: 'California Redwood' },
  { id: '3', type: 'tree', lat: 37.8699, lng: -122.2735, title: 'American Elm' },
  { id: '4', type: 'tree', lat: 37.8730, lng: -122.2707, title: 'London Plane' },
  { id: '5', type: 'air', lat: 37.8712, lng: -122.2687, title: 'PM2.5 Sensor', value: 8.3 },
  { id: '6', type: 'air', lat: 37.8720, lng: -122.2720, title: 'PM2.5 Sensor', value: 10.1 },
  { id: '7', type: 'air', lat: 37.8695, lng: -122.2670, title: 'PM2.5 Sensor', value: 7.8 },
  { id: '8', type: 'air', lat: 37.8702, lng: -122.2715, title: 'PM2.5 Sensor', value: 12.3 },
];

/**
 * A Leaflet map component for displaying campus environmental data points
 */
const CampusDataMap: React.FC<CampusDataMapProps> = ({ 
  height = 400,
  width = '100%',
  showControls = true,
  dataPoints = DEFAULT_DATA_POINTS,
  onPointClick
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  
  const [visibleLayers, setVisibleLayers] = useState<('tree' | 'air')[]>(['tree', 'air']);
  
  // Initialize map when component mounts
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Initialize map centered on UC Berkeley
      const map = L.map(mapContainerRef.current).setView([37.8715, -122.2680], 15);
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Create layer groups
      const treeLayer = L.layerGroup();
      const airLayer = L.layerGroup();
      
      // Add data points to appropriate layers
      dataPoints.forEach(point => {
        const markerColor = point.type === 'tree' 
          ? '#4CAF50' 
          : (point.value && point.value > 10 ? '#e91e63' : '#2196F3');
        
        const icon = L.divIcon({
          html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);">${point.type === 'tree' ? '🌳' : '📊'}</div>`,
          className: '',
          iconSize: [24, 24]
        });
        
        const marker = L.marker([point.lat, point.lng], { icon })
          .bindPopup(`
            <div>
              <h3>${point.title}</h3>
              ${point.value ? `<p>${point.type === 'air' ? 'PM2.5: ' + point.value + ' μg/m³' : ''}</p>` : ''}
              <p>Location: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</p>
            </div>
          `);
        
        // Add click handler if provided
        if (onPointClick) {
          marker.on('click', () => {
            onPointClick(point);
          });
        }
        
        // Add to appropriate layer
        if (point.type === 'tree') {
          marker.addTo(treeLayer);
        } else {
          marker.addTo(airLayer);
        }
        
        // Store marker reference
        markersRef.current[point.id] = marker;
      });
      
      // Store references
      mapRef.current = map;
      
      // Add layers to map
      treeLayer.addTo(map);
      airLayer.addTo(map);
      
      // Store layer references
      markersRef.current.layers = {
        tree: treeLayer,
        air: airLayer
      };
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [dataPoints, onPointClick]);
  
  // Update layer visibility when visibleLayers changes
  useEffect(() => {
    if (mapRef.current && markersRef.current.layers) {
      const { tree, air } = markersRef.current.layers;
      
      // Update tree layer visibility
      if (visibleLayers.includes('tree')) {
        tree.addTo(mapRef.current);
      } else {
        tree.remove();
      }
      
      // Update air layer visibility
      if (visibleLayers.includes('air')) {
        air.addTo(mapRef.current);
      } else {
        air.remove();
      }
    }
  }, [visibleLayers]);
  
  // Toggle layer visibility
  const toggleLayer = (layer: 'tree' | 'air') => {
    if (visibleLayers.includes(layer)) {
      setVisibleLayers(visibleLayers.filter(l => l !== layer));
    } else {
      setVisibleLayers([...visibleLayers, layer]);
    }
  };
  
  return (
    <Box sx={{ position: 'relative', height, width }}>
      <Box 
        ref={mapContainerRef} 
        sx={{ 
          height: '100%',
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden'
        }} 
      />
      
      {/* Map controls */}
      {showControls && (
        <Box sx={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          bgcolor: 'white',
          p: 1,
          borderRadius: 1,
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
            Data Layers
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label="Trees" 
              size="small"
              color={visibleLayers.includes('tree') ? 'success' : 'default'}
              variant={visibleLayers.includes('tree') ? 'filled' : 'outlined'}
              onClick={() => toggleLayer('tree')}
            />
            <Chip 
              label="Air Quality" 
              size="small"
              color={visibleLayers.includes('air') ? 'primary' : 'default'}
              variant={visibleLayers.includes('air') ? 'filled' : 'outlined'}
              onClick={() => toggleLayer('air')}
            />
          </Box>
        </Box>
      )}
      
      {/* Map attribution */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 5, 
        right: 5, 
        bgcolor: 'rgba(255, 255, 255, 0.7)',
        px: 0.5,
        borderRadius: 0.5,
        fontSize: '0.7rem'
      }}>
        <Typography variant="caption" color="text.secondary">
          UC Berkeley Campus Map
        </Typography>
      </Box>
    </Box>
  );
};

export default CampusDataMap;
