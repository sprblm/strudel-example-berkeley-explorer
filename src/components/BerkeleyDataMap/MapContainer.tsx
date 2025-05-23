import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@mui/material';
import { mapContainerSx } from './BerkeleyDataMap.styles';
import { mapContainerStyle, mapElementStyle } from './MapContainer.styles';

// Use a public Mapbox token for demos and development
// In Vite, we should use import.meta.env instead of process.env for client-side code
// For simplicity, we'll use the token directly here
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

// Set the token for mapbox-gl
mapboxgl.accessToken = MAPBOX_TOKEN;

/**
 * Simple props interface for the MapContainer
 */
interface MapContainerProps {
  height?: number | string;
  width?: number | string;
  layers?: any[];
  onClick?: (info: any) => void;
}

/**
 * A MapContainer component using pure Mapbox GL JS for rendering
 * This approach gives maximum control over vector tile rendering
 */
const MapContainer: React.FC<MapContainerProps> = ({
  height = 600,
  width = '100%',
  layers = [],
  onClick
}) => {
  // Convert height/width to CSS string values
  const heightStr = typeof height === 'number' ? `${height}px` : height;
  const widthStr = typeof width === 'number' ? `${width}px` : width;
  
  // Create refs for the map container and map instance
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize the map
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11', // Use a light style for better visibility
        center: [-122.25948, 37.872], // Berkeley
        zoom: 14,
        attributionControl: true,
        maxZoom: 18,
        minZoom: 10
      });
      
      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add debug info to help troubleshoot
      console.log('Mapbox initialized successfully');
      
      // Add vector tile source and layer when map loads
      map.current.on('load', () => {
        if (!map.current) return;
        
        console.log('Map loaded, adding vector tile source');
        
        try {
          // Add a GeoJSON source with sample tree data instead of vector tiles
          map.current.addSource('trees', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                // Sample tree data points in Berkeley
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-122.259, 37.872]
                  },
                  properties: {
                    id: 'tree-1',
                    species: 'Oak',
                    health: 'Good',
                    height: 45,
                    dbh: 24
                  }
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-122.262, 37.875]
                  },
                  properties: {
                    id: 'tree-2',
                    species: 'Redwood',
                    health: 'Excellent',
                    height: 80,
                    dbh: 36
                  }
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-122.255, 37.868]
                  },
                  properties: {
                    id: 'tree-3',
                    species: 'Maple',
                    health: 'Fair',
                    height: 30,
                    dbh: 18
                  }
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [-122.258, 37.869]
                  },
                  properties: {
                    id: 'tree-4',
                    species: 'Pine',
                    health: 'Poor',
                    height: 25,
                    dbh: 12
                  }
                }
              ]
            }
          });
          
          console.log('GeoJSON source added successfully');
        } catch (error) {
          console.error('Error adding GeoJSON source:', error);
        }
      
        try {
          // Add a layer for tree data using the GeoJSON source
          map.current.addLayer({
            id: 'trees-layer',
            type: 'circle',
            source: 'trees',
            paint: {
              'circle-radius': 8,
              'circle-color': [
                'match',
                ['get', 'health'],
                'Good', '#228B22',
                'Fair', '#FFD700',
                'Poor', '#FF4500',
                'Excellent', '#006400',
                '#A9A9A9' // default
              ],
              'circle-opacity': 0.8,
              'circle-stroke-width': 1.5,
              'circle-stroke-color': '#FFFFFF'
            }
          });
          
          // Add labels for the trees
          map.current.addLayer({
            id: 'tree-labels',
            type: 'symbol',
            source: 'trees',
            layout: {
              'text-field': ['get', 'species'],
              'text-font': ['Open Sans Regular'],
              'text-offset': [0, 1.5],
              'text-size': 12
            },
            paint: {
              'text-color': '#333',
              'text-halo-color': '#fff',
              'text-halo-width': 1
            }
          });
          
          console.log('Tree layers added successfully');
        } catch (error) {
          console.error('Error adding tree layers:', error);
        }
      
      // Add click event handler
      if (onClick) {
        map.current.on('click', 'trees-layer', (e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const props = feature.properties || {};
            
            onClick({
              object: {
                properties: props,
                coordinates: e.lngLat
              }
            });
          }
        });
        
        // Change cursor on hover
        map.current.on('mouseenter', 'trees-layer', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        
        map.current.on('mouseleave', 'trees-layer', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
      }
    });
    
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
    }
    
    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [onClick]);
  
  return (
    <Box sx={{
      ...mapContainerSx,
      ...mapContainerStyle,
      height: heightStr,
      width: widthStr
    }}>
      <Box ref={mapContainer} component="div" sx={mapElementStyle} />
    </Box>
  );
};

export default MapContainer;
