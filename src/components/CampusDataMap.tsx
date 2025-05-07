import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { AirQualityObservation } from '../types/air-quality.interfaces';

interface DataPoint {
  id: string;
  type: 'tree' | 'air';
  lat: number;
  lng: number;
  title: string;
  value?: number;
  category?: string;
  details?: Record<string, any>;
}

interface CampusDataMapProps {
  height?: number | string;
  width?: string | number;
  showControls?: boolean;
  dataPoints?: DataPoint[];
  onPointClick?: (point: DataPoint) => void;
}

// Function to get color based on AQI value
const getAqiColor = (aqi: number): string => {
  if (aqi <= 50) return '#00E400'; // Good
  if (aqi <= 100) return '#FFFF00'; // Moderate
  if (aqi <= 150) return '#FF7E00'; // Unhealthy for Sensitive Groups
  if (aqi <= 200) return '#FF0000'; // Unhealthy
  if (aqi <= 300) return '#99004C'; // Very Unhealthy
  return '#7E0023'; // Hazardous
};

// Function to get color based on tree condition
const getTreeColor = (condition: string): string => {
  switch (condition?.toLowerCase()) {
    case 'good': return '#4CAF50';
    case 'fair': return '#FFC107';
    case 'poor': return '#FF9800';
    case 'dead': return '#795548';
    case 'critical': return '#F44336';
    default: return '#4CAF50';
  }
};

/**
 * A Leaflet map component for displaying campus environmental data points
 */
const CampusDataMap: React.FC<CampusDataMapProps> = ({ 
  height = 400,
  width = '100%',
  showControls = true,
  dataPoints,
  onPointClick
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  
  const [visibleLayers, setVisibleLayers] = useState<('tree' | 'air')[]>(['tree', 'air']);
  const [loading, setLoading] = useState(true);
  const [loadedDataPoints, setLoadedDataPoints] = useState<DataPoint[]>([]);
  
  // State for tracking data loading errors
  const [dataError, setDataError] = useState<string | null>(null);

  // Load real data when component mounts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setDataError(null);
      
      let treeData = null;
      let airData: AirQualityObservation[] = [];
      
      try {
        // Load tree data
        let treeData = null;
        let airData: AirQualityObservation[] = [];
        
        try {
          // Use absolute path from public directory
          const treeResponse = await fetch('./data/processed/berkeley_trees_processed.json');
          if (!treeResponse.ok) {
            throw new Error(`Failed to fetch tree data: ${treeResponse.status}`);
          }
          treeData = await treeResponse.json();
        } catch (error) {
          console.warn('Tree data not available:', error);
          // Continue without tree data
        }
        
        try {
          // Load air quality data
          const airResponse = await fetch('./data/airnow/airnow_94720_400days.json');
          if (!airResponse.ok) {
            throw new Error(`Failed to fetch air quality data: ${airResponse.status}`);
          }
          airData = await airResponse.json();
        } catch (error) {
          console.warn('Air quality data not available:', error);
          // Continue without air quality data
        }
          
        // Process tree data - limit to 100 trees for performance
        const treePoints: DataPoint[] = treeData && treeData.features ? 
          treeData.features
            .slice(0, 100)
            .map((feature: any, index: number) => ({
            id: `tree-${feature.properties.OBJECTID || index}`,
            type: 'tree',
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
            title: feature.properties.SPECIES || 'Unknown Species',
            category: feature.properties.CONDITION,
            details: feature.properties
          })) : [];
        
        // Process air quality data - use most recent data points
        // Group by parameter name to get both PM2.5 and Ozone
        const latestAirData = airData && Array.isArray(airData) ? 
          airData
            .sort((a, b) => new Date(b.DateObserved).getTime() - new Date(a.DateObserved).getTime())
            .slice(0, 20) : [];
        
        const airPoints: DataPoint[] = latestAirData.length > 0 ? latestAirData.map((reading, index) => ({
          id: `air-${index}`,
          type: 'air',
          // Use Berkeley coordinates with slight offsets for visualization
          lat: 37.8715 + (Math.random() * 0.01 - 0.005),
          lng: -122.2680 + (Math.random() * 0.01 - 0.005),
          title: `${reading.ParameterName} Sensor`,
          value: reading.AQI,
          category: reading.Category.Name,
          details: reading
        })) : [];
        
        // If no real data is available, create sample data for demonstration
        let combinedDataPoints = [...treePoints, ...airPoints];
        
        if (combinedDataPoints.length === 0) {
          // Create sample tree data points around Berkeley
          const sampleTreePoints: DataPoint[] = Array(20).fill(0).map((_, index) => ({
            id: `sample-tree-${index}`,
            type: 'tree',
            lat: 37.8715 + (Math.random() * 0.02 - 0.01),
            lng: -122.2680 + (Math.random() * 0.02 - 0.01),
            title: `Sample Tree ${index + 1}`,
            category: ['Good', 'Fair', 'Poor'][Math.floor(Math.random() * 3)],
            details: { DBHMAX: Math.floor(Math.random() * 30) + 5 }
          }));
          
          // Create sample air quality data points
          const sampleAirPoints: DataPoint[] = Array(5).fill(0).map((_, index) => ({
            id: `sample-air-${index}`,
            type: 'air',
            lat: 37.8715 + (Math.random() * 0.02 - 0.01),
            lng: -122.2680 + (Math.random() * 0.02 - 0.01),
            title: `Sample ${['PM2.5', 'Ozone'][index % 2]} Sensor`,
            value: Math.floor(Math.random() * 150) + 10,
            category: 'Moderate',
            details: { DateObserved: new Date().toISOString().split('T')[0] }
          }));
          
          combinedDataPoints = [...sampleTreePoints, ...sampleAirPoints];
          setDataError('Using sample data for demonstration. Real data files not found.');
        }
        
        setLoadedDataPoints(combinedDataPoints);
      } catch (error) {
        console.error('Error in data processing:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Initialize map when component mounts or data is loaded
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current && !loading) {
      // Use provided data points or loaded data points
      const pointsToDisplay = dataPoints || loadedDataPoints;
      
      if (pointsToDisplay.length === 0) {
        return; // No data to display yet
      }
      
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
      pointsToDisplay.forEach(point => {
        // Determine marker color based on data type and values
        let markerColor;
        if (point.type === 'tree') {
          markerColor = getTreeColor(point.category || 'good');
        } else {
          markerColor = point.value ? getAqiColor(point.value) : '#2196F3';
        }
        
        const icon = L.divIcon({
          html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);">${point.type === 'tree' ? '🌳' : '📊'}</div>`,
          className: '',
          iconSize: [24, 24]
        });
        
        // Create popup content based on point type
        let popupContent = '';
        if (point.type === 'tree') {
          popupContent = `
            <div style="max-width: 200px;">
              <h3>${point.title}</h3>
              <p>Condition: ${point.category || 'Unknown'}</p>
              <p>Location: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</p>
              ${point.details?.DBHMAX ? `<p>Diameter: ${point.details.DBHMAX} inches</p>` : ''}
            </div>
          `;
        } else {
          popupContent = `
            <div style="max-width: 200px;">
              <h3>${point.title}</h3>
              <p>AQI: ${point.value} (${point.category})</p>
              <p>Date: ${point.details?.DateObserved || 'Recent'}</p>
              <p>Location: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</p>
            </div>
          `;
        }
        
        const marker = L.marker([point.lat, point.lng], { icon })
          .bindPopup(popupContent);
        
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
  }, [dataPoints, loadedDataPoints, loading, onPointClick]);
  
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
          overflow: 'hidden',
          position: 'relative'
        }} 
      />
      
      {/* Loading indicator */}
      {loading && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1000,
          borderRadius: 2
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Loading environmental data...
            </Typography>
          </Box>
        </Box>
      )}
      
      {/* Data error notification */}
      {!loading && dataError && (
        <Box sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          right: 10,
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 1,
          padding: 1,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #FFC107'
        }}>
          <Typography variant="body2" color="warning.main">
            <strong>Note:</strong> {dataError}
          </Typography>
        </Box>
      )}
      
      {/* Map controls */}
      {showControls && !loading && (
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
