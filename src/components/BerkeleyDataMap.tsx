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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [layerData, setLayerData] = useState<any>({ trees: [], airQuality: [] });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mapVisible, setMapVisible] = useState<boolean>(true);

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
        // In a real application, these would fetch data from APIs
        // For now, we'll just set some mock data
        const mockAirQualityData = [
          {
            lat: 37.870, 
            lng: -122.270, 
            value: 42,
            unit: 'AQI',
            timestamp: new Date().toISOString(),
            source: 'EPA',
            pollutant: 'PM2.5'
          },
          {
            lat: 37.867, 
            lng: -122.255, 
            value: 35,
            unit: 'AQI',
            timestamp: new Date().toISOString(),
            source: 'EPA',
            pollutant: 'Ozone'
          }
        ];

        setLayerData({
          airQuality: mockAirQualityData
        });
      } catch (error) {
        // Silent error in production, would log to monitoring service in real app
      }
    };

    loadData();
  }, [visibleLayers]);

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
