/**
 * LocationsLayer Component
 * 
 * Renders geographic locations as interactive features on the map using Deck.GL's GeoJsonLayer.
 * Supports customizable styling, tooltips, and visibility toggling for location markers.
 * Used to display various point-of-interest data on the map.
 */

import { GeoJsonLayer } from '@deck.gl/layers';

interface LocationsLayerProps {
  data: GeoJSON.FeatureCollection;
  visible: boolean;
}

export const LocationsLayer = ({ data, visible }: LocationsLayerProps) => {
  if (!visible) return null;
  
  return new GeoJsonLayer({
    id: 'locations-geojson-layer',
    data,
    pickable: true,
    stroked: true,
    filled: true,
    getFillColor: [142, 68, 173, 40],
    getLineColor: [142, 68, 173, 200],
    getLineWidth: 2,
    getTooltip: ({ object }: { object?: { properties?: { name?: string } } }) =>
      object?.properties?.name ? { text: object.properties.name } : null,
  });
};
