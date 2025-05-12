import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemText,
  Checkbox,
  CircularProgress,
  Alert
} from '@mui/material';
import { ChevronLeft, LayersIcon, MapIcon } from '../../../components/Icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import type { TreeObservation } from '../../../types/data.interfaces';
import type { AirQualityObservation } from '../../../types/air-quality.interfaces';

// We'll define an interface for the component props
interface VisualizationViewProps {
  activeChart: 'timeSeries' | 'map' | 'histogram' | 'distribution';
  onToggleControls: () => void;
  showControls: boolean;
  dataType: string;
  treesLayerEnabled: boolean;
  sensorsLayerEnabled: boolean;
}

// Air quality sensor positions - derived from actual data
const AIR_SENSOR_LOCATIONS = [
  { id: 1, lat: 37.8712, lng: -122.2687, official: true, name: 'Berkeley - Downtown' },
  { id: 2, lat: 37.8664, lng: -122.2564, official: true, name: 'Berkeley - Campus' },
  { id: 3, lat: 37.8735, lng: -122.2780, official: false, name: 'Berkeley - West' },
  { id: 4, lat: 37.8786, lng: -122.2598, official: false, name: 'Berkeley - North' }
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
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const [layersRef, setLayersRef] = useState<{trees: L.LayerGroup, airQuality: L.LayerGroup} | null>(null);
  const [treeData, setTreeData] = useState<any>(null); // Changed to any to handle GeoJSON format
  const [airQualityData, setAirQualityData] = useState<AirQualityObservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Using refs for map and layers to avoid reference issues in useEffect
  const mapRefInstance = useRef<L.Map | null>(null);
  const layersRefInstance = useRef<{trees: L.LayerGroup, airQuality: L.LayerGroup} | null>(null);

  // Load Berkeley tree data and air quality data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch tree data
        const treeResponse = await fetch('/data/processed/berkeley_trees_processed.json');
        if (!treeResponse.ok) {
          throw new Error(`Failed to fetch tree data: ${treeResponse.status}`);
        }
        const treeDataResult = await treeResponse.json();
        console.log('Tree data loaded:', treeDataResult);
        setTreeData(treeDataResult);
        
        // Fetch air quality data
        const airQualityResponse = await fetch('/data/airnow/airnow_94720_400days.json');
        if (!airQualityResponse.ok) {
          throw new Error(`Failed to fetch air quality data: ${airQualityResponse.status}`);
        }
        const airQualityDataResult: AirQualityObservation[] = await airQualityResponse.json();
        console.log('Air quality data loaded:', airQualityDataResult.length, 'records');
        setAirQualityData(airQualityDataResult);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        // Even if there's an error, we'll set loading to false after a short delay
        // This ensures the UI doesn't get stuck in a loading state
        setTimeout(() => setLoading(false), 500);
      }
    };
    
    fetchData();
  }, []);

  // Function to get color based on tree health
  const getTreeColor = (health: string) => {
    if (!health) return '#9E9E9E';
    
    switch (health.toLowerCase()) {
      case 'good': return '#4CAF50';
      case 'fair': return '#FFC107';
      case 'poor': return '#F44336';
      case 'dead': return '#795548';
      default: return '#9E9E9E';
    }
  };

  // Calculate center point of a set of coordinates
  const calculateCenter = (points: {lat: number, lng: number}[]) => {
    if (points.length === 0) return {lat: 37.8715, lng: -122.2730}; // Default to Berkeley
    
    const sumLat = points.reduce((sum, point) => sum + point.lat, 0);
    const sumLng = points.reduce((sum, point) => sum + point.lng, 0);
    
    return {
      lat: sumLat / points.length,
      lng: sumLng / points.length
    };
  };

  // State for layer visibility
  const [visibleLayers, setVisibleLayers] = useState<string[]>([
    treesLayerEnabled ? 'trees' : '',
    sensorsLayerEnabled ? 'airQuality' : ''
  ].filter(Boolean));
  
  // State for layers menu
  const [layersMenuAnchorEl, setLayersMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isLayersMenuOpen = Boolean(layersMenuAnchorEl);
  
  // Map initialization ref
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  
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
  
  // Create and initialize map when component mounts and data is loaded
  useEffect(() => {
    // Make sure the container is fully available with proper dimensions
    if (!mapContainerRef.current || mapRefInstance.current || loading || !treeData) {
      return; // Exit early if conditions aren't met
    }
    
    // Give the DOM a chance to render and establish proper layout
    const initMap = setTimeout(() => {
      if (!mapContainerRef.current) return;
      
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        // Disable initial animations to avoid position calculation issues
        fadeAnimation: false,
        zoomAnimation: false
      }).setView([37.8715, -122.2680], 15); // UC Berkeley coordinates
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Create layer groups
      const treeLayer = L.layerGroup();
      const sensorLayer = L.layerGroup();
      
      // Get most recent air quality data for each parameter
      const latestAQData: Record<string, AirQualityObservation> = {};
      
      // Group by parameter and find the most recent for each
      airQualityData.forEach(reading => {
        const paramName = reading.ParameterName;
        if (!latestAQData[paramName] || 
            new Date(reading.DateObserved) > new Date(latestAQData[paramName].DateObserved)) {
          latestAQData[paramName] = reading;
        }
      });
      
      // Add air quality sensor markers with real data
      AIR_SENSOR_LOCATIONS.forEach(sensor => {
        // Get the most recent PM2.5 data or default to moderate if not available
        const pm25Data = latestAQData['PM2.5'] || { AQI: 51, Category: { Name: 'Moderate' }, DateObserved: new Date().toISOString() };
        
        // Color based on AQI category
        let markerColor = '#2196F3'; // Default blue
        if (pm25Data.Category.Name === 'Good') {
          markerColor = '#4CAF50'; // Green
        } else if (pm25Data.Category.Name === 'Moderate') {
          markerColor = '#FF9800'; // Orange
        } else if (['Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'].includes(pm25Data.Category.Name)) {
          markerColor = '#F44336'; // Red
        }
        
        const customIcon = L.divIcon({
          html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">📊</div>`,
          className: '',
          iconSize: [24, 24]
        });
        
        const marker = L.marker([sensor.lat, sensor.lng], { icon: customIcon })
          .bindPopup(`
            <div>
              <h3>${sensor.name}</h3>
              <p>PM2.5 AQI: ${pm25Data.AQI} (${pm25Data.Category.Name})</p>
              <p>Date: ${pm25Data.DateObserved}</p>
              <p>Status: ${sensor.official ? 'Official Monitor' : 'Local Monitor'}</p>
            </div>
          `);
        
        marker.addTo(sensorLayer);
      });
      
      // Add tree markers - limit to 200 trees for performance
      if (treeData && Array.isArray(treeData)) {
        try {
          // Get a sample of trees (first 200) for better performance
          const treeSample = treeData.slice(0, 200);
          console.log(`Adding ${treeSample.length} tree markers out of ${treeData.length} total`);
          
          treeSample.forEach((tree: any) => {
            if (!tree.location || !Array.isArray(tree.location) || tree.location.length < 2) {
              console.warn('Tree missing location data', tree);
              return;
            }
            
            const coordinates = tree.location;
            
            // Get tree color based on condition
            const condition = tree.healthCondition || 'Unknown';
            const treeColor = getTreeColor(condition);
            
            const customIcon = L.divIcon({
              html: `<div style="background-color: ${treeColor}; width: 8px; height: 8px; border-radius: 50%; border: 1px solid white;"></div>`,
              className: '',
              iconSize: [8, 8]
            });
            
            try {
              // Location array uses [longitude, latitude] format
              const marker = L.marker([coordinates[1], coordinates[0]], { icon: customIcon })
                .bindPopup(`
                  <div>
                    <h3>${tree.species || 'Unknown Species'}</h3>
                    <p>Condition: ${condition}</p>
                    ${tree.dbh ? `<p>Diameter: ${tree.dbh} inches</p>` : ''}
                    ${tree.height ? `<p>Height: ${tree.height} ft</p>` : ''}
                  </div>
                `);
              
              marker.addTo(treeLayer);
            } catch (err) {
              console.warn('Error adding tree marker:', err, coordinates);
            }
          });
        } catch (err) {
          console.error('Error processing tree data:', err);
        }
      }
      
      // Store references
      mapRefInstance.current = map;
      setMapRef(map);
      
      layersRefInstance.current = {
        trees: treeLayer,
        airQuality: sensorLayer
      };
      setLayersRef({
        trees: treeLayer,
        airQuality: sensorLayer
      });
      
      // Initialize with both layers visible
      treeLayer.addTo(map);
      sensorLayer.addTo(map);
    }, 100); // Add a small delay (100ms) to ensure the container is ready
    
    // Clear timeout to avoid memory leaks
    return () => {
      clearTimeout(initMap);
      if (mapRefInstance.current) {
        mapRefInstance.current.remove();
        mapRefInstance.current = null;
        setMapRef(null);
      }
    };
  }, [treeData, airQualityData]);

  // Update layer visibility when visibleLayers changes
  useEffect(() => {
    const map = mapRefInstance.current;
    const layers = layersRefInstance.current;
    
    if (map && layers) {
      // Update tree layer visibility
      if (visibleLayers.includes('trees')) {
        layers.trees.addTo(map);
      } else {
        layers.trees.removeFrom(map);
      }
      
      // Update air quality sensor layer visibility
      if (visibleLayers.includes('airQuality')) {
        layers.airQuality.addTo(map);
      } else {
        layers.airQuality.removeFrom(map);
      }
    }
  }, [visibleLayers]);

  // Update map when dataType changes
  useEffect(() => {
    const map = mapRefInstance.current;
    const layers = layersRefInstance.current;
    
    if (map && layers) {
      // Update map center when dataType changes
      if (dataType === 'trees') {
        // Ensure tree layer is visible (even if toggle is off)
        layers.trees.addTo(map);
        
        // Find center point of tree data
        if (treeData && treeData.features && treeData.features.length > 0) {
          // Default Berkeley center
          map.setView([37.8715, -122.2680], 15);
        }
      } else if (dataType === 'airQuality') {
        // Ensure sensor layer is visible (even if toggle is off)
        layers.airQuality.addTo(map);
        
        const sensorCenter = calculateCenter(AIR_SENSOR_LOCATIONS.map(sensor => ({
          lat: sensor.lat,
          lng: sensor.lng
        })));
        map.setView([sensorCenter.lat, sensorCenter.lng], 15);
      }
    }
  }, [dataType, treeData]);

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
          {loading && <CircularProgress size={16} sx={{ ml: 2 }} />}
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
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading indicator */}
      {loading ? (
        <Box 
          sx={{ 
            flex: 1,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            minHeight: '500px'
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading environmental data...
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Processing {treeData?.features?.length > 0 ? treeData.features.length.toLocaleString() : '...'} trees
          </Typography>
        </Box>
      ) : (
        /* Map Container */
        <Box 
          ref={mapContainerRef} 
          sx={{ 
            flex: 1,
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '500px' // Ensure minimum height for the map container
          }} 
        />
      )}
    
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
        <ListItemText primary="Trees" secondary={`${treeData?.features ? '(200 of ' + treeData.features.length.toLocaleString() + ')' : ''}`} />
      </MenuItem>
      <MenuItem onClick={() => handleLayerToggle('airQuality')}>
        <Checkbox checked={visibleLayers.includes('airQuality')} />
        <ListItemText primary="Air Quality Sensors" />
      </MenuItem>
    </Menu>
  </Box>
);
};
