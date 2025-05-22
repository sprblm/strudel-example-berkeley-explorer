import React, { useState, useEffect, Suspense, useMemo } from 'react';
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
import { ScatterplotLayer } from '@deck.gl/layers';

const MapContainer = React.lazy(() => import('./BerkeleyDataMap/MapContainer'));

interface BaseDataPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  category?: string;
  details?: Record<string, any>;
}

interface TreeDataPoint extends BaseDataPoint {
  type: 'tree';
  health?: 'Good' | 'Fair' | 'Poor';
}

interface AirQualityDataPoint extends BaseDataPoint {
  type: 'air';
  value: number;
  unit: string;
  timestamp: string;
}

type DataPoint = TreeDataPoint | AirQualityDataPoint;

interface BerkeleyDataMapProps {
  height?: number | string;
  width?: string | number;
  onPointClick?: (point: DataPoint) => void;
}

/**
 * A Mapbox GL JS map component for displaying campus environmental data points
 * using vector tiles for better performance with large datasets
 */
const BerkeleyDataMap: React.FC<BerkeleyDataMapProps> = ({ 
  height = 400,
  width = '100%',
  onPointClick
}) => {
  const [mapVisible, setMapVisible] = useState<boolean>(false);
  const mapPlaceholderRef = React.useRef<HTMLDivElement | null>(null);

  // Data Layers toggle state
  const [visibleLayers, setVisibleLayers] = useState<('tree' | 'air' | 'locations')[]>(['tree', 'air', 'locations']);
  
  const toggleLayer = (layer: 'tree' | 'air' | 'locations') => {
    setVisibleLayers((prev) =>
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  // IntersectionObserver to trigger map load
  useEffect(() => {
    if (mapVisible) return;
    
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
    }
    
    return () => {
      if (mapPlaceholderRef.current) {
        observer.unobserve(mapPlaceholderRef.current);
      }
    };
  }, [mapVisible]);


  // Calculate dynamic dimensions
  const containerHeight = typeof height === 'number' ? `${height}px` : height;
  const containerWidth = typeof width === 'number' ? `${width}px` : width;

  // State for layer data
  const [layerData, setLayerData] = useState<{
    trees: TreeDataPoint[];
    airQuality: AirQualityDataPoint[];
  }>({ trees: [], airQuality: [] });

  // Load layer data
  useEffect(() => {
    const loadData = async () => {
      try {
        if (visibleLayers.includes('tree')) {
          // Load tree data from local JSON file
          const response = await fetch('/data/processed/berkeley_trees_processed.json');
          if (!response.ok) throw new Error('Failed to load tree data');
          const data = await response.json();
          setLayerData(prev => ({ ...prev, trees: data }));
        }
        if (visibleLayers.includes('air')) {
          // Load air quality data from local JSON file
          const response = await fetch('/data/airnow/airnow_94720_400days.json');
          if (!response.ok) throw new Error('Failed to load air quality data');
          const data = await response.json();
          setLayerData(prev => ({ ...prev, airQuality: data }));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading layer data:', error);
      }
    };

    loadData();
  }, [visibleLayers]);

  // Generate layers based on visibility
  const layers = useMemo(() => {
    const resultLayers: any[] = [];
    
    if (visibleLayers.includes('tree') && layerData.trees.length > 0) {
      resultLayers.push(
        new ScatterplotLayer({
          id: 'trees-layer',
          data: layerData.trees,
          getPosition: (d: any) => [d.lng, d.lat],
          getRadius: 5,
          getFillColor: (d: any) => {
            switch (d.health) {
              case 'Good': return [76, 175, 80];
              case 'Fair': return [255, 193, 7];
              case 'Poor': return [244, 67, 54];
              default: return [158, 158, 158];
            }
          },
          getLineColor: [255, 255, 255],
          getLineWidth: 1,
          opacity: 0.8,
          pickable: true,
          onHover: (info: any) => {
            // Handle hover if needed
          },
          onClick: (info: any) => {
            if (onPointClick && info.object) {
              const { object } = info;
              const treePoint: TreeDataPoint = {
                id: object.id || `tree-${Date.now()}`,
                type: 'tree',
                lat: object.lat,
                lng: object.lng,
                title: object.common_name || 'Tree',
                category: object.scientific_name || 'Unknown species',
                health: object.health,
                details: object
              };
              onPointClick(treePoint);
            }
          }
        })
      );
    }

    if (visibleLayers.includes('air') && layerData.airQuality.length > 0) {
      resultLayers.push(
        new ScatterplotLayer({
          id: 'air-layer',
          data: layerData.airQuality as AirQualityDataPoint[],
          getPosition: (d: any) => [d.lng, d.lat],
          getRadius: 6,
          getFillColor: (d: any) => {
            // Map AQI values to colors
            // Good (0-50): Green
            // Moderate (51-100): Yellow
            // Unhealthy for Sensitive Groups (101-150): Orange
            // Unhealthy (151-200): Red
            // Very Unhealthy (201-300): Purple
            // Hazardous (301+): Maroon
            const aqi = d.value;
            if (aqi <= 50) return [76, 175, 80]; // Green
            if (aqi <= 100) return [255, 235, 59]; // Yellow
            if (aqi <= 150) return [255, 152, 0]; // Orange
            if (aqi <= 200) return [244, 67, 54]; // Red
            if (aqi <= 300) return [156, 39, 176]; // Purple
            return [136, 14, 79]; // Maroon
          },
          getLineColor: [255, 255, 255],
          getLineWidth: 1,
          opacity: 0.8,
          pickable: true,
          onHover: (info: any) => {
            // Handle hover if needed
          },
          onClick: (info: any) => {
            if (onPointClick && info.object) {
              const { object } = info;
              const airPoint: AirQualityDataPoint = {
                id: object.id || `air-${Date.now()}`,
                type: 'air',
                lat: object.lat,
                lng: object.lng,
                title: 'Air Quality',
                category: object.category || 'Unknown',
                value: object.value,
                unit: object.unit || 'AQI',
                timestamp: object.timestamp || new Date().toISOString(),
                details: object
              };
              onPointClick(airPoint);
            }
          }
        })
      );
    }

    return resultLayers;
  }, [visibleLayers, layerData, onPointClick]);

  // Render map placeholder while loading
  if (!mapVisible) {
    return (
      <Box sx={mapContainerSx}>
        <Box sx={mapPlaceholderSx}>
          <Box sx={loadingContainerSx}>
            <CircularProgress />
            <Typography sx={loadingTextSx}>
              Loading map...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={mapContainerSx} style={{ height: containerHeight, width: containerWidth }}>
      <Suspense 
        fallback={
          <Box sx={mapPlaceholderSx} style={{ height: containerHeight, width: containerWidth }}>
            <Box sx={loadingContainerSx}>
              <CircularProgress />
              <Typography sx={loadingTextSx}>
                Loading map data...
              </Typography>
            </Box>
          </Box>
        }
      >
        <MapContainer 
          height={containerHeight}
          width={containerWidth}
          layers={layers || []}
        />
      </Suspense>
      
      <DataLayersToggle 
        visibleLayers={visibleLayers}
        toggleLayer={toggleLayer}
      />
    </Box>
  );
};

export default BerkeleyDataMap;
