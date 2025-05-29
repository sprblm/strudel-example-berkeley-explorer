import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText
} from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import MapIcon from '@mui/icons-material/Map';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './VisualizationView.css';
import type { AirQualityObservation } from '../../../types/air-quality.interfaces';

// We'll define an interface for the component props
interface VisualizationViewProps {
  activeChart: 'timeSeries' | 'map' | 'histogram' | 'distribution';
  onToggleControls: () => void;
  showControls: boolean;
  dataType: 'trees' | 'airQuality';
  // Prefixing with underscore to indicate intentionally unused props
  _treesLayerEnabled?: boolean;
  _sensorsLayerEnabled?: boolean;
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
  activeChart: _activeChart,
  onToggleControls,
  showControls,
  dataType,
  _treesLayerEnabled,
  _sensorsLayerEnabled
}) => {
  const [visibleLayers, setVisibleLayers] = useState<string[]>(['trees', 'airQuality']);
  const [loading, setLoading] = useState<boolean>(false);
  // Error state is used in the error boundary and error message rendering
  const [error] = useState<string | null>(null);
  const [layersMenuAnchorEl, setLayersMenuAnchorEl] = useState<null | HTMLElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  const isLayersMenuOpen = Boolean(layersMenuAnchorEl);
  
  const handleLayersMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLayersMenuAnchorEl(event.currentTarget);
  };
  
  const handleLayersMenuClose = () => {
    setLayersMenuAnchorEl(null);
  };
  
  const handleLayerToggle = (layer: string) => {
    setVisibleLayers(prev => 
      prev.includes(layer)
        ? prev.filter(l => l !== layer)
        : [...prev, layer]
    );
  };
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  
  const layersRef = useRef<{
    trees: L.LayerGroup | null;
    airQuality: L.LayerGroup | null;
    locations: L.LayerGroup | null;
  }>({ trees: null, airQuality: null, locations: null });

  const [treeData, setTreeData] = useState<GeoJSON.FeatureCollection<GeoJSON.Geometry> | null>(null); 
  const [airQualityData, setAirQualityData] = useState<AirQualityObservation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch tree data
        const treeResponse = await fetch('/data/processed/berkeley_trees_processed.json');
        if (!treeResponse.ok) {
          throw new Error(`Failed to fetch tree data: ${treeResponse.status}`);
        }
        const treeDataResult: GeoJSON.FeatureCollection<GeoJSON.Geometry> = await treeResponse.json();
        setTreeData(treeDataResult);
        
        // Fetch air quality data
        const airQualityResponse = await fetch('/data/airnow/airnow_94720_400days.json');
        if (!airQualityResponse.ok) {
          throw new Error(`Failed to fetch air quality data: ${airQualityResponse.status}`);
        }
        const airQualityDataResult: AirQualityObservation[] = await airQualityResponse.json();
        setAirQualityData(airQualityDataResult);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        // Error is intentionally not shown to the user
        // In a production app, you might want to log this to an error tracking service
        // Error logging can be uncommented if needed
        // console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    const map = L.map(mapContainerRef.current, {
      center: [37.87, -122.27], // Berkeley coordinates
      zoom: 13,
      attributionControl: false // Disable the default attribution control with 'Learn more' button
    });
    
    // Add tile layer with attribution text only (no 'Learn more' button)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' OpenStreetMap contributors'
    }).addTo(map);
    
    // Add custom attribution control without the 'Leaflet' prefix (which contains the 'Learn more' button)
    L.control.attribution({
      prefix: false // This removes the 'Leaflet' text and the associated 'Learn more' button
    }).addTo(map);
    
    // Initialize layer groups with proper TypeScript typing
    const treeLayerGroup = L.layerGroup();
    const sensorLayerGroup = L.layerGroup();
    
    const latestAQData: Record<string, AirQualityObservation> = {};
    
    airQualityData?.forEach((reading: AirQualityObservation) => {
      const paramName = reading.ParameterName;
      if (!latestAQData[paramName] || 
          new Date(reading.DateObserved) > new Date(latestAQData[paramName].DateObserved)) {
        latestAQData[paramName] = reading;
      }
    });
    
    AIR_SENSOR_LOCATIONS.forEach(sensor => {
      const pm25Data = latestAQData['PM2.5'] || { AQI: 51, Category: { Name: 'Moderate' }, DateObserved: new Date().toISOString() };
      
      let markerColor = '#2196F3'; // Default blue
      if (pm25Data.Category.Name === 'Good') {
        markerColor = '#4CAF50'; // Green
      } else if (pm25Data.Category.Name === 'Moderate') {
        markerColor = '#FF9800'; // Orange
      } else if (['Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'].includes(pm25Data.Category.Name)) {
        markerColor = '#F44336'; // Red
      }
      
      const customIcon = L.divIcon({
        html: `
          <div style="
            background: ${markerColor};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.3);
          ">
            ${pm25Data.AQI}
          </div>
        `,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      
      const marker = L.marker([sensor.lat, sensor.lng], { icon: customIcon });
      
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; color: #333;">${sensor.name}</h4>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #666;">PM2.5 AQI:</span>
            <span style="font-weight: 500; color: ${markerColor};">${pm25Data.AQI} (${pm25Data.Category.Name})</span>
          </div>
          <div style="font-size: 11px; color: #888; margin-top: 8px;">
            Updated: ${new Date(pm25Data.DateObserved).toLocaleString()}
          </div>
          ${!sensor.official ? '<div style="color: #f39c12; font-size: 11px; margin-top: 4px;">Community Sensor</div>' : ''}
        </div>
      `);
      
      marker.addTo(sensorLayerGroup);
    });
    
    if (treeData?.features?.length) {
      // Create tree layer with proper TypeScript typing
      const treeLayer = L.geoJSON(treeData, {
        onEachFeature: (feature, layer) => {
          const properties = feature.properties || {};
          layer.bindPopup(`
            <div class="popup-content">
              <h4 class="popup-title">Tree</h4>
              <div class="popup-row">
                <span class="popup-label">Species:</span>
                <span class="popup-value">${properties.species || 'Unknown'}</span>
              </div>
              <div class="popup-row">
                <span class="popup-label">DBH:</span>
                <span class="popup-value">${properties.dbh || 'N/A'}"</span>
              </div>
              <div class="popup-address">
                ${properties.address || 'No address available'}
              </div>
            </div>
          `);
        },
        pointToLayer: (geoJsonPoint, latlng) => {
          // Access feature properties with type safety
          if ('feature' in geoJsonPoint) {
            // Feature properties are available but not used in this context
            // If needed, access properties like this:
            // const featureProps = (geoJsonPoint.feature as GeoJSON.Feature<GeoJSON.Geometry>).properties;
          }
          return L.circleMarker(latlng, {
            radius: 3,
            fillColor: '#2e7d32',
            color: '#1b5e20',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        }
      });
      
      treeLayer.bindPopup((layer: any) => {
        const props = (layer as any).feature?.properties || {};
        return `
          <div class="leaflet-popup-content">
            <h4>Tree</h4>
            <div>
              <strong>Species:</strong> ${props.species || 'Unknown'}
            </div>
            <div>
              <strong>DBH:</strong> ${props.diameter || 'N/A'} inches
            </div>
            <div style="margin-bottom: 4px;">
              <strong>Condition:</strong> ${props.condition || 'Unknown'}
            </div>
            ${props.address ? `<div><strong>Address:</strong> ${props.address}</div>` : ''}
          </div>
        `;
      });
      
      // Add tree layer to the map and store reference
      treeLayerGroup.addTo(map);
      layersRef.current.trees = treeLayerGroup;
    }
    
    sensorLayerGroup.addTo(map);
    layersRef.current.airQuality = sensorLayerGroup;
  }, [treeData, airQualityData]);

  useEffect(() => {
    const map = mapRef.current;
    const layers = layersRef.current;
    
    if (map && layers) {
      // Show/hide layers based on dataType
      if (dataType === 'trees') {
        layers.trees?.addTo(map);
        layers.airQuality?.removeFrom(map);
      } else if (dataType === 'airQuality') {
        layers.airQuality?.addTo(map);
        layers.trees?.removeFrom(map);
      }
    }
  }, [dataType]);

  useEffect(() => {
    const map = mapRef?.current;
    const layers = layersRef.current;
    
    if (map && layers) {
      if (dataType === 'trees') {
        layers.trees?.addTo(map);
        
        if (treeData?.features?.length) {
          map.setView([37.8715, -122.2680], 15);
        }
      } else if (dataType === 'airQuality') {
        layers.airQuality?.addTo(map);
        
        if (AIR_SENSOR_LOCATIONS.length > 0) {
          const lats = AIR_SENSOR_LOCATIONS.map(s => s.lat);
          const lngs = AIR_SENSOR_LOCATIONS.map(s => s.lng);
          const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
          const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
          
          map.setView([centerLat, centerLng], 13);
        }
      }
    }
  }, [dataType, treeData, mapRef, layersRef]);

  // Commenting out unused function to fix TypeScript error
  // const toggleLayer = (layerId: string) => {
  //   setVisibleLayers(prev => 
  //     prev.includes(layerId)
  //       ? prev.filter(id => id !== layerId)
  //       : [...prev, layerId]
  //   );
  // };

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
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
              {showControls ? <ChevronLeft fontSize="small" /> : <MapIcon fontSize="small" />}
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
              <LayersIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ position: 'relative', height: 'calc(100% - 64px)' }}>
        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ m: 2, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000 }}>
            {error}
          </Alert>
        )}
        
        {/* Loading indicator */}
        {loading ? (
          <Box className="loading-container">
            <CircularProgress size={40} />
            <Typography variant="body2" className="loading-message">
              Loading environmental data...
            </Typography>
            <Typography variant="caption" className="loading-caption">
              Processing {treeData?.features?.length ? treeData.features.length.toLocaleString() : '...'} trees
            </Typography>
          </Box>
        ) : (
          <>
            <div 
              ref={mapContainerRef} 
              className="map-container"
            >
              {!mapRef && (
                <Box className="map-loading">
                  <CircularProgress />
                  <Typography variant="body1" className="map-loading-text">
                    Loading map...
                  </Typography>
                </Box>
              )}
            </div>
            
            {/* Layer controls */}
            <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
              <Tooltip title="Toggle layers">
                <IconButton
                  onClick={handleLayersMenuOpen}
                  sx={{ 
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                    boxShadow: 1
                  }}
                >
                  <LayersIcon />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={layersMenuAnchorEl}
                open={isLayersMenuOpen}
                onClose={handleLayersMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => handleLayerToggle('trees')}>
                  <Checkbox checked={visibleLayers.includes('trees')} />
                  <ListItemText primary="Trees" />
                </MenuItem>
                <MenuItem onClick={() => handleLayerToggle('airQuality')}>
                  <Checkbox checked={visibleLayers.includes('airQuality')} />
                  <ListItemText primary="Air Quality Sensors" />
                </MenuItem>
              </Menu>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
