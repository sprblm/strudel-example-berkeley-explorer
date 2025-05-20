import { GeoJsonLayer } from '@deck.gl/layers';

export const LocationsLayer = ({ data, visible }: { data: GeoJSON.FeatureCollection; visible: boolean }) => {
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
    getTooltip: ({ object }: any) =>
      object && object.properties && object.properties.name ? { text: object.properties.name } : null,
  });
}
