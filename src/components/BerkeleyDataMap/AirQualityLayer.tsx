
import { IconLayer } from '@deck.gl/layers';

interface AirQualityLayerProps {
  data: any[];
  visible: boolean;
}

export const AirQualityLayer = ({ data, visible }: AirQualityLayerProps) => {
  if (!visible) return null;

  return new IconLayer({
    id: "airquality-icon-layer",
    data,
    pickable: true,
    iconAtlas: "/icons/air.svg",
    iconMapping: { marker: { x: 0, y: 0, width: 16, height: 16, mask: false } },
    getIcon: () => "marker",
    sizeScale: 1,
    getPosition: (d: any) => [d.lng, d.lat],
    getSize: 16,
    getColor: [0, 123, 255],
    // Tooltips should be handled at the DeckGL level, not here
  });
};
