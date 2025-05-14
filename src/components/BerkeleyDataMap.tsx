import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import DataLayersToggle from './DataLayersToggle';
import '../lib/leaflet.canvas-markers'; // Import the plugin (ensure path is correct)
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
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
  provider?: string; // Optional provider property for air quality points
}

interface BerkeleyDataMapProps {
  height?: number | string;
  width?: string | number;
  dataPoints?: DataPoint[];
  onPointClick?: (point: DataPoint) => void;
}


/**
 * A Leaflet map component for displaying campus environmental data points
 */
const BerkeleyDataMap: React.FC<BerkeleyDataMapProps> = ({ 
  height = 400,
  width = '100%',
  dataPoints,
  onPointClick
}) => {
  // --- Date filtering state ---
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [loadedDataPoints, setLoadedDataPoints] = useState<DataPoint[]>([]);
  const [locationsGeoJson, setLocationsGeoJson] = useState<any>(null);
  // State for boundary data
  const [boundaryData, setBoundaryData] = useState<any>(null);

  // Data Layers toggle state (no boundary)
  const [visibleLayers, setVisibleLayers] = useState<('tree' | 'air' | 'locations')[]>(['tree', 'air', 'locations']);
  const toggleLayer = (layer: 'tree' | 'air' | 'locations') => {
    setVisibleLayers((prev) =>
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  // Load real data when component mounts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
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
        } catch (err) {}

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
           // Load air quality data (all readings from new processed file)
           const airQualityResponse = await fetch('./data/processed/berkeley_air_quality_all_readings.json');
           if (!airQualityResponse.ok) {
             throw new Error(`Failed to fetch air quality data: ${airQualityResponse.status}`);
           }
           airData = await airQualityResponse.json();
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
        
        // --- Extract available dates from air quality data ---
        let airPoints: DataPoint[] = [];
        const dateSet = new Set<string>();
        if (airData && Array.isArray(airData) && airData.length > 0) {
           // Normalize date property (use datetimeUtc from new data)
           airData.forEach((reading: any) => {
             const dateStr = reading.datetimeUtc ? reading.datetimeUtc.split('T')[0] : null;
             if (dateStr) dateSet.add(dateStr);
           });
           // setAvailableDates removed: availableDates state is no longer used

           // By default, pick the most recent date
           if (!selectedDate && dateSet.size > 0) {
             setSelectedDate(Array.from(dateSet).sort().reverse()[0]);
           }

           // Show latest reading per station (location_id+parameter) for the selected date (or most recent date by default)
           // For each meter (location_id), gather the latest reading for each parameter
           const latestByMeter: Record<string, { location: any; readings: any[] }> = {};
           const latestParamByMeter: Record<string, Record<string, any>> = {};
           airData.forEach((reading: any) => {
             if (!reading.location_id || !reading.parameter || !reading.datetimeUtc) return;
             if (!latestParamByMeter[reading.location_id]) {
               latestParamByMeter[reading.location_id] = {};
             }
             const prev = latestParamByMeter[reading.location_id][reading.parameter];
             if (!prev || new Date(reading.datetimeUtc) > new Date(prev.datetimeUtc)) {
               latestParamByMeter[reading.location_id][reading.parameter] = reading;
             }
           });
           Object.values(latestParamByMeter).forEach((paramMap) => {
             const readings = Object.values(paramMap);
             if (readings.length > 0) {
               // Use the latest reading (by datetime) for marker location and metadata
               const latestReading = readings.reduce((a: any, b: any) => new Date(a.datetimeUtc) > new Date(b.datetimeUtc) ? a : b);
               latestByMeter[latestReading.location_id] = {
                 location: latestReading,
                 readings
               };
             }
           });
           airPoints = Object.entries(latestByMeter).map(([location_id, { location, readings }]: any) => ({
             id: `air-${location_id}`,
             type: 'air',
             lat: location.latitude,
             lng: location.longitude,
             title: location.location_name,
             provider: location.provider,
             details: {
               readings,
               provider: location.provider,
               location_name: location.location_name
             }
           }));
        }
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
          // eslint-disable-next-line no-console
          console.log('Using sample data for demonstration. Real data files not found.');
        }
        
        setLoadedDataPoints(combinedDataPoints);
      } catch (error) { 
        // eslint-disable-next-line no-console
        console.error(`Failed to load data: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Helper to filter points within bounds
  const filterPointsInBounds = (points: DataPoint[], bounds: L.LatLngBounds) =>
    points.filter(pt => bounds.contains([pt.lat, pt.lng]));

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || loading) return;
    const pointsToDisplay = dataPoints || loadedDataPoints;
    if (!pointsToDisplay || pointsToDisplay.length === 0) return;

    const map = L.map(mapContainerRef.current as HTMLElement).setView([37.8715, -122.2680], 15);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    const boundaryLayer = L.layerGroup();
    const locationsLayer = L.layerGroup();

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
              const props = feature.properties;
              let popupContent = `<div style="max-width:240px;">
  <h3>${props.name || props["addr:housename"] || "Location"}</h3>
  <table style='font-size:0.95em;'>`;
              Object.entries(props).forEach(([key, value]) => {
                if (value && key !== 'name') {
                  popupContent += `<tr><td style='font-weight:bold;'>${key}</td><td>${value}</td></tr>`;
                }
              });
              popupContent += '</table></div>';
              layer.bindPopup(popupContent);
            }
            if (onPointClick) {
              layer.on('click', () => {
                let lat: number | null = null;
                let lng: number | null = null;
                if (
                  feature.geometry && feature.geometry.type === 'Polygon' &&
                  Array.isArray(feature.geometry.coordinates) &&
                  Array.isArray(feature.geometry.coordinates[0]) &&
                  Array.isArray(feature.geometry.coordinates[0][0]) &&
                  typeof feature.geometry.coordinates[0][0][1] === 'number' &&
                  typeof feature.geometry.coordinates[0][0][0] === 'number'
                ) {
                  lat = feature.geometry.coordinates[0][0][1];
                  lng = feature.geometry.coordinates[0][0][0];
                } else if (
                  feature.geometry && feature.geometry.type === 'MultiPolygon' &&
                  Array.isArray(feature.geometry.coordinates) &&
                  Array.isArray(feature.geometry.coordinates[0]) &&
                  Array.isArray(feature.geometry.coordinates[0][0]) &&
                  Array.isArray(feature.geometry.coordinates[0][0][0]) &&
                  typeof feature.geometry.coordinates[0][0][0][1] === 'number' &&
                  typeof feature.geometry.coordinates[0][0][0][0] === 'number'
                ) {
                  lat = feature.geometry.coordinates[0][0][0][1];
                  lng = feature.geometry.coordinates[0][0][0][0];
                }
                if (lat !== null && lng !== null) {
                  onPointClick({
                    id: feature.id || feature.properties.name || feature.properties["addr:housename"] || "location",
                    type: 'tree',
                    lat,
                    lng,
                    title: feature.properties.name || feature.properties["addr:housename"] || "Location",
                    details: feature.properties
                  });
                }
              });
            }
          }
        }).addTo(locationsLayer);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to load locations data: ${error}`);
      }
    }

    if (boundaryData && boundaryData.features && boundaryData.features.length > 0) {
      try {
        const boundaryStyle = {
          color: '#3388ff',
          weight: 3,
          opacity: 0.7,
          fill: true,
          fillColor: '#3388ff',
          fillOpacity: 0.1,
        };

        L.geoJSON(boundaryData, {
          style: boundaryStyle,
          onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.name) {
              layer.bindPopup(`<h3>${feature.properties.name}</h3><p>${feature.properties.description || ''}</p>`);
            }
          },
        }).addTo(boundaryLayer);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to load boundary data: ${error}`);
      }
    }

    const canvasTreeLayer = (L as any).canvasIconLayer ? (L as any).canvasIconLayer({}) : null;
    const canvasAirLayer = (L as any).canvasIconLayer ? (L as any).canvasIconLayer({}) : null;
    markersRef.current.canvasLayers = { tree: canvasTreeLayer, air: canvasAirLayer };
    
    // Add the canvas layers to the map BEFORE performing any operations on them
    // Add canvas layers to map if their layer is enabled
    if (canvasTreeLayer && visibleLayers.includes('tree')) canvasTreeLayer.addTo(map);
    if (canvasAirLayer && visibleLayers.includes('air')) canvasAirLayer.addTo(map);
    if (locationsLayer && visibleLayers.includes('locations')) locationsLayer.addTo(map);

    const renderVisibleMarkers = () => {
      if (!map) return;
      const bounds = map.getBounds();
      const visiblePoints = filterPointsInBounds(pointsToDisplay, bounds);
      if (canvasTreeLayer) canvasTreeLayer.clearLayers();
      if (canvasAirLayer) canvasAirLayer.clearLayers();
      visiblePoints.forEach((point: DataPoint) => {
        let marker: any = null;
        const popupContent = `
          <div style="max-width: 200px;">
            <h3>${point.title}</h3>
            <p>Condition: ${point.category || 'Unknown'}</p>
            <p>Location: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</p>
            ${point.details?.DBHMAX ? `<p>DBH: ${point.details.DBHMAX} in</p>` : ''}
            ${point.details?.HEIGHT ? `<p>Height: ${point.details.HEIGHT} feet</p>` : ''}
            <!-- Air Quality Meter Popup -->
            ${point.type === 'air' && point.details && point.details.readings ? `
              <div style="max-width:260px;">
                <h3 style="margin-bottom:0.3em;">${point.title}</h3>
                <div style="color:#666;font-size:0.95em;margin-bottom:0.5em;">
                  Provider: <strong>${point.provider || (point.details.provider ?? '')}</strong>
                </div>
                <table style="width:100%;font-size:0.97em;margin-bottom:0.5em;">
                  <thead>
                    <tr><th align="left">Parameter</th><th align="right">Value</th><th align="left">Unit</th></tr>
                  </thead>
                  <tbody>
                    ${point.details.readings.map((r: any) => `
                      <tr>
                        <td>${r.parameter?.toUpperCase?.() || r.parameter}</td>
                        <td align="right">${r.value}</td>
                        <td>${r.unit || ''}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                ${point.details.readings[0]?.datetimeUtc ? `<div style="font-size:0.9em;color:#888;">Latest: ${new Date(point.details.readings[0].datetimeUtc).toLocaleString()}</div>` : ''}
              </div>` :
            // Tree popup fallback
            `${point.details?.OBSERVATIONDATE ? `<p>Observed: ${point.details.OBSERVATIONDATE}</p>` : ''}
            </div>`}
          </div>
        `;

        if (point.type === 'tree') {
          const icon = L.icon({
            iconUrl: '/icons/tree.svg',
            iconSize: [22, 22],
            iconAnchor: [11, 22], // bottom center
            popupAnchor: [0, -22]
          });
          marker = L.marker([point.lat, point.lng], { icon });
        } else {
          const icon = L.icon({
            iconUrl: '/icons/air.svg',
            iconSize: [16, 16],
            iconAnchor: [8, 16], // bottom center
            popupAnchor: [0, -16]
          });
          marker = L.marker([point.lat, point.lng], { icon });
        }
        marker.bindPopup(popupContent);
        if (onPointClick) {
          marker.on('click', () => onPointClick(point));
        }
        if (point.type === 'tree' && canvasTreeLayer && visibleLayers.includes('tree')) {
          canvasTreeLayer.addLayer(marker);
          markersRef.current[point.id] = marker;
        } else if (point.type === 'air' && canvasAirLayer && visibleLayers.includes('air')) {
          canvasAirLayer.addLayer(marker);
          markersRef.current[point.id] = marker;
        }
      });
    };

    // Now it's safe to call renderVisibleMarkers since the layers have been added to the map
    renderVisibleMarkers();
    
    map.on('moveend zoomend', renderVisibleMarkers);

    // Clean up: remove layers from map on unmount
    return () => {
      map.off('moveend zoomend', renderVisibleMarkers);
      if (canvasTreeLayer) canvasTreeLayer.remove();
      if (canvasAirLayer) canvasAirLayer.remove();
      if (locationsLayer) locationsLayer.remove();
    };
  }, [dataPoints, loadedDataPoints, loading, onPointClick, visibleLayers]);

  return (
    <Box sx={{ position: 'relative', width, height }}>
      {/* Data Layers Toggle UI (upper right, extracted) */}
      <DataLayersToggle visibleLayers={visibleLayers} toggleLayer={toggleLayer} />

      {loading && (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
          <CircularProgress />
        </Box>
      )}
      <div ref={mapContainerRef} style={{ width: '100%', height: typeof height === 'number' ? `${height}px` : height, minHeight: 300, borderRadius: 8, overflow: 'hidden' }} />
    </Box>
  );
};

export default BerkeleyDataMap;
