import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
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

interface BerkeleyDataMapProps {
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
const BerkeleyDataMap: React.FC<BerkeleyDataMapProps> = ({ 
  height = 400,
  width = '100%',
  showControls = true,
  dataPoints,
  onPointClick
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  
  const [visibleLayers, setVisibleLayers] = useState<('tree' | 'air' | 'boundary' | 'locations')[]>(['tree', 'air', 'boundary', 'locations']);
  const [loading, setLoading] = useState(true);
  const [loadedDataPoints, setLoadedDataPoints] = useState<DataPoint[]>([]);
  const [locationsGeoJson, setLocationsGeoJson] = useState<any>(null);
  
  // State for tracking data loading errors
  const [dataError, setDataError] = useState<string | null>(null);
  
  // State for boundary data
  const [boundaryData, setBoundaryData] = useState<any>(null);

  // Load real data when component mounts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setDataError(null);
      
      let treeData = null;
      let airData: AirQualityObservation[] = [];
      let cityBoundary = null;
      
      try {
        // Load locations.geojson (buildings)
        try {
          const locationsResponse = await fetch('./data/locations.geojson');
          if (locationsResponse.ok) {
            const locationsData = await locationsResponse.json();
            setLocationsGeoJson(locationsData);
          }
        } catch (err) {
        }

        // Load Berkeley city boundary
        try {
          const boundaryResponse = await fetch('./data/boundaries/berkeley_city_boundary.json');
          if (!boundaryResponse.ok) {
            throw new Error(`Failed to fetch boundary data: ${boundaryResponse.status}`);
          }
          cityBoundary = await boundaryResponse.json();
          setBoundaryData(cityBoundary);
        } catch (error) {
          // Continue without boundary data
        }
        
        try {
          // Use absolute path from public directory
          const treeResponse = await fetch('./data/processed/berkeley_trees_processed.json');
          if (!treeResponse.ok) {
            throw new Error(`Failed to fetch tree data: ${treeResponse.status}`);
          }
          treeData = await treeResponse.json();
        } catch (error) {
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
          // Continue without air quality data
        }
          
        // Process tree data
        const treePoints: DataPoint[] = treeData && Array.isArray(treeData) ? 
          treeData
            .map((tree: any, index: number) => {
              if (!tree.location || !Array.isArray(tree.location) || tree.location.length < 2) {
                return null;
              }
              
              return {
                id: tree.id || `tree-${index}`,
                type: 'tree' as const,
                lat: tree.location[1], // Latitude is the second element in the location array
                lng: tree.location[0], // Longitude is the first element in the location array
                title: tree.species || 'Unknown Species',
                category: tree.healthCondition || 'Unknown',
                details: {
                  DBHMAX: tree.dbh,
                  HEIGHT: tree.height,
                  SPREAD: tree.spread,
                  OBSERVATIONDATE: tree.observationDate,
                  SOURCE: tree.source,
                  NOTES: tree.notes,
                  LOCATION_TYPE: tree.location_type,
                  IS_BASELINE: tree.isBaseline
                }
              };
            })
            .filter(point => point !== null) as DataPoint[] : [];
        
        // Process air quality data
        const airPoints: DataPoint[] = airData && Array.isArray(airData) && airData.length > 0 ? airData.map((reading: any, index: number) => ({
          id: `air-${index}`,
          type: 'air',
          lat: reading.Latitude,
          lng: reading.Longitude,
          title: `${reading.ParameterName} Sensor`,
          value: reading.AQI,
          category: reading.Category?.Name,
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
      const treeClusterGroup = L.markerClusterGroup({
        chunkedLoading: true, // Helps with large datasets
      });
      const airClusterGroup = L.markerClusterGroup({
  chunkedLoading: true,
});
      const boundaryLayer = L.layerGroup();
      const locationsLayer = L.layerGroup();

      // Add locations polygons if available
      if (locationsGeoJson && locationsGeoJson.features && locationsGeoJson.features.length > 0) {
        try {
          L.geoJSON(locationsGeoJson, {
            style: {
              color: '#8e44ad',
              weight: 2,
              opacity: 0.7,
              fill: true,
              fillColor: '#d2b4de',
              fillOpacity: 0.2
            },
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                // Format all properties as a table
                const props = feature.properties;
                let popupContent = `<div style="max-width:240px;">
                  <h3>${props.name || props["addr:housename"] || "Location"}</h3>
                  <table style='font-size:0.95em;'>`;
                for (const [key, value] of Object.entries(props)) {
                  if (value && key !== 'name') {
                    popupContent += `<tr><td style='font-weight:bold;'>${key}</td><td>${value}</td></tr>`;
                  }
                }
                popupContent += '</table></div>';
                layer.bindPopup(popupContent);
              }
              // Allow onPointClick to work for polygons
              if (onPointClick) {
                layer.on('click', () => {
                  onPointClick({
                    id: feature.id || feature.properties.name || feature.properties["addr:housename"] || "location",
                    type: 'location',
                    lat: Array.isArray(feature.geometry.coordinates[0]) ? feature.geometry.coordinates[0][0][1] : null,
                    lng: Array.isArray(feature.geometry.coordinates[0]) ? feature.geometry.coordinates[0][0][0] : null,
                    title: feature.properties.name || feature.properties["addr:housename"] || "Location",
                    details: feature.properties,
                    geometry: feature.geometry
                  });
                });
              }
            }
          }).addTo(locationsLayer);
        } catch (error) {
        }
      }
      
      // Add city boundary if available
      if (boundaryData && boundaryData.features && boundaryData.features.length > 0) {
        try {
          const boundaryStyle = {
            color: '#3388ff',
            weight: 3,
            opacity: 0.7,
            fill: true,
            fillColor: '#3388ff',
            fillOpacity: 0.1
          };
          
          L.geoJSON(boundaryData, {
            style: boundaryStyle,
            onEachFeature: (feature, layer) => {
              if (feature.properties && feature.properties.name) {
                layer.bindPopup(`<h3>${feature.properties.name}</h3><p>${feature.properties.description || ''}</p>`);
              }
            }
          }).addTo(boundaryLayer);
        } catch (error) {
        }
      }
      
      // Add data points to appropriate layers
      pointsToDisplay.forEach(point => {
        // Determine marker color based on data type and values
        let marker: L.Layer | null = null;
        let popupContent = `
          <div style="max-width: 200px;">
            <h3>${point.title}</h3>
            <p>Condition: ${point.category || 'Unknown'}</p>
            <p>Location: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</p>
            ${point.details?.DBHMAX ? `<p>Diameter: ${point.details.DBHMAX} inches</p>` : ''}
            ${point.details?.HEIGHT ? `<p>Height: ${point.details.HEIGHT} feet</p>` : ''}
            ${point.details?.OBSERVATIONDATE ? `<p>Observed: ${point.details.OBSERVATIONDATE}</p>` : ''}
          </div>
        `;
        
        if (point.type === 'tree') {
          const markerColor = getTreeColor(point.category || 'good');
          const icon = L.divIcon({
            className: 'tree-marker',
            html: `<div style="background:${markerColor};width:22px;height:22px;border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center;">🌳</div>`
          });
          const treeMarker = L.marker([point.lat, point.lng], { icon }).bindPopup(popupContent);
          if (onPointClick) {
            treeMarker.on('click', () => {
              onPointClick(point);
            });
          }
          treeClusterGroup.addLayer(treeMarker);
          markersRef.current[point.id] = treeMarker;
        } else {
          const icon = L.divIcon({
            html: `<div style="background:${getAqiColor(point.value ?? 0)};width:16px;height:16px;border-radius:50%;border:2px solid #000;"></div>`
          });
          marker = L.marker([point.lat, point.lng], { icon });
          marker.bindPopup(popupContent);
          if (onPointClick) {
            marker.on('click', () => {
              onPointClick(point);
            });
          }
          airClusterGroup.addLayer(marker);
          markersRef.current[point.id] = marker;
        }
      });
      
      // Store references
      mapRef.current = map;
      
      // Add layers to map
      treeClusterGroup.addTo(map);
      airClusterGroup.addTo(map);
      boundaryLayer.addTo(map);
      locationsLayer.addTo(map);
      
      // Store layer references
      markersRef.current.layers = {
        tree: treeClusterGroup,
        air: airClusterGroup,
        boundary: boundaryLayer,
        locations: locationsLayer
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
      const { tree, air, boundary, locations } = markersRef.current.layers;
      
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
      
      // Update boundary layer visibility
      if (boundary && visibleLayers.includes('boundary')) {
        boundary.addTo(mapRef.current);
      } else if (boundary) {
        boundary.remove();
      }

      // Update locations layer visibility
      if (locations && visibleLayers.includes('locations')) {
        locations.addTo(mapRef.current);
      } else if (locations) {
        locations.remove();
      }
    }
  }, [visibleLayers]);
    
    // Toggle layer visibility
    const toggleLayer = (layer: 'tree' | 'air' | 'boundary' | 'locations') => {
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
              <Chip 
                label="City Boundary" 
                size="small"
                color={visibleLayers.includes('boundary') ? 'info' : 'default'}
                variant={visibleLayers.includes('boundary') ? 'filled' : 'outlined'}
                onClick={() => toggleLayer('boundary')}
              />
              <Chip 
                label="Locations" 
                size="small"
                color={visibleLayers.includes('locations') ? 'secondary' : 'default'}
                variant={visibleLayers.includes('locations') ? 'filled' : 'outlined'}
                onClick={() => toggleLayer('locations')}
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

export default BerkeleyDataMap;
