import { useEffect, useRef } from 'react';
import { useMap } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';

interface VectorTileLayerProps {
  id: string;
  source: string;
  sourceUrl: string;
  sourceLayer: string;
  visible: boolean;
  minZoom?: number;
  maxZoom?: number;
  paint?: any;
  layout?: any;
}

export const VectorTileLayer: React.FC<VectorTileLayerProps> = ({
  id,
  source,
  sourceUrl,
  sourceLayer,
  visible = true,
  minZoom = 0,
  maxZoom = 24,
  paint = {},
  layout = {},
}) => {
  const { current: map } = useMap();
  const layerId = useRef<string>();
  const sourceId = useRef<string>();

  useEffect(() => {
    if (!map) return;

    const mapInstance = map.getMap();
    
    // Add source if it doesn't exist
    if (!mapInstance.getSource(source)) {
      mapInstance.addSource(source, {
        type: 'vector',
        tiles: [sourceUrl],
        minzoom: minZoom,
        maxzoom: maxZoom,
      });
      sourceId.current = source;
    }

    // Add layer if it doesn't exist
    if (!mapInstance.getLayer(id)) {
      mapInstance.addLayer(
        {
          id,
          type: 'circle',
          source,
          'source-layer': sourceLayer,
          minzoom: minZoom,
          maxzoom: maxZoom,
          paint: {
            'circle-radius': 4,
            'circle-color': '#4CAF50',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
            'circle-opacity': 0.8,
            ...paint,
          },
          layout: {
            visibility: visible ? 'visible' : 'none',
            ...layout,
          },
        },
        // Insert before first symbol layer if it exists
        mapInstance.getStyle().layers?.find((l) => l.type === 'symbol')?.id
      );
      layerId.current = id;
    }

    // Cleanup
    return () => {
      if (mapInstance && layerId.current) {
        if (mapInstance.getLayer(layerId.current)) {
          mapInstance.removeLayer(layerId.current);
        }
      }
      if (mapInstance && sourceId.current && !mapInstance.getStyle().sources[sourceId.current]) {
        mapInstance.removeSource(sourceId.current);
      }
    };
  }, [map, id, source, sourceUrl, sourceLayer, visible, minZoom, maxZoom, paint, layout]);

  // Update visibility when it changes
  useEffect(() => {
    if (!map || !layerId.current) return;
    
    const mapInstance = map.getMap();
    if (mapInstance.getLayer(layerId.current)) {
      mapInstance.setLayoutProperty(
        layerId.current,
        'visibility',
        visible ? 'visible' : 'none'
      );
    }
  }, [map, visible]);

  return null;
};

export default VectorTileLayer;
