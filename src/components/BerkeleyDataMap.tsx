import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import DataLayersToggle from './DataLayersToggle';
import MapContainer from './BerkeleyDataMap/MapContainer';
import TreeLayer from './BerkeleyDataMap/TreeLayer';
import AirQualityLayer from './BerkeleyDataMap/AirQualityLayer';
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
}


/**
 * A Leaflet map component for displaying campus environmental data points
 */
const BerkeleyDataMap: React.FC<BerkeleyDataMapProps> = ({ 
  height = 400,
  width = '100%'
}) => {
  // --- Date filtering state ---
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadedDataPoints, setLoadedDataPoints] = useState<DataPoint[]>([]);
  const [_locationsGeoJson, setLocationsGeoJson] = useState<any>(null);
  const [_boundaryData, setBoundaryData] = useState<any>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

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
        } catch (err) {
          // Optional: locations.geojson not required, continue if missing
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



  // --- Map, marker, and layer logic is now handled by MapContainer and subcomponents ---

  return (
    <Box sx={{ position: 'relative', width, height }}>
      {/* Data Layers Toggle UI (upper right, extracted) */}
      <DataLayersToggle visibleLayers={visibleLayers} toggleLayer={toggleLayer} />

      {loading && (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
          <CircularProgress />
        </Box>
      )}
      <MapContainer
        height={height}
        width={width}
        onMapReady={setMapInstance}
      >
        {/* Only render layers if map is ready and data loaded */}
        {mapInstance && visibleLayers.includes('tree') && (
          <TreeLayer map={mapInstance} data={loadedDataPoints.filter(p => p.type === 'tree')} visible={visibleLayers.includes('tree')} />
        )}
        {mapInstance && visibleLayers.includes('air') && (
          <AirQualityLayer map={mapInstance} data={loadedDataPoints.filter(p => p.type === 'air')} visible={visibleLayers.includes('air')} />
        )}
        {/* TODO: Add locations and boundary overlays as new subcomponents */}
      </MapContainer>
    </Box>
  );
};

export default BerkeleyDataMap;
