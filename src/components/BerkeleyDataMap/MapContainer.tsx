import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FeatureCollection } from 'geojson';
import { Box } from '@mui/material';
import { mapContainerStyle } from './MapContainer.styles'; 

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY || '';

const MINIMAL_STYLE: mapboxgl.Style = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 22
    }
  ],
  glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
};

interface MapContainerProps {
  height?: number | string;
  width?: number | string;
  onClick?: (info: { object: { properties: any; coordinates: mapboxgl.LngLat } }) => void;
  treeData: FeatureCollection | null;
  treeVisibility: boolean;
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
  buildingVisibility = false
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
        minZoom: 10
      });
      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      // console.log('[MapContainer] Map initialized.');
    } catch (error) {
      // console.error('[MapContainer] Error initializing Mapbox map:', error);
    }
    return () => {
      if (mapRef.current) {
        // console.log('[MapContainer] Cleaning up map instance.');
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
      const treeLabelLayerId = 'tree-labels';
      const existingTreeSource = map.getSource(treeSourceId) as mapboxgl.GeoJSONSource;

      if (treeData && treeData.features.length > 0) {
        if (existingTreeSource) {
          existingTreeSource.setData(treeData);
          // console.log('[MapContainer] Updated "trees" source data.');
        } else {
          map.addSource(treeSourceId, { type: 'geojson', data: treeData });
          // console.log('[MapContainer] Added "trees" source.');
        }

        if (!map.getLayer(treeLayerId)) {
          map.addLayer({
            id: treeLayerId,
            type: 'circle',
            source: treeSourceId,
            layout: { visibility: treeVisibility ? 'visible' : 'none' },
            paint: { 'circle-radius': 6, 'circle-color': '#2E8B57', 'circle-stroke-width': 1, 'circle-stroke-color': '#FFFFFF' }
          });
          // console.log('[MapContainer] Added "trees-layer". Initial visibility:', treeVisibility);
        } else {
          map.setLayoutProperty(treeLayerId, 'visibility', treeVisibility ? 'visible' : 'none');
        }

        if (!map.getLayer(treeLabelLayerId)) {
          map.addLayer({
            id: treeLabelLayerId,
            type: 'symbol',
            source: treeSourceId,
            layout: { 
              'text-field': ['get', 'species'], 
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'], 
              'text-offset': [0, 1.2], 
              'text-size': 10, 
              'text-allow-overlap': false, 
              visibility: treeVisibility ? 'visible' : 'none' 
            },
            paint: { 'text-color': '#000000', 'text-halo-color': '#FFFFFF', 'text-halo-width': 1 }
          });
          // console.log('[MapContainer] Added "tree-labels" layer. Initial visibility:', treeVisibility);
        } else {
          map.setLayoutProperty(treeLabelLayerId, 'visibility', treeVisibility ? 'visible' : 'none');
        }
      } else {
        const currentMap = mapRef.current;
        if (currentMap && currentMap.isStyleLoaded()) {
          if (currentMap.getLayer(treeLabelLayerId)) {
            currentMap.removeLayer(treeLabelLayerId);
          }
          if (currentMap.getLayer(treeLayerId)) {
            currentMap.removeLayer(treeLayerId);
          }
          // Ensure source exists before attempting to remove it
          if (currentMap.getSource(treeSourceId)) {
            currentMap.removeSource(treeSourceId);
          }
          // // console.log('[MapContainer] No treeData, attempted removal of tree layers/source.');
        }
      }
      
      // Air Quality layer setup
      const airSourceId = 'air-quality';
      const airLayerId = 'air-quality-layer';
      const existingAirSource = map.getSource(airSourceId) as mapboxgl.GeoJSONSource;
      
      if (airQualityData && airQualityData.length > 0) {
        // Convert air quality data to GeoJSON
        const airFeatures = airQualityData.map(point => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [point.lng, point.lat]
          },
          properties: {
            ...point,
            id: point.id || `air-${Math.random().toString(36).slice(2, 9)}`,
          }
        }));
        
        const airGeoJSON = {
          type: 'FeatureCollection' as const,
          features: airFeatures
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
            layout: { visibility: airQualityVisibility ? 'visible' : 'none' },
            paint: { 
              'circle-radius': 10, 
              'circle-color': '#4287f5',
              'circle-stroke-width': 2, 
              'circle-stroke-color': '#FFFFFF'
            }
          });
        } else {
          map.setLayoutProperty(airLayerId, 'visibility', airQualityVisibility ? 'visible' : 'none');
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
      
      // Building layer setup
      const buildingSourceId = 'buildings';
      const buildingLayerId = 'buildings-layer';
      const existingBuildingSource = map.getSource(buildingSourceId) as mapboxgl.GeoJSONSource;
      
      if (buildingData && buildingData.features && buildingData.features.length > 0) {
        if (existingBuildingSource) {
          existingBuildingSource.setData(buildingData);
        } else {
          map.addSource(buildingSourceId, { type: 'geojson', data: buildingData });
        }
        
        if (!map.getLayer(buildingLayerId)) {
          map.addLayer({
            id: buildingLayerId,
            type: 'fill',
            source: buildingSourceId,
            layout: { visibility: buildingVisibility ? 'visible' : 'none' },
            paint: { 
              'fill-color': '#8a2be2', 
              'fill-opacity': 0.6,
              'fill-outline-color': '#000000'
            }
          });
        } else {
          map.setLayoutProperty(buildingLayerId, 'visibility', buildingVisibility ? 'visible' : 'none');
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
      // console.log('[MapContainer] Map style not loaded, deferring layer setup for treeData.');
    }
  }, [treeData, treeVisibility, airQualityData, airQualityVisibility, buildingData, buildingVisibility]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !onClick) return;

    // Click handler setup for tree layer
    const treeLayerId = 'trees-layer';
    const handleTreeClick = (e: mapboxgl.MapLayerMouseEvent) => {
      if (e.features && e.features.length > 0 && e.features[0].properties && e.lngLat) {
        onClick({ object: { properties: e.features[0].properties, coordinates: e.lngLat } });
      }
    };
    
    // Click handler setup for air quality layer
    const airLayerId = 'air-quality-layer';
    const handleAirClick = (e: mapboxgl.MapLayerMouseEvent) => {
      if (e.features && e.features.length > 0 && e.features[0].properties && e.lngLat) {
        onClick({ object: { properties: e.features[0].properties, coordinates: e.lngLat } });
      }
    };
    
    // Click handler setup for building layer
    const buildingLayerId = 'buildings-layer';
    const handleBuildingClick = (e: mapboxgl.MapLayerMouseEvent) => {
      if (e.features && e.features.length > 0 && e.features[0].properties && e.lngLat) {
        onClick({ object: { properties: e.features[0].properties, coordinates: e.lngLat } });
      }
    };
    
    const onMouseEnter = () => { if (map.getCanvas()) map.getCanvas().style.cursor = 'pointer'; };
    const onMouseLeave = () => { if (map.getCanvas()) map.getCanvas().style.cursor = ''; };

    // Add event listeners to tree layer
    if (treeData && treeData.features.length > 0) {
        if (map.isStyleLoaded() && map.getLayer(treeLayerId)) {
            map.on('click', treeLayerId, handleTreeClick);
            map.on('mouseenter', treeLayerId, onMouseEnter);
            map.on('mouseleave', treeLayerId, onMouseLeave);
        }
    }
    
    // Add event listeners to air quality layer
    if (airQualityData && airQualityData.length > 0) {
        if (map.isStyleLoaded() && map.getLayer(airLayerId)) {
            map.on('click', airLayerId, handleAirClick);
            map.on('mouseenter', airLayerId, onMouseEnter);
            map.on('mouseleave', airLayerId, onMouseLeave);
        }
    }
    
    // Add event listeners to building layer
    if (buildingData && buildingData.features && buildingData.features.length > 0) {
        if (map.isStyleLoaded() && map.getLayer(buildingLayerId)) {
            map.on('click', buildingLayerId, handleBuildingClick);
            map.on('mouseenter', buildingLayerId, onMouseEnter);
            map.on('mouseleave', buildingLayerId, onMouseLeave);
        }
    }

    return () => {
      const currentMap = mapRef.current;
      if (currentMap && currentMap.isStyleLoaded()) {
        // Remove tree layer event listeners
        currentMap.off('click', treeLayerId, handleTreeClick);
        currentMap.off('mouseenter', treeLayerId, onMouseEnter);
        currentMap.off('mouseleave', treeLayerId, onMouseLeave);
        
        // Remove air quality layer event listeners
        currentMap.off('click', airLayerId, handleAirClick);
        currentMap.off('mouseenter', airLayerId, onMouseEnter);
        currentMap.off('mouseleave', airLayerId, onMouseLeave);
        
        // Remove building layer event listeners
        currentMap.off('click', buildingLayerId, handleBuildingClick);
        currentMap.off('mouseenter', buildingLayerId, onMouseEnter);
        currentMap.off('mouseleave', buildingLayerId, onMouseLeave);
      }
    };
  }, [onClick, treeData, treeVisibility, airQualityData, airQualityVisibility, buildingData, buildingVisibility]);

  return (
    <Box
      ref={mapContainerRef} // mapContainerRef is now on the Box itself
      sx={{
        ...mapContainerStyle, // Spread the base style from MapContainer.styles.ts
        height: typeof height === 'number' ? `${height}px` : height, // Override with prop
        width: typeof width === 'number' ? `${width}px` : width,     // Override with prop
        // 'position' and 'overflow' are handled by mapContainerStyle
      }}
    >
      {/* Mapbox will attach to the Box element directly */}
    </Box>
  );
};

export default MapContainer;
