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
import {
  cursorPointerStyle,
  cursorDefaultStyle,
  mapContainerDivStyle,
} from './MapContainer.styles';

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
  onClick,
  treeData,
  treeVisibility,
  airQualityData = [],
  airQualityVisibility = false,
  buildingData = null,
  buildingVisibility = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: MINIMAL_STYLE,
        center: [-122.25948, 37.872],
        zoom: 14,
        attributionControl: true,
        maxZoom: 18,
        minZoom: 10,
      });
      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // No custom icons needed - using circle markers for both trees and air quality
    } catch (error) {
      // Map initialization error is handled by the component's error boundaries
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const setupOrUpdateLayers = () => {
      // Trees layer setup
      const treeSourceId = 'trees';
      const treeLayerId = 'trees-layer';
      const existingTreeSource = map.getSource(
        treeSourceId
      ) as mapboxgl.GeoJSONSource;

      if (treeData && treeData.features.length > 0) {
        if (existingTreeSource) {
          existingTreeSource.setData(treeData);
        } else {
          map.addSource(treeSourceId, {
            type: 'geojson',
            data: treeData,
            generateId: true, // Generate unique IDs for features
          });
        }

        // Tree circle layer
        if (!map.getLayer(treeLayerId)) {
          map.addLayer({
            id: treeLayerId,
            type: 'circle',
            source: treeSourceId,
            layout: {
              visibility: treeVisibility ? 'visible' : 'none',
            },
            paint: {
              // Regular green dot for trees
              'circle-radius': 6,
              'circle-color': '#4CAF50', // Green color
              'circle-opacity': 0.9,
              // Thin border that appears on hover or selection using feature state
              'circle-stroke-width': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                2,
                ['boolean', ['feature-state', 'selected'], false],
                2,
                0
              ],
              'circle-stroke-color': '#000000',
            },
          });
        } else {
          map.setLayoutProperty(
            treeLayerId,
            'visibility',
            treeVisibility ? 'visible' : 'none'
          );
        }

        // No labels for trees - species will be shown in details popup instead
      } else {
        const currentMap = mapRef.current;
        if (currentMap && currentMap.isStyleLoaded()) {
          if (currentMap.getLayer(treeLayerId)) {
            currentMap.removeLayer(treeLayerId);
          }
          if (currentMap.getSource(treeSourceId)) {
            currentMap.removeSource(treeSourceId);
          }
        }
      }

      // Air Quality layer setup
      const airSourceId = 'air-quality';
      const airLayerId = 'air-quality-layer';
      const existingAirSource = map.getSource(
        airSourceId
      ) as mapboxgl.GeoJSONSource;

      if (airQualityData && airQualityData.length > 0) {
        // Convert air quality data to GeoJSON
        const airFeatures = airQualityData.map((point) => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [point.lng, point.lat],
          },
          properties: {
            ...point,
            id: point.id || `air-${Math.random().toString(36).slice(2, 9)}`,
          },
        }));

        const airGeoJSON = {
          type: 'FeatureCollection' as const,
          features: airFeatures,
        };

        if (existingAirSource) {
          existingAirSource.setData(airGeoJSON);
        } else {
          map.addSource(airSourceId, { type: 'geojson', data: airGeoJSON });
        }

        if (!map.getLayer(airLayerId)) {
          map.addLayer({
            id: airLayerId,
            type: 'circle',
            source: airSourceId,
            layout: {
              visibility: airQualityVisibility ? 'visible' : 'none',
            },
            paint: {
              'circle-radius': 6,
              'circle-color': '#FFA500', // Amber color
              'circle-opacity': 0.9,
              'circle-stroke-width': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                2,
                ['boolean', ['feature-state', 'selected'], false],
                2,
                0
              ],
              'circle-stroke-color': '#000000',
            },
          });
        } else {
          map.setLayoutProperty(
            airLayerId,
            'visibility',
            airQualityVisibility ? 'visible' : 'none'
          );
        }
      } else {
        const currentMap = mapRef.current;
        if (currentMap && currentMap.isStyleLoaded()) {
          if (currentMap.getLayer(airLayerId)) {
            currentMap.removeLayer(airLayerId);
          }
          if (currentMap.getSource(airSourceId)) {
            currentMap.removeSource(airSourceId);
          }
        }
      }

      // Building layer setup - add this first to ensure it's below other layers
      const buildingSourceId = 'buildings';
      const buildingLayerId = 'buildings-layer';
      const existingBuildingSource = map.getSource(
        buildingSourceId
      ) as mapboxgl.GeoJSONSource;

      if (
        buildingData &&
        buildingData.features &&
        buildingData.features.length > 0
      ) {
        if (existingBuildingSource) {
          existingBuildingSource.setData(buildingData);
        } else {
          // Add the source
          map.addSource(buildingSourceId, {
            type: 'geojson',
            data: buildingData,
          });

          // Add the building layer first, before any other layers
          if (!map.getLayer(buildingLayerId)) {
            map.addLayer({
              id: buildingLayerId,
              type: 'fill',
              source: buildingSourceId,
              layout: { visibility: buildingVisibility ? 'visible' : 'none' },
              paint: {
                'fill-color': '#8a2be2',
                'fill-opacity': 0.3,
                'fill-outline-color': '#000000',
              },
            }); // No beforeId, appends to the top of the layer stack
          }
        }

        // Update visibility if layer already exists
        if (map.getLayer(buildingLayerId)) {
          map.setLayoutProperty(
            buildingLayerId,
            'visibility',
            buildingVisibility ? 'visible' : 'none'
          );
        }
      } else {
        const currentMap = mapRef.current;
        if (currentMap && currentMap.isStyleLoaded()) {
          if (currentMap.getLayer(buildingLayerId)) {
            currentMap.removeLayer(buildingLayerId);
          }
          if (currentMap.getSource(buildingSourceId)) {
            currentMap.removeSource(buildingSourceId);
          }
        }
      }
    };

    if (map.isStyleLoaded()) {
      setupOrUpdateLayers();
    } else {
      map.once('load', setupOrUpdateLayers);
    }
  }, [
    treeData,
    treeVisibility,
    airQualityData,
    airQualityVisibility,
    buildingData,
    buildingVisibility,
  ]);

  // State refs to track hovered and selected tree feature IDs
  const hoveredTreeIdRef = useRef<number | null>(null);
  const selectedTreeIdRef = useRef<number | null>(null);
  
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !onClick) return;

    // Click handler setup for tree layer
    const treeLayerId = 'trees-layer';
    const handleTreeClick = (
      e: mapboxgl.MapMouseEvent & { features?: any[] }
    ) => {
      // Prevent event propagation to avoid multiple click handlers
      e.preventDefault();

      if (
        e.features &&
        e.features.length > 0 &&
        e.features[0].properties &&
        e.lngLat
      ) {
        const clickedFeatureId = e.features[0].id;
        const clickedFeature = e.features[0];
        // Tree clicked with properties and ID
        // Tree feature clicked

        // Remove previous selection state
        if (selectedTreeIdRef.current !== null) {
          map.removeFeatureState({
            source: 'trees',
            id: selectedTreeIdRef.current,
          });
        }

        // Set new selection state
        if (clickedFeatureId !== undefined) {
          map.setFeatureState(
            { source: 'trees', id: clickedFeatureId },
            { selected: true }
          );
          selectedTreeIdRef.current = clickedFeatureId;
        }

        onClick({
          object: {
            properties: clickedFeature.properties,
            coordinates: e.lngLat,
          },
        });

  // Click handler setup for tree layer
  const treeLayerId = 'trees-layer';
  const handleTreeClick = (
    e: mapboxgl.MapMouseEvent & { features?: any[] }
  ) => {
    // Prevent event propagation to avoid multiple click handlers
    e.preventDefault();

    if (
      e.features &&
      e.features.length > 0 &&
      e.features[0].properties &&
      e.lngLat
    ) {
      const clickedFeatureId = e.features[0].id;
      const clickedFeature = e.features[0];
      // Tree clicked with properties and ID
      // Tree feature clicked

      // Remove previous selection state
      if (selectedTreeIdRef.current !== null) {
        map.removeFeatureState({
          source: 'trees',
          id: selectedTreeIdRef.current,
        });
      }

      // Set new selection state
      if (clickedFeatureId !== undefined) {
        map.setFeatureState(
          { source: 'trees', id: clickedFeatureId },
          { selected: true }
        );
        selectedTreeIdRef.current = clickedFeatureId;
      }

      onClick({
        object: {
          properties: clickedFeature.properties,
          coordinates: e.lngLat,
        },
      });
    }
  };

  // Click handler setup for air quality layer
  const airLayerId = 'air-quality-layer';
  const handleAirQualityClick = (
    e: mapboxgl.MapMouseEvent & { features?: any[] }
  ) => {
    e.preventDefault();

    if (
      e.features &&
      e.features.length > 0 &&
      e.features[0].properties &&
      e.lngLat
    ) {
      console.log('Air quality sensor clicked:', e.features[0].properties);
      onClick({
        object: {
          properties: e.features[0].properties,
          coordinates: e.lngLat,
        },
      });
    }
  };

  // Click handler setup for building layer
  const buildingLayerId = 'buildings-layer';
  const handleBuildingClick = (
    e: mapboxgl.MapMouseEvent & { features?: any[] }
  ) => {
    e.preventDefault();

    if (
      e.features &&
      e.features.length > 0 &&
      e.features[0].properties &&
      e.lngLat
    ) {
      console.log('Building clicked:', e.features[0].properties);
      onClick({
        object: {
          properties: e.features[0].properties,
          coordinates: e.lngLat,
        },
      });
    }
  };

  // Cursor handling and hover state for better user feedback
  const handleMapMouseEnter = (
    e: mapboxgl.MapMouseEvent & { features?: any[] }
  ) => {
    const canvas = map.getCanvas();
    if (canvas) {
      Object.assign(canvas.style, cursorPointerStyle);
    }

    // Add hover effect for trees
    if (e.features && e.features.length > 0) {
      const hoveredFeatureId = e.features[0].id;
      if (hoveredFeatureId !== undefined) {
        // Remove hover state from previous feature
        if (hoveredTreeIdRef.current !== null) {
          map.removeFeatureState(
            {
              source: 'trees',
              id: hoveredTreeIdRef.current,
            },
            'hover'
          );
        }

        // Add hover state to current feature
        map.setFeatureState(
          {
            source: 'trees',
            id: hoveredFeatureId,
          },
          { hover: true }
        );
        hoveredTreeIdRef.current = hoveredFeatureId;
      }
    }
  };

  const handleMapMouseLeave = () => {
    const canvas = map.getCanvas();
    if (canvas) {
      Object.assign(canvas.style, cursorDefaultStyle);
    }

    // Remove hover state when mouse leaves the feature
    if (hoveredTreeIdRef.current !== null) {
      map.removeFeatureState(
        {
          source: 'trees',
          id: hoveredTreeIdRef.current,
        },
        'hover'
      );
      hoveredTreeIdRef.current = null;
    }
  };

  // Function to set up event listeners for a layer
  const setupLayerInteractions = (
    layerId: string,
    clickHandler: (e: mapboxgl.MapMouseEvent & { features?: any[] }) => void
  ) => {
    if (!map.getLayer(layerId)) return false;

    // Remove any existing handlers to prevent duplicates
    map.off('click', layerId, clickHandler);
    map.off('mouseenter', layerId, handleMapMouseEnter);
    map.off('mouseleave', layerId, handleMapMouseLeave);

    // Handle events only once
    map.once('click', layerId, clickHandler);
    map.on('mouseenter', layerId, handleMapMouseEnter);
    map.on('mouseleave', layerId, handleMapMouseLeave);

    return true;
  };

  // Function to attempt setting up interactions with retry logic
  const attemptSetupInteractions = () => {
    let treesSetup = false;
    let airSetup = false;
    let buildingsSetup = false;

    console.log('Attempting to set up layer interactions...');
    console.log(
      'Available layers:',
      map.getStyle().layers?.map((l) => l.id)
    );

    // Try to set up tree layer interactions
    if (treeData && treeData.features && treeData.features.length > 0) {
      console.log('Setting up tree layer interactions for', treeLayerId);
      treesSetup = setupLayerInteractions(treeLayerId, handleTreeClick);
      console.log('Tree layer setup successful:', treesSetup);
    }

    // Try to set up air quality layer interactions
    if (airQualityData && airQualityData.length > 0) {
      console.log(
        'Setting up air quality layer interactions for',
        airLayerId
      );
      airSetup = setupLayerInteractions(airLayerId, handleAirQualityClick);
      console.log('Air quality layer setup successful:', airSetup);
    }

    // Try to set up building layer interactions
    if (
      buildingData &&
      buildingData.features &&
      buildingData.features.length > 0
    ) {
      console.log(
        'Setting up building layer interactions for',
        buildingLayerId
      );
      buildingsSetup = setupLayerInteractions(
        buildingLayerId,
        handleBuildingClick
      );
      console.log('Building layer setup successful:', buildingsSetup);
    }

    // If any layer failed to set up and we have data for it, retry after a delay
    const needsRetry =
      (treeData &&
        treeData.features &&
        treeData.features.length > 0 &&
        !treesSetup) ||
      (airQualityData && airQualityData.length > 0 && !airSetup) ||
      (buildingData &&
        buildingData.features &&
        buildingData.features.length > 0 &&
        !buildingsSetup);

    if (needsRetry) {
      console.log('Some layers not set up, retrying in 100ms...');
      setTimeout(attemptSetupInteractions, 100);
    } else {
      console.log('All layer interactions set up successfully!');
    }
  };

  // Start the setup process
  if (map.isStyleLoaded()) {
    console.log(
      'Map style already loaded, setting up interactions immediately'
    );
    attemptSetupInteractions();
  } else {
    console.log('Map style not loaded yet, waiting for load event');
    map.once('load', () => {
      console.log('Map load event fired, now setting up interactions');
      // Wait a bit to ensure all layers are fully loaded
      setTimeout(attemptSetupInteractions, 500);
    });
  }

  // Add a direct click handler to the map for debugging
  map.on('click', (e) => {
    console.log('Map clicked at:', e.lngLat);

    // Query features at click point for all layers
    const treeFeatures = map.queryRenderedFeatures(e.point, {
      layers: [treeLayerId],
    });
    const airFeatures = map.queryRenderedFeatures(e.point, {
      layers: [airLayerId],
    });
    const buildingFeatures = map.queryRenderedFeatures(e.point, {
      layers: [buildingLayerId],
    });

    console.log('Features at click point:', {
      trees: treeFeatures.length > 0 ? treeFeatures : 'none',
      air: airFeatures.length > 0 ? airFeatures : 'none',
      buildings: buildingFeatures.length > 0 ? buildingFeatures : 'none',
    });

    // If we found features but the layer-specific handlers didn't fire,
    // manually trigger the appropriate handler
    if (treeFeatures.length > 0) {
      console.log('Manually handling tree click');
      onClick({
        object: {
          properties: treeFeatures[0].properties,
          coordinates: e.lngLat,
        },
      });
    } else if (airFeatures.length > 0) {
      console.log('Manually handling air quality click');
      onClick({
        object: {
          properties: airFeatures[0].properties,
          coordinates: e.lngLat,
        },
      });
    } else if (buildingFeatures.length > 0) {
      console.log('Manually handling building click');
      onClick({
        object: {
          properties: buildingFeatures[0].properties,
          coordinates: e.lngLat,
        },
      });
    }
  });

  // Also add a click handler to the entire map for debugging
  const mapClickHandler = (e: mapboxgl.MapMouseEvent) => {
    console.log('Map clicked at:', e.lngLat);
  };
  map.on('click', mapClickHandler);

  return () => {
    const currentMap = mapRef.current;
    if (currentMap) {
      // Remove all event handlers
      if (currentMap.getLayer(treeLayerId)) {
        currentMap.off('click', treeLayerId, handleTreeClick);
        currentMap.off('mouseenter', treeLayerId, handleMapMouseEnter);
        currentMap.off('mouseleave', treeLayerId, handleMapMouseLeave);

        // Clean up feature states
        if (hoveredTreeIdRef.current !== null) {
          currentMap.removeFeatureState({
            source: 'trees',
            id: hoveredTreeIdRef.current,
          });
        }
        if (selectedTreeIdRef.current !== null) {
          currentMap.removeFeatureState({
            source: 'trees',
            id: selectedTreeIdRef.current,
          });
        }
      }
  }, [
    onClick,
    treeData,
    treeVisibility,
    airQualityData,
    airQualityVisibility,
    buildingData,
    buildingVisibility,
  ]);

  return <Box ref={mapContainerRef} sx={mapContainerDivStyle(height, width)} />;
};

export default MapContainer;
