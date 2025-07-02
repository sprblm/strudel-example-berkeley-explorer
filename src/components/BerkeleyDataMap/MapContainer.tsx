/**
 * MapContainer Component
 *
 * Core map rendering component that initializes and manages the Mapbox GL map instance.
 * Handles layer management, user interactions, and data visualization for various
 * environmental data layers including trees, air quality, and building footprints.
 * Provides a responsive, interactive map interface with customizable layers and controls.
 */

import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FeatureCollection } from 'geojson';
import { Box } from '@mui/material';

// Helper type for Mapbox events that include optional GeoJSON features
type MapMouseEventWithFeatures = mapboxgl.MapMouseEvent & {
  features?: mapboxgl.MapboxGeoJSONFeature[];
};

// Define container style
const mapContainerStyle = (
  height: string | number,
  width: string | number
) => ({
  height,
  width,
});

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY || '';

const MINIMAL_STYLE: mapboxgl.Style = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: ' OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 22,
    },
  ],
  glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
};

interface MapContainerProps {
  height?: number | string;
  width?: number | string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  onClick?: (info: any) => void;
  treeData?: FeatureCollection | null;
  treeVisibility?: boolean;
  airQualityData?: any[];
  airQualityVisibility?: boolean;
  buildingData?: FeatureCollection | null;
  buildingVisibility?: boolean;
}

const MapContainer: React.FC<MapContainerProps> = ({
  height = 600,
  width = '100%',
  onClick = () => {},
  treeData = null,
  treeVisibility = true,
  airQualityData = [],
  airQualityVisibility = false,
  buildingData = null,
  buildingVisibility = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // References to track hovered and selected features
  const hoveredTreeIdRef = useRef<number | null>(null);
  const selectedTreeIdRef = useRef<number | null>(null);
  const hoveredAirQualityIdRef = useRef<number | null>(null);
  const selectedAirQualityIdRef = useRef<number | null>(null);

  // Initialize the map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: MINIMAL_STYLE,
        center: [-122.25948, 37.872],
        zoom: 14,
        attributionControl: true,
        maxZoom: 18,
        minZoom: 10,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      mapRef.current = map;
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error('Error initializing map:', error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Add tree data layer when treeData changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Layer IDs for trees
    const treeSourceId = 'trees';
    const treeLayerId = 'tree-layer';

    // Clean up existing tree layer if it exists
    if (map.getSource(treeSourceId)) {
      if (map.getLayer(treeLayerId)) {
        map.removeLayer(treeLayerId);
      }
      map.removeSource(treeSourceId);
    }

    // Add tree data if available and visibility is enabled
    if (treeData && treeVisibility) {
      map.addSource(treeSourceId, {
        type: 'geojson',
        data: treeData,
      });

      // Add tree layer as a circle instead of using an icon image
      map.addLayer({
        id: treeLayerId,
        type: 'circle',
        source: treeSourceId,
        paint: {
          'circle-radius': 6,
          'circle-color': '#4CAF50', // Green color for trees
          'circle-opacity': 0.9,
          'circle-stroke-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            2,
            ['boolean', ['feature-state', 'selected'], false],
            2,
            0,
          ],
          'circle-stroke-color': '#000000', // Black border for hover/selected
        },
      });

      // Tree click handler
      const handleTreeClick = (e: MapMouseEventWithFeatures) => {
        if (e.features && e.features.length > 0) {
          const treeFeature = e.features[0];
          const treeId =
            treeFeature.id ||
            (treeFeature.properties && treeFeature.properties.id);

          // Clear previous selection
          if (selectedTreeIdRef.current !== null) {
            map.removeFeatureState(
              { source: treeSourceId, id: selectedTreeIdRef.current },
              'selected'
            );
          }

          // Set new selection
          selectedTreeIdRef.current = treeId;
          map.setFeatureState(
            { source: treeSourceId, id: treeId },
            { selected: true }
          );

          // Call onClick callback with the selected tree data
          onClick({
            object: {
              properties: treeFeature.properties,
              coordinates: e.lngLat,
            },
          });
        }
      };

      // Mouse enter handler for hover effect
      const handleMapMouseEnter = (e: MapMouseEventWithFeatures) => {
        const canvas = map.getCanvas();
        if (canvas) {
          canvas.style.cursor = 'pointer';
        }

        // Only proceed if we have features
        if (e.features && e.features.length > 0) {
          // Remove previous hover state if it exists
          if (hoveredTreeIdRef.current !== null) {
            map.removeFeatureState(
              { source: treeSourceId, id: hoveredTreeIdRef.current },
              'hover'
            );
          }

          // Set hover state on the current feature
          const hoveredFeatureId =
            e.features[0].id || e.features[0].properties?.id;
          hoveredTreeIdRef.current = hoveredFeatureId;

          map.setFeatureState(
            { source: treeSourceId, id: hoveredFeatureId },
            { hover: true }
          );
        }
      };

      // Mouse leave handler to remove hover effect
      const handleMapMouseLeave = () => {
        const canvas = map.getCanvas();
        if (canvas) {
          canvas.style.cursor = '';
        }

        // Remove hover state when mouse leaves
        if (hoveredTreeIdRef.current !== null) {
          map.removeFeatureState(
            { source: treeSourceId, id: hoveredTreeIdRef.current },
            'hover'
          );
          hoveredTreeIdRef.current = null;
        }
      };

      // Set up event listeners for tree layer
      map.on('click', treeLayerId, handleTreeClick);
      map.on('mouseenter', treeLayerId, handleMapMouseEnter);
      map.on('mouseleave', treeLayerId, handleMapMouseLeave);

      // Clean up function to remove event listeners
      return () => {
        if (map.getLayer(treeLayerId)) {
          map.off('click', treeLayerId, handleTreeClick);
          map.off('mouseenter', treeLayerId, handleMapMouseEnter);
          map.off('mouseleave', treeLayerId, handleMapMouseLeave);

          // Clean up feature states
          const hoveredId = hoveredTreeIdRef.current;
          if (hoveredId !== null) {
            map.removeFeatureState({
              source: treeSourceId,
              id: hoveredId,
            });
          }
          const selectedId = selectedTreeIdRef.current;
          if (selectedId !== null) {
            map.removeFeatureState({
              source: treeSourceId,
              id: selectedId,
            });
          }
        }
      };
    }
  }, [treeData, treeVisibility, onClick]);

  // Add air quality data layer when airQualityData changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Layer IDs for air quality
    const airSourceId = 'air-quality';
    const airLayerId = 'air-quality-layer';

    // Clean up existing air quality layer if it exists
    if (map.getSource(airSourceId)) {
      if (map.getLayer(airLayerId)) {
        map.removeLayer(airLayerId);
      }
      map.removeSource(airSourceId);
    }

    // Add air quality data if available and visibility is enabled
    if (airQualityData && airQualityData.length > 0 && airQualityVisibility) {
      // Convert the air quality data to GeoJSON format
      const airQualityGeoJson = {
        type: 'FeatureCollection',
        features: airQualityData.map((sensor, index) => ({
          type: 'Feature',
          id: sensor.id || index,
          geometry: {
            type: 'Point',
            coordinates: [sensor.longitude, sensor.latitude],
          },
          properties: { ...sensor },
        })),
      };

      map.addSource(airSourceId, {
        type: 'geojson',
        data: airQualityGeoJson as any,
      });

      // Add air quality layer as amber-colored circles
      map.addLayer({
        id: airLayerId,
        type: 'circle',
        source: airSourceId,
        paint: {
          'circle-radius': 6,
          'circle-color': '#FFA500', // Amber color for air quality sensors
          'circle-opacity': 0.9,
          'circle-stroke-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            2,
            ['boolean', ['feature-state', 'selected'], false],
            2,
            0,
          ],
          'circle-stroke-color': '#000000', // Black border for hover/selected
        },
      });

      // Air quality click handler
      const handleAirQualityClick = (e: MapMouseEventWithFeatures) => {
        e.preventDefault();

        // Only proceed if we have features
        if (e.features && e.features.length > 0) {
          const airFeature = e.features[0];
          const airId =
            airFeature.id ||
            (airFeature.properties && airFeature.properties.id);

          // Clear previous selection
          if (selectedAirQualityIdRef.current !== null) {
            map.removeFeatureState(
              { source: airSourceId, id: selectedAirQualityIdRef.current },
              'selected'
            );
          }

          // Set new selection
          selectedAirQualityIdRef.current = airId;
          map.setFeatureState(
            { source: airSourceId, id: airId },
            { selected: true }
          );

          // Call onClick callback with the selected air quality data
          onClick({
            object: {
              properties: airFeature.properties,
              coordinates: e.lngLat,
            },
          });
        }
      };

      // Mouse enter handler for hover effect
      const handleAirMouseEnter = (
        e: mapboxgl.MapMouseEvent & {
          features?: mapboxgl.MapboxGeoJSONFeature[];
        }
      ) => {
        const canvas = map.getCanvas();
        if (canvas) {
          canvas.style.cursor = 'pointer';
        }

        // Only proceed if we have features
        if (e.features && e.features.length > 0) {
          // Remove previous hover state if it exists
          if (hoveredAirQualityIdRef.current !== null) {
            map.removeFeatureState(
              { source: airSourceId, id: hoveredAirQualityIdRef.current },
              'hover'
            );
          }

          // Set hover state on the current feature
          const hoveredFeatureId =
            e.features[0].id || e.features[0].properties?.id;
          hoveredAirQualityIdRef.current = hoveredFeatureId;

          map.setFeatureState(
            { source: airSourceId, id: hoveredFeatureId },
            { hover: true }
          );
        }
      };

      // Mouse leave handler to remove hover effect
      const handleAirMouseLeave = () => {
        const canvas = map.getCanvas();
        if (canvas) {
          canvas.style.cursor = '';
        }

        // Remove hover state when mouse leaves
        if (hoveredAirQualityIdRef.current !== null) {
          map.removeFeatureState(
            { source: airSourceId, id: hoveredAirQualityIdRef.current },
            'hover'
          );
          hoveredAirQualityIdRef.current = null;
        }
      };

      // Set up event listeners for air quality layer
      map.on('click', airLayerId, handleAirQualityClick);
      map.on('mouseenter', airLayerId, handleAirMouseEnter);
      map.on('mouseleave', airLayerId, handleAirMouseLeave);

      // Clean up function to remove event listeners
      return () => {
        if (map.getLayer(airLayerId)) {
          map.off('click', airLayerId, handleAirQualityClick);
          map.off('mouseenter', airLayerId, handleAirMouseEnter);
          map.off('mouseleave', airLayerId, handleAirMouseLeave);

          // Clean up feature states
          const hoveredId = hoveredAirQualityIdRef.current;
          if (hoveredId !== null) {
            map.removeFeatureState({
              source: airSourceId,
              id: hoveredId,
            });
          }
          const selectedId = selectedAirQualityIdRef.current;
          if (selectedId !== null) {
            map.removeFeatureState({
              source: airSourceId,
              id: selectedId,
            });
          }
        }
      };
    }
  }, [airQualityData, airQualityVisibility, onClick]);

  // Add building data layer when buildingData changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Layer IDs for buildings
    const buildingSourceId = 'buildings';
    const buildingLayerId = 'building-layer';

    // Clean up existing building layer if it exists
    if (map.getSource(buildingSourceId)) {
      if (map.getLayer(buildingLayerId)) {
        map.removeLayer(buildingLayerId);
      }
      map.removeSource(buildingSourceId);
    }

    // Add building data if available and visibility is enabled
    if (buildingData && buildingVisibility) {
      map.addSource(buildingSourceId, {
        type: 'geojson',
        data: buildingData,
      });

      map.addLayer({
        id: buildingLayerId,
        type: 'fill',
        source: buildingSourceId,
        paint: {
          'fill-color': '#B3B3B3',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.8,
            0.5,
          ],
          'fill-outline-color': '#000000',
        },
      });

      // Building click handler
      const handleBuildingClick = (e: MapMouseEventWithFeatures) => {
        if (e.features && e.features.length > 0) {
          const buildingFeature = e.features[0];

          // Call onClick callback with the selected building data
          onClick({
            object: {
              properties: buildingFeature.properties,
              coordinates: e.lngLat,
            },
          });
        }
      };

      // Set up event listeners for building layer
      map.on('click', buildingLayerId, handleBuildingClick);

      // Clean up function to remove event listeners
      return () => {
        if (map.getLayer(buildingLayerId)) {
          map.off('click', buildingLayerId, handleBuildingClick);
        }
      };
    }
  }, [buildingData, buildingVisibility, onClick]);

  return <Box ref={mapContainerRef} sx={mapContainerStyle(height, width)} />;
};

export default MapContainer;
