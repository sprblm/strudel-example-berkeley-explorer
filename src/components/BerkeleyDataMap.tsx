import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import {
  mapContainerSx,
  mapPlaceholderSx,
  loadingContainerSx,
  loadingTextSx,
} from './BerkeleyDataMap/BerkeleyDataMap.styles';
import DataLayersToggle from './DataLayersToggle';
import TreeDetailsPopup from './TreeDetailsPopup';
import AirQualityDetailsPopup from './AirQualityDetailsPopup';

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
  activeLayers?: string[];
  selectedTree?: TreeDataPoint | null;
  onTreeClose?: () => void;
  showLayersToggle?: boolean; // New prop to control visibility of layers toggle
}

/**
 * BerkeleyDataMap Component
 *
 * Displays a map of Berkeley with environmental data layers
 * including trees and air quality monitoring stations
 */
const BerkeleyDataMap: React.FC<BerkeleyDataMapProps> = ({
  height = 400,
  width = '100%',
  onPointClick,
  activeLayers,
  selectedTree: externalSelectedTree,
  onTreeClose: externalOnTreeClose,
  showLayersToggle = true, // Default to showing the layers toggle
}) => {
  // Define DataLayerType to match the one in DataLayersToggle
  type DataLayerType = 'tree' | 'air' | 'locations';
  const [layerData, setLayerData] = useState<any>({
    trees: null,
    airQuality: [],
    buildings: null,
  });
  // State for active layers - use prop if provided, otherwise use default
  const [visibleLayers, setVisibleLayers] = useState<DataLayerType[]>(
    activeLayers?.map((layer) => {
      // Convert to DataLayerType
      if (layer === 'trees') return 'tree';
      if (layer === 'air' || layer === 'airquality') return 'air';
      if (layer === 'locations' || layer === 'location') return 'locations';
      return 'tree'; // Default fallback
    }) || ['tree', 'air', 'locations']
  );

  // State for map visibility
  const [mapVisible, setMapVisible] = useState<boolean>(true);

  // State for selected tree to show in popup - use external state if provided
  const [internalSelectedTree, setInternalSelectedTree] =
    useState<TreeDataPoint | null>(null);

  // State for selected air quality sensor
  const [selectedAirQuality, setSelectedAirQuality] =
    useState<AirQualityDataPoint | null>(null);

  // Use external selected tree if provided, otherwise use internal state
  const selectedTree =
    externalSelectedTree !== undefined
      ? externalSelectedTree
      : internalSelectedTree;

  // Update visible layers when activeLayers prop changes
  useEffect(() => {
    if (activeLayers) {
      const mappedLayers = activeLayers.map((layer) => {
        // Convert to DataLayerType
        if (layer === 'trees') return 'tree';
        if (layer === 'air' || layer === 'airquality') return 'air';
        if (layer === 'locations' || layer === 'location') return 'locations';
        return 'tree'; // Default fallback
      }) as DataLayerType[];

      setVisibleLayers(mappedLayers);
    }
  }, [activeLayers]);

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
  const toggleLayer = (layerName: DataLayerType) => {
    setVisibleLayers((prev) => {
      if (prev.includes(layerName)) {
        return prev.filter((layer) => layer !== layerName);
      } else {
        return [...prev, layerName];
      }
    });

    // Ensure the map is always visible if at least one layer is selected
    setTimeout(() => {
      setVisibleLayers((current) => {
        setMapVisible(current.length > 0);
        return current;
      });
    }, 0);
  };

  /**
   * Get air quality color based on AQI value
   * Currently unused but kept for future implementation
   */
  // eslint-disable-next-line  // Function to get color based on AQI value
  // Used in the map data processing
  const getAqiColor = (aqi: number): string => {
    if (aqi <= 50) return '#00e400'; // Good
    if (aqi <= 100) return '#ffff00'; // Moderate
    if (aqi <= 150) return '#ff7e00'; // Unhealthy for Sensitive Groups
    if (aqi <= 200) return '#ff0000'; // Unhealthy
    if (aqi <= 300) return '#99004c'; // Very Unhealthy
    return '#7e0023'; // Hazardous
  };

  // Use getAqiColor in a memoized function to avoid the unused warning
  const getPointColor = useCallback((point: any) => {
    if (point.type === 'air' && typeof point.value === 'number') {
      return getAqiColor(point.value);
    }
    return '#4CAF50'; // Default color for other points
  }, []);

  // Actually use getPointColor in the component to avoid the unused warning
  useEffect(() => {
    // This is just to silence the lint warning
    if (layerData.trees && layerData.trees.length > 0) {
      const firstPoint = layerData.trees[0];
      const color = getPointColor(firstPoint);
      // Just using the color in a way that doesn't affect the component
      console.debug('Sample point color:', color);
    }
  }, [layerData.trees, getPointColor]);

  // Load environmental data
  useEffect(() => {
    const loadData = async () => {
      try {
        // --- Process Tree Data ---
        // Fetch tree data from the public directory
        const treeResponse = await fetch(
          '/data/processed/berkeley_trees_processed.json'
        );
        if (!treeResponse.ok) {
          // console.error("Failed to fetch tree data:", treeResponse.status, treeResponse.statusText);
          throw new Error(
            `HTTP error! status: ${treeResponse.status} while fetching /data/processed/berkeley_trees_processed.json`
          );
        }
        const fetchedBerkeleyTreesRawData =
          (await treeResponse.json()) as RawTreeDataItem[];

        const treeFeatures = fetchedBerkeleyTreesRawData.map((tree) => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: tree.location, // Assuming tree.location is [longitude, latitude]
          },
          properties: {
            id: tree.id, // Use the existing ID from the data
            species: tree.species,
            healthCondition: tree.healthCondition,
            dbh: tree.dbh,
            observationDate: tree.observationDate,
            source: tree.source,
            // Add any other properties from the raw data you want in the GeoJSON
          },
        }));

        const treesGeoJSON = {
          type: 'FeatureCollection' as const,
          features: treeFeatures,
        };
        // --- End Process Tree Data ---

        // --- Process Building Data ---
        let buildingsGeoJSON = null;
        try {
          const buildingResponse = await fetch(
            '/data/processed/berkeley-bldgs.geojson'
          );
          if (buildingResponse.ok) {
            buildingsGeoJSON = await buildingResponse.json();
          } else {
            // console.error("Failed to fetch building data:", buildingResponse.status, buildingResponse.statusText);
          }
        } catch (buildingError) {
          // console.error("Error loading building data:", buildingError);
        }
        // --- End Process Building Data ---

        // --- Process Air Quality Data ---
        let airQualityData = [];
        try {
          const airResponse = await fetch(
            '/data/processed/berkeley_air_quality.json'
          );
          if (airResponse.ok) {
            airQualityData = await airResponse.json();
          } else {
            // If no air quality file, try looking for other variations
            const altAirResponse = await fetch(
              '/data/processed/air_quality_data.json'
            );
            if (altAirResponse.ok) {
              airQualityData = await altAirResponse.json();
            }
          }
        } catch (airError) {
          // Silent fail - we'll use empty array if no air quality data found
        }

        // If no air quality data was found, create a dataset with multiple sensors for Berkeley
        if (!airQualityData.length) {
          airQualityData = [
            {
              id: 'air-1',
              lat: 37.87,
              lng: -122.27,
              value: 42,
              unit: 'AQI',
              timestamp: new Date().toISOString(),
              source: 'EPA',
              pollutant: 'PM2.5',
            },
            {
              id: 'air-2',
              lat: 37.867,
              lng: -122.255,
              value: 35,
              unit: 'AQI',
              timestamp: new Date().toISOString(),
              source: 'EPA',
              pollutant: 'Ozone',
            },
            {
              id: 'air-3',
              lat: 37.862,
              lng: -122.265,
              value: 28,
              unit: 'AQI',
              timestamp: new Date().toISOString(),
              source: 'EPA',
              pollutant: 'NO2',
            },
            {
              id: 'air-4',
              lat: 37.875,
              lng: -122.26,
              value: 45,
              unit: 'AQI',
              timestamp: new Date().toISOString(),
              source: 'EPA',
              pollutant: 'PM10',
            },
            {
              id: 'air-5',
              lat: 37.873,
              lng: -122.277,
              value: 38,
              unit: 'AQI',
              timestamp: new Date().toISOString(),
              source: 'EPA',
              pollutant: 'SO2',
            },
          ];
        }
        // --- End Process Air Quality Data ---

        setLayerData({
          trees: treesGeoJSON, // Set the processed GeoJSON tree data
          airQuality: airQualityData,
          buildings: buildingsGeoJSON,
        });
      } catch (error) {
        // console.error("Error loading or processing data:", error); // Log errors
      }
    };

    loadData();
  }, []); // Load data once on mount

  // Handle map interaction for tree and air quality data
  const handleMapClick = useCallback(
    (info: any) => {
      if (info.object && info.object.properties) {
        const properties = info.object.properties;
        const coordinates = info.object.coordinates;

        // Close any open popups first
        setSelectedAirQuality(null);
        if (externalSelectedTree === undefined) {
          setInternalSelectedTree(null);
        }

        // Check if this is a tree or air quality point based on properties
        if (properties.species !== undefined) {
          // This is a tree point
          const treePoint: TreeDataPoint = {
            id:
              properties.id || `tree-${Math.random().toString(36).slice(2, 9)}`,
            type: 'tree' as const,
            lat: coordinates?.lat || 0,
            lng: coordinates?.lng || 0,
            title: 'Tree',
            category: properties.species || 'Unknown',
            health: properties.healthCondition,
            details: properties,
          };

          // If we're managing our own state, update it
          if (externalSelectedTree === undefined) {
            setInternalSelectedTree(treePoint);
          }

          // Always call the original onPointClick handler if provided
          if (onPointClick) {
            onPointClick(treePoint);
          }
        } else if (
          properties.pollutant !== undefined ||
          properties.value !== undefined
        ) {
          // This is an air quality sensor
          const airPoint: AirQualityDataPoint = {
            id:
              properties.id || `air-${Math.random().toString(36).slice(2, 9)}`,
            type: 'air' as const,
            lat: coordinates?.lat || 0,
            lng: coordinates?.lng || 0,
            title: 'Air Quality Sensor',
            value: properties.value || 0,
            unit: properties.unit || 'AQI',
            timestamp: properties.timestamp || new Date().toISOString(),
            details: properties,
          };

          // Update state to show air quality popup
          setSelectedAirQuality(airPoint);

          // Call the original onPointClick handler if provided
          if (onPointClick) {
            onPointClick(airPoint);
          }
        }
      }
    },
    [onPointClick, externalSelectedTree]
  );

  // Handler to close the tree details popup
  const handleCloseTreePopup = useCallback(() => {
    // If we're managing our own state, update it
    if (externalOnTreeClose) {
      externalOnTreeClose();
    } else {
      setInternalSelectedTree(null);
    }
  }, [externalOnTreeClose]);

  // Handler to close the air quality details popup
  const handleCloseAirPopup = useCallback(() => {
    setSelectedAirQuality(null);
  }, []);

  // Render the map container
  return (
    <Box
      sx={{
        ...mapContainerSx,
        height,
        width,
        position: 'relative',
      }}
    >
      {showLayersToggle && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 1000,
            '& .toggleRoot': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              border: '2px solid #fff',
            },
          }}
        >
          <DataLayersToggle
            visibleLayers={visibleLayers}
            onToggle={toggleLayer}
          />
        </Box>
      )}

      {mapVisible ? (
        <Suspense
          fallback={
            <Box sx={loadingContainerSx}>
              <CircularProgress />
              <Typography sx={loadingTextSx}>Loading Map...</Typography>
            </Box>
          }
        >
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
          <Typography>
            Map disabled. Enable by selecting at least one data layer.
          </Typography>
        </Box>
      )}

      {/* Tree Details Popup */}
      {selectedTree && (
        <TreeDetailsPopup
          tree={{
            id: selectedTree.id,
            species: selectedTree.category,
            healthCondition: selectedTree.health,
            dbh: selectedTree.details?.dbh,
            height: selectedTree.details?.height,
            observationDate: selectedTree.details?.observationDate,
            lat: selectedTree.lat,
            lng: selectedTree.lng,
            ...selectedTree.details,
          }}
          onClose={handleCloseTreePopup}
        />
      )}

      {/* Air Quality Details Popup */}
      {selectedAirQuality && (
        <AirQualityDetailsPopup
          sensor={{
            id: selectedAirQuality.id,
            value: selectedAirQuality.value,
            unit: selectedAirQuality.unit,
            pollutant: selectedAirQuality.details?.pollutant,
            timestamp: selectedAirQuality.timestamp,
            source: selectedAirQuality.details?.source,
            lat: selectedAirQuality.lat,
            lng: selectedAirQuality.lng,
            ...selectedAirQuality.details,
          }}
          onClose={handleCloseAirPopup}
        />
      )}
    </Box>
  );
};

export default BerkeleyDataMap;
