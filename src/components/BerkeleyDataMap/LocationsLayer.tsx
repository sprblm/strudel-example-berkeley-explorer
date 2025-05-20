import React, { useEffect, useState } from 'react';
import L from 'leaflet';

interface LocationsLayerProps {
  map: L.Map;
  data: GeoJSON.FeatureCollection;
  visible: boolean;
}

const LocationsLayer: React.FC<LocationsLayerProps> = ({ map, data, visible }) => {
  const [visibleFeatures, setVisibleFeatures] = useState<GeoJSON.Feature[]>([]);
  // Helper to check if feature is within bounds
  const isFeatureInBounds = (feature: GeoJSON.Feature, bounds: L.LatLngBounds) => {
    if (!feature.geometry) return false;
    if (feature.geometry.type === 'Point') {
      // GeoJSON is [lng, lat], Leaflet expects [lat, lng]
      const [lng, lat] = feature.geometry.coordinates;
      return bounds.contains(L.latLng(lat, lng));
    }
    // For other geometry types (Polygon, LineString), you can extend this logic
    return false;
  };
  useEffect(() => {
    if (!map || !visible || !data) return;
    // Initial filter
    const updateVisibleFeatures = () => {
      const bounds = map.getBounds();
      // Debug: log bounds and a sample feature
      if (data.features.length > 0) {
        // Log the bounds corners
        // eslint-disable-next-line no-console
        console.log('Map bounds SW:', bounds.getSouthWest(), 'NE:', bounds.getNorthEast());
        // Log the first 5 features' geometry types and coordinates
        data.features.slice(0, 5).forEach((f, idx) => {
          if (f.geometry) {
            // eslint-disable-next-line no-console
            console.log(`Feature ${idx}: type`, f.geometry.type, 'coords', f.geometry.coordinates);
          } else {
            // eslint-disable-next-line no-console
            console.log(`Feature ${idx}: no geometry`);
          }
        });
      }
      let filtered = data.features.filter(f => isFeatureInBounds(f, bounds));
      // Debug fallback: if nothing is visible, show all features
      if (filtered.length === 0) {
        // eslint-disable-next-line no-console
        console.warn('No features found in bounds, rendering all for debug');
        filtered = data.features;
      }
      setVisibleFeatures(filtered);
    };
    updateVisibleFeatures();
    map.on('moveend zoomend', updateVisibleFeatures);
    return () => {
      map.off('moveend zoomend', updateVisibleFeatures);
    };
  }, [map, data, visible]);

  useEffect(() => {
    if (!map || !visible) return;
    // Remove previous layers
    let layer: L.GeoJSON<any> | null = null;
    if (visibleFeatures.length > 0) {
      layer = L.geoJSON({ ...data, features: visibleFeatures }, {
        style: {
          color: '#8e44ad',
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.1,
          fillColor: '#8e44ad',
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.name) {
            layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
          }
        },
      }).addTo(map);
    }
    return () => {
      if (layer) map.removeLayer(layer);
    };
  }, [map, data, visible, visibleFeatures]);

  return null;
};

export default LocationsLayer;
