import React from 'react';
import styles from './DataLayersToggle.module.css';
import clsx from 'clsx';

export type DataLayerType = 'tree' | 'air' | 'locations';

interface DataLayersToggleProps {
  visibleLayers: DataLayerType[];
  toggleLayer: (layer: DataLayerType) => void;
}

const DataLayersToggle: React.FC<DataLayersToggleProps> = ({ visibleLayers, toggleLayer }) => (
  <div className={styles.toggleRoot}>
    <div className={styles.toggleTitle}>Data Layers</div>
    <div className={styles.toggleButtons}>
      <button
        className={clsx(styles.toggleBtn, {
          [styles.toggleBtnActiveTree]: visibleLayers.includes('tree'),
        })}
        onClick={() => toggleLayer('tree')}
      >
        Trees
      </button>
      <button
        className={clsx(styles.toggleBtn, {
          [styles.toggleBtnActiveAir]: visibleLayers.includes('air'),
        })}
        onClick={() => toggleLayer('air')}
      >
        Sensors
      </button>
      <button
        className={clsx(styles.toggleBtn, {
          [styles.toggleBtnActiveLocations]: visibleLayers.includes('locations'),
        })}
        onClick={() => toggleLayer('locations')}
      >
        Locations
      </button>
    </div>
  </div>
);

export default DataLayersToggle;
