import { IconLayer } from '@deck.gl/layers';

interface TreeLayerProps {
  data: any[];
  visible: boolean;
}

export const TreeLayer = ({ data, visible }: TreeLayerProps) => {
  if (!visible) return null;
  return new IconLayer({
    id: "tree-icon-layer",
    data,
    pickable: true,
    iconAtlas: "/icons/tree.svg",
    iconMapping: { marker: { x: 0, y: 0, width: 22, height: 22, mask: false } },
    getIcon: () => "marker",
    sizeScale: 1,
    getPosition: (d: any) => [d.lng, d.lat],
    getSize: 22,
    getColor: [34, 139, 34],
    // Tooltips should be handled at the DeckGL level, not here
  });
};
