/**
 * ExclusiveDataMap component
 * 
 * A wrapper around BerkeleyDataMap that enforces exclusive layer selection behavior
 * for the search-repositories page, where only one data layer should be visible at a time.
 */
import React, { useState, useEffect } from 'react';
import BerkeleyDataMap from '../../../components/BerkeleyDataMap';
import type { TreeDataPoint } from '../../../types/map.types';

interface ExclusiveDataMapProps {
  height?: string | number;
  onPointClick?: (point: any) => void;
  activeLayers?: string[];
  selectedTree?: TreeDataPoint | null;
  onTreeClose?: () => void;
}

const ExclusiveDataMap: React.FC<ExclusiveDataMapProps> = ({
  height = '100%',
  onPointClick,
  activeLayers: propActiveLayers,
  selectedTree,
  onTreeClose,
}) => {
  // Ensure we always have exactly one layer or no layers
  const [activeLayers, setActiveLayers] = useState<string[]>(() => {
    if (!propActiveLayers || propActiveLayers.length === 0) return [];
    return [propActiveLayers[0]]; // Take only the first one for exclusive behavior
  });

  // Update layers when prop changes
  useEffect(() => {
    if (propActiveLayers && propActiveLayers.length > 0) {
      // Only use the first layer for exclusive behavior
      setActiveLayers([propActiveLayers[0]]);
    } else {
      setActiveLayers([]);
    }
  }, [propActiveLayers]);

  return (
    <BerkeleyDataMap
      height={height}
      onPointClick={onPointClick}
      activeLayers={activeLayers}
      selectedTree={selectedTree}
      onTreeClose={onTreeClose}
      showLayersToggle={false} // Hide the toggle UI since it's controlled by filters
    />
  );
};

export default ExclusiveDataMap;
