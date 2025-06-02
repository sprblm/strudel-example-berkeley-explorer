/**
 * VisualizationView Component
 * 
 * Main visualization component that renders different types of data visualizations
 * including maps, time series charts, histograms, and distribution plots.
 * Handles data loading, error states, and user interactions for the visualization.
 */

import React, { useState, useEffect, useRef, FC } from 'react';
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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './VisualizationView.css';
import type { AirQualityObservation } from '../../../types/air-quality.interfaces';

interface VisualizationViewProps {
  activeChart: 'timeSeries' | 'map' | 'histogram' | 'distribution';
  onToggleControls: () => void;
  showControls: boolean;
  dataType: 'trees' | 'airQuality';
}

const AIR_SENSOR_LOCATIONS = [
  { id: 1, lat: 37.8712, lng: -122.2687, official: true, name: 'Berkeley - Downtown' },
  { id: 2, lat: 37.8664, lng: -122.2564, official: true, name: 'Berkeley - Campus' },
  { id: 3, lat: 37.8735, lng: -122.2780, official: false, name: 'Berkeley - West' },
  { id: 4, lat: 37.8786, lng: -122.2598, official: false, name: 'Berkeley - North' }
];

export const VisualizationView: FC<VisualizationViewProps> = ({
  onToggleControls,
  showControls,
  dataType
}) => {
  const [visibleLayers, setVisibleLayers] = useState<string[]>(['trees', 'airQuality', 'locations']);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [layersMenuAnchorEl, setLayersMenuAnchorEl] = useState<null | HTMLElement>(null);

  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<{
    trees: L.LayerGroup | null;
    airQuality: L.LayerGroup | null;
    locations: L.LayerGroup | null;
  }>({ trees: null, airQuality: null, locations: null });

  const [treeData, setTreeData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityObservation[] | null>(null);
  const [buildingGeoJsonData, setBuildingGeoJsonData] = useState<GeoJSON.FeatureCollection | null>(null);

  const isLayersMenuOpen = Boolean(layersMenuAnchorEl);

  const handleLayersMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLayersMenuAnchorEl(event.currentTarget);
  };

  const handleLayersMenuClose = () => {
    setLayersMenuAnchorEl(null);
  };

  const handleLayerToggle = (layerId: string) => {
    setVisibleLayers(prev =>
      prev.includes(layerId)
        ? prev.filter(l => l !== layerId)
        : [...prev, layerId]
    );
  };

  // Data Fetching Effect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [treeResponse, airQualityResponse, buildingResponse] = await Promise.all([
          fetch('/data/processed/berkeley_trees_processed.json'),
          fetch('/data/airnow/airnow_94720_400days.json'),
          fetch('/data/processed/berkeley-bldgs.geojson')
        ]);

        if (!treeResponse.ok) throw new Error(`Failed to fetch tree data: ${treeResponse.status}`);
        if (!airQualityResponse.ok) throw new Error(`Failed to fetch air quality data: ${airQualityResponse.status}`);
        if (!buildingResponse.ok) throw new Error(`Failed to fetch building data: ${buildingResponse.status}`);

        const treeDataResult = await treeResponse.json();
        const airQualityDataResult = await airQualityResponse.json();
        const buildingDataResult = await buildingResponse.json();

        setTreeData(treeDataResult);
        setAirQualityData(airQualityDataResult);
        setBuildingGeoJsonData(buildingDataResult);

      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('An unknown error occurred during data fetching.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Map Initialization and Static Layer Setup Effect
  useEffect(() => {
    if (!mapContainerRef.current || !treeData || !airQualityData || !buildingGeoJsonData) return;

    const map = L.map(mapContainerRef.current, {
      center: [37.87, -122.27],
      zoom: 13,
      attributionControl: false,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.control.attribution({ prefix: false }).addTo(map);

    // Create panes
    map.createPane('buildingPane');
    const buildingPane = map.getPane('buildingPane');
    if (buildingPane) buildingPane.style.zIndex = '390';

    map.createPane('treePane');
    const treePane = map.getPane('treePane');
    if (treePane) treePane.style.zIndex = '400';
    
    map.createPane('sensorPane');
    const sensorPane = map.getPane('sensorPane');
    if (sensorPane) sensorPane.style.zIndex = '410';

    // Initialize Layer Groups
    layersRef.current.trees = L.layerGroup([], { pane: 'treePane' });
    layersRef.current.airQuality = L.layerGroup([], { pane: 'sensorPane' });
    layersRef.current.locations = L.layerGroup([], { pane: 'buildingPane' });

    // Process Tree Data & Create Tree Layer
    const treeGeoJsonLayer = L.geoJSON(treeData as GeoJSON.FeatureCollection, {
      pane: 'treePane',
      onEachFeature: (feature, layer) => {
        const props = feature.properties || {};
        layer.bindPopup(`<div class="popup-content"><h4 class="popup-title">Tree</h4><div><strong>Species:</strong> ${props.species || 'Unknown'}</div><div><strong>DBH:</strong> ${props.dbh || 'N/A'}"</div><div>${props.address || 'No address'}</div></div>`);
      },
      pointToLayer: (geoJsonPoint, latlng) => L.circleMarker(latlng, {
        radius: 3, fillColor: '#2e7d32', color: '#1b5e20', weight: 1, opacity: 1, fillOpacity: 0.8,
      }),
    });
    layersRef.current.trees.addLayer(treeGeoJsonLayer);

    // Process Air Quality Data & Create Sensor Markers
    const latestAQData: Record<string, AirQualityObservation> = {};
    airQualityData.forEach((reading) => { // Ensure airQualityData is not null here due to the guard clause above
      const paramName = reading.ParameterName;
      if (!latestAQData[paramName] || new Date(reading.DateObserved) > new Date(latestAQData[paramName].DateObserved)) {
        latestAQData[paramName] = reading;
      }
    });
    AIR_SENSOR_LOCATIONS.forEach(sensor => {
      const pm25Data = latestAQData['PM2.5'] || { AQI: 0, Category: { Name: 'Unknown' }, DateObserved: new Date().toISOString() };
      let markerColor = '#9E9E9E'; // Grey for unknown/default
      if (pm25Data.Category.Name === 'Good') markerColor = '#4CAF50';
      else if (pm25Data.Category.Name === 'Moderate') markerColor = '#FFC107'; // Amber
      else if (['Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'].includes(pm25Data.Category.Name)) markerColor = '#F44336';
      
      const customIcon = L.divIcon({
        html: `<div style="background:${markerColor};width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:12px;border:2px solid white;box-shadow:0 0 5px rgba(0,0,0,0.3);">${pm25Data.AQI}</div>`,
        className: '', iconSize: [24, 24], iconAnchor: [12, 12],
      });
      L.marker([sensor.lat, sensor.lng], { icon: customIcon, pane: 'sensorPane' })
        .bindPopup(`<h4>${sensor.name}</h4><div>PM2.5 AQI: ${pm25Data.AQI} (${pm25Data.Category.Name})</div><small>Updated: ${new Date(pm25Data.DateObserved).toLocaleString()}</small>`)
        .addTo(layersRef.current.airQuality!);
    });

    // Process Building Data & Create Building Layer
    const buildingGeoJsonLayer = L.geoJSON(buildingGeoJsonData as GeoJSON.FeatureCollection, {
      pane: 'buildingPane',
      style: () => ({ fillColor: '#B0B0B0', weight: 1, opacity: 0.7, color: '#606060', fillOpacity: 0.3 }), // Adjusted style
      onEachFeature: (feature, layer) => {
        if (feature.properties?.name) {
          layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
        }
      },
    });
    layersRef.current.locations.addLayer(buildingGeoJsonLayer);
    
    // Initial layer visibility is handled by the next useEffect

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [treeData, airQualityData, buildingGeoJsonData]);

  // Dynamic Layer Visibility Effect
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentLayers = layersRef.current;

    Object.keys(currentLayers).forEach(layerKey => {
      const layerGroup = currentLayers[layerKey as keyof typeof currentLayers];
      if (layerGroup) {
        if (visibleLayers.includes(layerKey)) {
          if (!map.hasLayer(layerGroup)) {
            map.addLayer(layerGroup);
          }
        } else {
          if (map.hasLayer(layerGroup)) {
            map.removeLayer(layerGroup);
          }
        }
      }
    });
  }, [visibleLayers]); // mapRef.current is stable after first render, layersRef.current structure is stable

  // Effect for dataType (e.g., to set initial view or default visible layers if needed)
  useEffect(() => {
    // Example: if dataType changes, you might want to ensure certain layers are visible
    if (dataType === 'trees') {
      // Ensure 'trees' is in visibleLayers, or set a default view
      // setVisibleLayers(prev => prev.includes('trees') ? prev : [...prev, 'trees']);
      // mapRef.current?.setView([37.8715, -122.2680], 15); // Example setView
    } else if (dataType === 'airQuality') {
      // Ensure 'airQuality' is in visibleLayers
      // setVisibleLayers(prev => prev.includes('airQuality') ? prev : [...prev, 'airQuality']);
    }
    // This effect can be expanded or simplified based on how dataType should influence the map
  }, [dataType]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading map data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 2 }}>
        <Alert severity="error">Error loading data: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 1, 
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderBottom: '1px solid #ddd',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000 // Ensure header is above map controls
      }}>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>Berkeley Interactive Map</Typography>
        <Box>
          <Tooltip title="Toggle Data Layers">
            <IconButton onClick={handleLayersMenuOpen} color="primary">
              <LayersIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={showControls ? "Hide Controls" : "Show Controls"}>
            <IconButton onClick={onToggleControls} color="primary">
              <ChevronLeftIcon sx={{ transform: showControls ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}/>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={layersMenuAnchorEl}
            open={isLayersMenuOpen}
            onClose={handleLayersMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => handleLayerToggle('trees')}>
              <Checkbox checked={visibleLayers.includes('trees')} />
              <ListItemText primary="Trees" />
            </MenuItem>
            <MenuItem onClick={() => handleLayerToggle('airQuality')}>
              <Checkbox checked={visibleLayers.includes('airQuality')} />
              <ListItemText primary="Air Quality Sensors" />
            </MenuItem>
            <MenuItem onClick={() => handleLayerToggle('locations')}>
              <Checkbox checked={visibleLayers.includes('locations')} />
              <ListItemText primary="Buildings" />
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      <Box ref={mapContainerRef} sx={{ height: '100%', width: '100%', zIndex: 1 }} />
    </Box>
  );
};
