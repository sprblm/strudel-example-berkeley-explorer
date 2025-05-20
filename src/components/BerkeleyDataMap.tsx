import React, { useState, useEffect, Suspense } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import DataLayersToggle from './DataLayersToggle';
import { TreeLayer } from './BerkeleyDataMap/TreeLayer';
import { AirQualityLayer } from './BerkeleyDataMap/AirQualityLayer';
import { LocationsLayer } from './BerkeleyDataMap/LocationsLayer';
import type { AirQualityObservation } from '../types/air-quality.interfaces';

import { getCachedTrees, setCachedTrees, getCachedAirQuality, setCachedAirQuality } from '../utils/dexieCache';

const MapContainer = React.lazy(() => import('./BerkeleyDataMap/MapContainer'));

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

  const [loadedDataPoints, setLoadedDataPoints] = useState<DataPoint[]>([]);
  const [locationsGeoJson, setLocationsGeoJson] = useState<GeoJSON.FeatureCollection | null>(null);
  // No more mapInstance needed for deck.gl
  const [mapVisible, setMapVisible] = useState<boolean>(false);
  const mapPlaceholderRef = React.useRef<HTMLDivElement | null>(null);

  // Data Layers toggle state (no boundary)
  const [visibleLayers, setVisibleLayers] = useState<('tree' | 'air' | 'locations')[]>(['tree', 'air', 'locations']);
  const toggleLayer = (layer: 'tree' | 'air' | 'locations') => {
    setVisibleLayers((prev) =>
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  // IntersectionObserver to trigger map/data load
  useEffect(() => {
    if (mapVisible) return; // Only observe if not visible
    const observer = new window.IntersectionObserver(
      (entries) => {

        if (entries[0].isIntersecting) {

          setMapVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (mapPlaceholderRef.current) {
      observer.observe(mapPlaceholderRef.current);

    } else {
      // mapPlaceholderRef.current is null
    }
    return () => {
      if (mapPlaceholderRef.current) {
        observer.unobserve(mapPlaceholderRef.current);
      }
    };
  }, [mapVisible]);

  // Lazy load data only when mapVisible
  useEffect(() => {
    const loadData = async () => {
      let treeData = null;
      let airData: AirQualityObservation[] = [];
      let treePoints: DataPoint[] = [];
      let airPoints: DataPoint[] = [];
      let dateSet = new Set<string>();
      let combinedDataPoints: DataPoint[] = [];

      try {
        // Load locations.geojson (building outlines)
        const locationsResponse = await fetch('./data/locations.geojson');
        if (locationsResponse.ok) {
          const geojson = await locationsResponse.json();
          setLocationsGeoJson(geojson);
        }

        // Load Berkeley city boundary
        const boundaryResponse = await fetch('./data/boundaries/berkeley_city_boundary.json');
        if (!boundaryResponse.ok) {
          throw new Error(`Failed to fetch boundary data: ${boundaryResponse.status}`);
        }

        // Try cache first for trees
        const cachedTrees = await getCachedTrees();
        if (cachedTrees && cachedTrees.data) {
          treeData = cachedTrees.data;
        } else {
          try {
            const treeResponse = await fetch('./data/processed/berkeley_trees_processed.json');
            if (!treeResponse.ok) {
              throw new Error(`Failed to fetch tree data: ${treeResponse.status}`);
            }
            treeData = await treeResponse.json();
            await setCachedTrees(treeData);
          } catch (error) {
            // Continue without tree data
          }
        }

        // Try cache first for air quality
        const cachedAir = await getCachedAirQuality();
        if (cachedAir && cachedAir.data) {
          airData = cachedAir.data;
        } else {
          try {
            const airQualityResponse = await fetch('./data/processed/berkeley_air_quality_all_readings.json');
            if (!airQualityResponse.ok) {
              throw new Error(`Failed to fetch air quality data: ${airQualityResponse.status}`);
            }
            airData = await airQualityResponse.json();
            await setCachedAirQuality(airData);
          } catch (error) {
            // Continue without air quality data
          }
        }

        // Process tree data
        treePoints = treeData && Array.isArray(treeData) ? 
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
        if (airData && Array.isArray(airData) && airData.length > 0) {
           // Normalize date property (use datetimeUtc from new data)
           airData.forEach((reading: any) => {
             const dateStr = reading.datetimeUtc ? reading.datetimeUtc.split('T')[0] : null;
             if (dateStr) dateSet.add(dateStr);
           });

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
             type: 'air' as const,
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
        combinedDataPoints = [...treePoints, ...airPoints];
        if (combinedDataPoints.length === 0) {
          combinedDataPoints = [
            ...Array(20).fill(0).map((_, index) => ({
              id: `sample-tree-${index}`,
              type: 'tree' as const,
              lat: 37.8715 + (Math.random() * 0.02 - 0.01),
              lng: -122.2680 + (Math.random() * 0.02 - 0.01),
              title: `Sample Tree ${index + 1}`,
              category: ['Good', 'Fair', 'Poor'][Math.floor(Math.random() * 3)],
              details: { DBHMAX: Math.floor(Math.random() * 30) + 5 }
            })),
            ...Array(5).fill(0).map((_, index) => ({
              id: `sample-air-${index}`,
              type: 'air' as const,
              lat: 37.8715 + (Math.random() * 0.02 - 0.01),
              lng: -122.2680 + (Math.random() * 0.02 - 0.01),
              title: `Sample ${['PM2.5', 'Ozone'][index % 2]} Sensor`,
              value: Math.floor(Math.random() * 150) + 10,
              category: 'Moderate',
              details: { DateObserved: new Date().toISOString().split('T')[0] }
            }))
          ];
          // eslint-disable-next-line no-console
          console.log('Using sample data for demonstration. Real data files not found.');
        }
        setLoadedDataPoints(combinedDataPoints);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [mapVisible]);

  return (
    <Box sx={{ position: 'relative', width, height }}>
      {/* Data Layers Toggle UI (upper right, extracted) */}
      <DataLayersToggle visibleLayers={visibleLayers} toggleLayer={toggleLayer} />
      {/* Lazy load map and data only when visible */}
      {!mapVisible && (
        <div ref={mapPlaceholderRef} style={{ width: '100%', height: typeof height === 'number' ? `${height}px` : height, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
          <CircularProgress />
        </div>
      )}
      {mapVisible && (
        <Suspense fallback={<Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}><CircularProgress /></Box>}>
          <MapContainer
            height={height}
            width={width}
            layers={[
              TreeLayer({ data: loadedDataPoints.filter(p => p.type === 'tree').slice(0, 100), visible: visibleLayers.includes('tree') }),
              AirQualityLayer({ data: loadedDataPoints.filter(p => p.type === 'air').slice(0, 100), visible: visibleLayers.includes('air') }),
              LocationsLayer({ data: locationsGeoJson || { type: 'FeatureCollection', features: [] }, visible: visibleLayers.includes('locations') })
            ].filter(Boolean)}
          />
        </Suspense>
      )}
    </Box>
  );

            TreeLayer({ data: loadedDataPoints.filter(p => p.type === 'tree').slice(0, 100), visible: visibleLayers.includes('tree') }),
            AirQualityLayer({ data: loadedDataPoints.filter(p => p.type === 'air').slice(0, 100), visible: visibleLayers.includes('air') }),
            LocationsLayer({ data: locationsGeoJson || { type: 'FeatureCollection', features: [] }, visible: visibleLayers.includes('locations') })
          ].filter(Boolean)}
        />
      </Suspense>
    )}
  </Box>
);

export default BerkeleyDataMap;
