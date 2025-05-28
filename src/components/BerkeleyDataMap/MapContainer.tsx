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
}

const MapContainer: React.FC<MapContainerProps> = ({
  height = 600,
  width = '100%',
  onClick,
  treeData,
  treeVisibility
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
      console.log('[MapContainer] Map initialized.');
    } catch (error) {
      console.error('[MapContainer] Error initializing Mapbox map:', error);
    }
    return () => {
      if (mapRef.current) {
        console.log('[MapContainer] Cleaning up map instance.');
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const setupOrUpdateLayers = () => {
      const sourceId = 'trees';
      const layerId = 'trees-layer';
      const labelLayerId = 'tree-labels';
      const existingSource = map.getSource(sourceId) as mapboxgl.GeoJSONSource;

      if (treeData && treeData.features.length > 0) {
        if (existingSource) {
          existingSource.setData(treeData);
          console.log('[MapContainer] Updated "trees" source data.');
        } else {
          map.addSource(sourceId, { type: 'geojson', data: treeData });
          console.log('[MapContainer] Added "trees" source.');
        }

        if (!map.getLayer(layerId)) {
          map.addLayer({
            id: layerId,
            type: 'circle',
            source: sourceId,
            layout: { visibility: treeVisibility ? 'visible' : 'none' },
            paint: { 'circle-radius': 6, 'circle-color': '#2E8B57', 'circle-stroke-width': 1, 'circle-stroke-color': '#FFFFFF' }
          });
          console.log('[MapContainer] Added "trees-layer". Initial visibility:', treeVisibility);
        } else {
          map.setLayoutProperty(layerId, 'visibility', treeVisibility ? 'visible' : 'none');
        }

        if (!map.getLayer(labelLayerId)) {
          map.addLayer({
            id: labelLayerId,
            type: 'symbol',
            source: sourceId,
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
          console.log('[MapContainer] Added "tree-labels" layer. Initial visibility:', treeVisibility);
        } else {
          map.setLayoutProperty(labelLayerId, 'visibility', treeVisibility ? 'visible' : 'none');
        }
      } else {
        if (map.getLayer(labelLayerId)) map.removeLayer(labelLayerId);
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (existingSource) map.removeSource(sourceId);
        console.log('[MapContainer] No treeData, removed tree layers/source.');
      }
    };

    if (map.isStyleLoaded()) {
      setupOrUpdateLayers();
    } else {
      map.once('load', setupOrUpdateLayers);
      console.log('[MapContainer] Map style not loaded, deferring layer setup for treeData.');
    }
  }, [treeData, treeVisibility]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !onClick) return;

    const layerId = 'trees-layer';
    const handleClick = (e: mapboxgl.MapLayerMouseEvent) => {
      if (e.features && e.features.length > 0 && e.features[0].properties && e.lngLat) {
        onClick({ object: { properties: e.features[0].properties, coordinates: e.lngLat } });
      }
    };
    const onMouseEnter = () => { if (map.getCanvas()) map.getCanvas().style.cursor = 'pointer'; };
    const onMouseLeave = () => { if (map.getCanvas()) map.getCanvas().style.cursor = ''; };

    // Only add listeners if the layer might exist (i.e., treeData is present)
    if (treeData && treeData.features.length > 0) {
        // It's safer to add listeners after layers are confirmed to be there.
        // This effect runs after the treeData effect that adds layers.
        // A slight delay or checking layer existence again might be needed if races occur.
        if (map.getLayer(layerId)) {
            map.on('click', layerId, handleClick);
            map.on('mouseenter', layerId, onMouseEnter);
            map.on('mouseleave', layerId, onMouseLeave);
            console.log('[MapContainer] Click listeners attached to tree layer.');
        }
    }

    return () => {
      if (map && map.getLayer(layerId)) { // Check layer existence before removing
        map.off('click', layerId, handleClick);
        map.off('mouseenter', layerId, onMouseEnter);
        map.off('mouseleave', layerId, onMouseLeave);
        console.log('[MapContainer] Click listeners removed from tree layer.');
      }
    };
  }, [onClick, treeData, treeVisibility]); // treeVisibility ensures listeners are re-evaluated if layer visibility changes them

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
