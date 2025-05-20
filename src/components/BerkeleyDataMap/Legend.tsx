import React from 'react';

interface LegendProps {
  visibleLayers: string[];
}

// This component will render map legends for visible layers.
const Legend: React.FC<LegendProps> = ({ visibleLayers: _visibleLayers }) => {
  // TODO: Move legend rendering logic here from BerkeleyDataMap.tsx
  return null;
};

export default Legend;
