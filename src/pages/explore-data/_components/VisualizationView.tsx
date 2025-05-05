import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  ButtonGroup, 
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText
} from '@mui/material';
import { ChevronLeft, DownloadIcon, LayersIcon, MapIcon } from '../../../components/Icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

// We'll define an interface for the component props
interface VisualizationViewProps {
  activeChart: 'timeSeries' | 'map' | 'histogram' | 'distribution';
  onToggleControls: () => void;
  showControls: boolean;
  dataType: string;
  treesLayerEnabled: boolean;
  sensorsLayerEnabled: boolean;
}

// Mock data for trees and sensors
const MOCK_TREES = [
  { id: 1, lat: 37.8716, lng: -122.2727, type: 'Coast Live Oak', condition: 'excellent' },
  { id: 2, lat: 37.8710, lng: -122.2695, type: 'California Redwood', condition: 'good' },
  { id: 3, lat: 37.8699, lng: -122.2735, type: 'American Elm', condition: 'fair' },
  { id: 4, lat: 37.8730, lng: -122.2707, type: 'London Plane', condition: 'good' },
  { id: 5, lat: 37.8705, lng: -122.2650, type: 'Monterey Pine', condition: 'fair' },
  { id: 6, lat: 37.8692, lng: -122.2700, type: 'Coast Live Oak', condition: 'good' }
];

const MOCK_AIR_SENSORS = [
  { id: 1, lat: 37.8712, lng: -122.2687, pm25: 8.3, official: true },
  { id: 2, lat: 37.8720, lng: -122.2720, pm25: 10.1, official: true },
  { id: 3, lat: 37.8695, lng: -122.2670, pm25: 7.8, official: true },
  { id: 4, lat: 37.8702, lng: -122.2715, pm25: 12.3, official: false }
];

/**
 * Main visualization component for the explore data page
 * Features an interactive map with tree and air quality data
 */
export const VisualizationView: React.FC<VisualizationViewProps> = ({
  activeChart,
  onToggleControls,
  showControls,
  dataType,
  treesLayerEnabled,
  sensorsLayerEnabled
}) => {
  // State for layer visibility
  const [visibleLayers, setVisibleLayers] = useState<string[]>([
    treesLayerEnabled ? 'trees' : '',
    sensorsLayerEnabled ? 'airQuality' : ''
  ].filter(Boolean));
  
  // State for layers menu
  const [layersMenuAnchorEl, setLayersMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isLayersMenuOpen = Boolean(layersMenuAnchorEl);
  
  // Map initialization ref
  const mapRef = React.useRef<any>(null);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const layersRef = React.useRef<any>(null);
  
  // Handle layer menu open/close
  const handleLayersMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLayersMenuAnchorEl(event.currentTarget);
  };
  
  const handleLayersMenuClose = () => {
    setLayersMenuAnchorEl(null);
  };
  
  // Toggle visibility of a layer
  const handleLayerToggle = (layer: string) => {
    if (visibleLayers.includes(layer)) {
      setVisibleLayers(visibleLayers.filter(l => l !== layer));
    } else {
      setVisibleLayers([...visibleLayers, layer]);
    }
  };
  
  // Create and initialize map when component mounts
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current).setView([37.8715, -122.2680], 15); // UC Berkeley coordinates
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Create layer groups
      const treeLayer = L.layerGroup();
      const sensorLayer = L.layerGroup();
      
      // Add tree markers
      MOCK_TREES.forEach(tree => {
        const marker = L.marker([tree.lat, tree.lng], {
          icon: L.divIcon({
            html: `<div style="background-color: #4CAF50; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">🌳</div>`,
            className: '',
            iconSize: [24, 24]
          })
        });
        
        marker.bindPopup(`
          <div>
            <h3>${tree.type}</h3>
            <p>Condition: ${tree.condition}</p>
          </div>
        `);
        
        marker.addTo(treeLayer);
      });
      
      // Add sensor markers
      MOCK_AIR_SENSORS.forEach(sensor => {
        const markerColor = sensor.pm25 > 10 ? '#e91e63' : '#2196F3';
        
        const customIcon = L.divIcon({
          html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">📊</div>`,
          className: '',
          iconSize: [24, 24]
        });
        
        const marker = L.marker([sensor.lat, sensor.lng], { icon: customIcon })
          .bindPopup(`
            <div>
              <h3>Air Quality Sensor</h3>
              <p>PM2.5: ${sensor.pm25} μg/m³</p>
              <p>Status: ${sensor.official ? 'Official' : 'Student'}</p>
            </div>
          `);
        
        marker.addTo(sensorLayer);
      });
      
      // Store references
      mapRef.current = map;
      layersRef.current = {
        trees: treeLayer,
        airQuality: sensorLayer
      };
      
      // Initialize with both layers visible
      treeLayer.addTo(map);
      sensorLayer.addTo(map);
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    }
  }, []);
  
  // Update visibleLayers when props change
  useEffect(() => {
    const newLayers = [
      treesLayerEnabled ? 'trees' : '',
      sensorsLayerEnabled ? 'airQuality' : ''
    ].filter(Boolean) as string[];
    
    setVisibleLayers(newLayers);
  }, [treesLayerEnabled, sensorsLayerEnabled]);
  
  // Update layer visibility when visibleLayers changes
  useEffect(() => {
    if (mapRef.current && layersRef.current) {
      // Update tree layer visibility
      if (visibleLayers.includes('trees')) {
        layersRef.current.trees.addTo(mapRef.current);
      } else {
        layersRef.current.trees.remove();
      }
      
      // Update air quality sensor layer visibility
      if (visibleLayers.includes('airQuality')) {
        layersRef.current.airQuality.addTo(mapRef.current);
      } else {
        layersRef.current.airQuality.remove();
      }
    }
  }, [visibleLayers]);
  
  // Update map when dataType changes
  useEffect(() => {
    if (mapRef.current && layersRef.current) {
      // Focus on relevant data based on selected data type
      if (dataType === 'trees') {
        // Ensure tree layer is visible (even if toggle is off)
        layersRef.current.trees.addTo(mapRef.current);
        // Find center point of tree data
        const treeCenter = calculateCenter(MOCK_TREES);
        mapRef.current.setView([treeCenter.lat, treeCenter.lng], 15);
      } else if (dataType === 'airQuality') {
        // Ensure sensor layer is visible (even if toggle is off)
        layersRef.current.airQuality.addTo(mapRef.current);
        // Find center point of sensor data
        const sensorCenter = calculateCenter(MOCK_AIR_SENSORS);
        mapRef.current.setView([sensorCenter.lat, sensorCenter.lng], 15);
      }
    }
  }, [dataType]);
  
  // Helper function to calculate center point of a dataset
  const calculateCenter = (data: any[]) => {
    let sumLat = 0;
    let sumLng = 0;
    
    data.forEach(item => {
      sumLat += item.lat;
      sumLng += item.lng;
    });
    
    return {
      lat: sumLat / data.length,
      lng: sumLng / data.length
    };
  };
  
  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* Visualization Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'grey.200'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Campus Explorer
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            UC Berkeley Campus Map
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={showControls ? "Hide controls" : "Show controls"}>
            <IconButton 
              size="small" 
              onClick={onToggleControls}
              sx={{ 
                border: '1px solid',
                borderColor: 'grey.300' 
              }}
            >
              {showControls ? <ChevronLeft size={18} /> : <MapIcon size={18} />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Layer controls">
            <IconButton 
              size="small"
              onClick={handleLayersMenuOpen}
              sx={{ 
                border: '1px solid',
                borderColor: 'grey.300' 
              }}
            >
              <LayersIcon size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Map Container */}
      <Box 
        ref={mapContainerRef} 
        sx={{ 
          flex: 1,
          position: 'relative'
        }} 
      />
      
      {/* Layers Menu */}
      <Menu
        anchorEl={layersMenuAnchorEl}
        open={isLayersMenuOpen}
        onClose={handleLayersMenuClose}
        PaperProps={{
          elevation: 2,
          sx: { minWidth: 180 }
        }}
      >
        <MenuItem onClick={() => handleLayerToggle('trees')}>
          <Checkbox checked={visibleLayers.includes('trees')} />
          <ListItemText primary="Trees" />
        </MenuItem>
        <MenuItem onClick={() => handleLayerToggle('airQuality')}>
          <Checkbox checked={visibleLayers.includes('airQuality')} />
          <ListItemText primary="Air Quality" />
        </MenuItem>
      </Menu>
    </Box>
  );
};
