import React from 'react';

interface LayerControlsProps {
  visibleLayers: string[];
  toggleLayer: (layer: string) => void;
}

// This component will render UI controls for toggling layers.
const LayerControls: React.FC<LayerControlsProps> = ({ visibleLayers, toggleLayer }) => {
  // TODO: Move layer toggle UI here from BerkeleyDataMap.tsx
  return null;
};

export default LayerControls;
