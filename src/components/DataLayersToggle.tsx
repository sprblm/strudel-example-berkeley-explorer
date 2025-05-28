// Import necessary modules from React and local CSS styles.
import React from 'react';
import styles from './DataLayersToggle.module.css';
// clsx is a utility for conditionally joining classNames together.
import clsx from 'clsx';

// Define a union type for the different data layers that can be toggled.
export type DataLayerType = 'tree' | 'air' | 'locations';

// Define the props interface for the DataLayersToggle component.
interface DataLayersToggleProps {
  // `visibleLayers` is an array of `DataLayerType` indicating which layers are currently visible.
  visibleLayers: DataLayerType[];
  // `onToggle` is a callback function that is called when a layer button is clicked,
  // passing the `DataLayerType` of the toggled layer.
  onToggle: (layer: DataLayerType) => void;
}

// DataLayersToggle is a functional React component that displays buttons to toggle data layers.
const DataLayersToggle: React.FC<DataLayersToggleProps> = ({ visibleLayers, onToggle }) => (
  // The root container for the toggle component.
  <div className={styles.toggleRoot}>
    {/* Title for the data layers section. */}
    <div className={styles.toggleTitle}>Data Layers</div>
    {/* Container for the toggle buttons. */}
    <div className={styles.toggleButtons}>
      {/* Button for the 'Trees' data layer. */}
      <button
        // Apply base and conditional styles based on whether the 'tree' layer is visible.
        className={clsx(
          styles.toggleBtn,
          {
            [styles.toggleBtnActiveTree]: visibleLayers.includes('tree'),
          },
        )}
        // Call `onToggle` with 'tree' when the button is clicked.
        onClick={() => onToggle('tree')}
      >
        Trees
      </button>
      {/* Button for the 'Sensors' (air quality) data layer. */}
      <button
        // Apply base and conditional styles based on whether the 'air' layer is visible.
        className={clsx(
          styles.toggleBtn,
          {
            [styles.toggleBtnActiveAir]: visibleLayers.includes('air'),
          },
        )}
        // Call `onToggle` with 'air' when the button is clicked.
        onClick={() => onToggle('air')}
      >
        Sensors
      </button>
      {/* Button for the 'Locations' data layer. */}
      <button
        // Apply base and conditional styles based on whether the 'locations' layer is visible.
        className={clsx(
          styles.toggleBtn,
          {
            [styles.toggleBtnActiveLocations]: visibleLayers.includes('locations'),
          },
        )}
        // Call `onToggle` with 'locations' when the button is clicked.
        onClick={() => onToggle('locations')}
      >
        Locations
      </button>
    </div>
  </div>
);

// Export the component as the default export.
export default DataLayersToggle;
