import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { 
  mapContainerSx, 
  mapPlaceholderSx, 
  loadingContainerSx, 
  loadingTextSx 
} from './BerkeleyDataMap/BerkeleyDataMap.styles';
import DataLayersToggle from './DataLayersToggle';

const MapContainer = React.lazy(() => import('./BerkeleyDataMap/MapContainer'));

interface BaseDataPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
}

interface TreeDataPoint extends BaseDataPoint {
  type: 'tree';
  category: string;
  health?: string;
  details: any;
}

interface AirQualityDataPoint extends BaseDataPoint {
  type: 'air';
  value: number;
  unit: string;
  timestamp: string;
  details: any;
}

type DataPoint = TreeDataPoint | AirQualityDataPoint;

interface BerkeleyDataMapProps {
  height?: number | string;
  width?: number | string;
  onPointClick?: (point: DataPoint) => void;
}

/**
 * BerkeleyDataMap Component
 * 
 * Displays a map of Berkeley with environmental data layers
 * including trees and air quality monitoring stations
 */
const BerkeleyDataMap: React.FC<BerkeleyDataMapProps> = ({ height = 400, width = '100%', onPointClick }) => {
  const [visibleLayers, setVisibleLayers] = useState<('tree' | 'air' | 'locations')[]>(['tree', 'air', 'locations']);
  const [layerData, setLayerData] = useState<any>({ trees: null, airQuality: [], buildings: null });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mapVisible, setMapVisible] = useState<boolean>(true);

  // Define the structure of raw tree data items for clarity
  interface RawTreeDataItem {
    location: [number, number];
    id: string;
    species: string;
    healthCondition?: string;
    dbh?: string | number;
    observationDate?: string;
    source?: string;
    // Add other properties from your JSON file as needed
  }

  /**
   * Toggle visibility of a specific data layer
   */
  const toggleLayer = (layerName: 'tree' | 'air' | 'locations') => {
    setVisibleLayers(prev => {
      if (prev.includes(layerName)) {
        return prev.filter(layer => layer !== layerName);
      } else {
        return [...prev, layerName];
      }
    });
  };

  /**
   * Get air quality color based on AQI value
   * Currently unused but kept for future implementation
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getAqiColor = (aqi: number): string => {
    if (aqi <= 50) return '#00E400'; // Good
    if (aqi <= 100) return '#FFFF00'; // Moderate
    if (aqi <= 150) return '#FF7E00'; // Unhealthy for Sensitive Groups
    if (aqi <= 200) return '#FF0000'; // Unhealthy
    if (aqi <= 300) return '#8F3F97'; // Very Unhealthy
    return '#7E0023'; // Hazardous
  };

  // Load environmental data
  useEffect(() => {
    const loadData = async () => {
      try {
        // --- Process Tree Data ---
        // Fetch tree data from the public directory
        const treeResponse = await fetch('/data/processed/berkeley_trees_processed.json');
        if (!treeResponse.ok) {
          // console.error("Failed to fetch tree data:", treeResponse.status, treeResponse.statusText);
          throw new Error(`HTTP error! status: ${treeResponse.status} while fetching /data/processed/berkeley_trees_processed.json`);
        }
        const fetchedBerkeleyTreesRawData = await treeResponse.json() as RawTreeDataItem[];

        const treeFeatures = fetchedBerkeleyTreesRawData.map(tree => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: tree.location // Assuming tree.location is [longitude, latitude]
          },
          properties: {
            id: tree.id, // Use the existing ID from the data
            species: tree.species,
            healthCondition: tree.healthCondition,
            dbh: tree.dbh,
            observationDate: tree.observationDate,
            source: tree.source,
            // Add any other properties from the raw data you want in the GeoJSON
          }
        }));

        const treesGeoJSON = {
          type: 'FeatureCollection' as const,
          features: treeFeatures
        };
        // --- End Process Tree Data ---

        // --- Process Building Data ---
        let buildingsGeoJSON = null;
        try {
          const buildingResponse = await fetch('/data/processed/berkeley-bldgs.geojson');
          if (buildingResponse.ok) {
            buildingsGeoJSON = await buildingResponse.json();
          } else {
            // console.error("Failed to fetch building data:", buildingResponse.status, buildingResponse.statusText);
          }
        } catch (buildingError) {
          // console.error("Error loading building data:", buildingError);
        }
        // --- End Process Building Data ---

        // Mock Air Quality Data (as before)
        const mockAirQualityData = [
          {
            id: 'air-1',
            lat: 37.870, 
            lng: -122.270, 
            value: 42,
            unit: 'AQI',
            timestamp: new Date().toISOString(),
            source: 'EPA',
            pollutant: 'PM2.5'
          },
          {
            id: 'air-2',
            lat: 37.867, 
            lng: -122.255, 
            value: 35,
            unit: 'AQI',
            timestamp: new Date().toISOString(),
            source: 'EPA',
            pollutant: 'Ozone'
          },
          {
            id: 'air-3',
            lat: 37.862,
            lng: -122.265,
            value: 28,
            unit: 'AQI',
            timestamp: new Date().toISOString(),
            source: 'EPA',
            pollutant: 'NO2'
          }
        ];

        setLayerData({
          trees: treesGeoJSON, // Set the processed GeoJSON tree data
          airQuality: mockAirQualityData,
          buildings: buildingsGeoJSON
        });
      } catch (error) {
        // console.error("Error loading or processing data:", error); // Log errors
      }
    };

    loadData();
  }, []); // Load data once on mount

  // Handle map interaction for tree data
  const handleMapClick = useCallback((info: any) => {
    if (info.object && info.object.properties) {
      const properties = info.object.properties;
      const coordinates = info.object.coordinates;
      
      if (onPointClick) {
        onPointClick({
          id: properties.id || `tree-${Math.random().toString(36).slice(2, 9)}`,
          type: 'tree' as const,
          lat: coordinates?.lat || 0,
          lng: coordinates?.lng || 0,
          title: 'Tree',
          category: properties.species || 'Unknown',
          health: properties.health,
          details: properties
        });
      }
    }
  }, [onPointClick]);

  // Render the map container
  return (
    <Box sx={{
      ...mapContainerSx,
      height,
      width,
      position: 'relative'
    }}>
      {mapVisible ? (
        <Suspense fallback={
          <Box sx={loadingContainerSx}>
            <CircularProgress />
            <Typography sx={loadingTextSx}>Loading Map...</Typography>
          </Box>
        }>
          <MapContainer
            height={height}
            width={width}
            onClick={handleMapClick}
            treeData={layerData.trees} // Pass the loaded GeoJSON tree data
            treeVisibility={visibleLayers.includes('tree')} // Pass the visibility state for trees
            airQualityData={layerData.airQuality} // Pass the air quality data
            airQualityVisibility={visibleLayers.includes('air')} // Pass the visibility state for air quality
            buildingData={layerData.buildings} // Pass the building data
            buildingVisibility={visibleLayers.includes('locations')} // Pass the visibility state for buildings
          />
        </Suspense>
      ) : (
        <Box sx={mapPlaceholderSx}>
          <Typography>Map disabled. Enable by selecting at least one data layer.</Typography>
        </Box>
      )}
      
      <DataLayersToggle
            visibleLayers={visibleLayers}
            onToggle={toggleLayer}
        />
    </Box>
  );
};

export default BerkeleyDataMap;
