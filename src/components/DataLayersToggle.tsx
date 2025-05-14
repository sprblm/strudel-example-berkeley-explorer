import React from 'react';
import { Box } from '@mui/material';

export type DataLayerType = 'tree' | 'air' | 'locations';

interface DataLayersToggleProps {
  visibleLayers: DataLayerType[];
  toggleLayer: (layer: DataLayerType) => void;
}

const DataLayersToggle: React.FC<DataLayersToggleProps> = ({ visibleLayers, toggleLayer }) => (
  <Box sx={{
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1000,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 3,
    p: 2,
    minWidth: 180
  }}>
    <div style={{ fontWeight: 500, fontSize: '0.98em', marginBottom: 8 }}>Data Layers</div>
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Box component="span">
        <button
          style={{
            background: visibleLayers.includes('tree') ? '#4caf50' : 'white',
            color: visibleLayers.includes('tree') ? 'white' : '#333',
            border: '1px solid #4caf50',
            borderRadius: 16,
            padding: '4px 12px',
            marginRight: 4,
            cursor: 'pointer',
            fontWeight: 500
          }}
          onClick={() => toggleLayer('tree')}
        >
          Trees
        </button>
      </Box>
      <Box component="span">
        <button
          style={{
            background: visibleLayers.includes('air') ? '#1976d2' : 'white',
            color: visibleLayers.includes('air') ? 'white' : '#333',
            border: '1px solid #1976d2',
            borderRadius: 16,
            padding: '4px 12px',
            marginRight: 4,
            cursor: 'pointer',
            fontWeight: 500
          }}
          onClick={() => toggleLayer('air')}
        >
          Sensors
        </button>
      </Box>
      <Box component="span">
        <button
          style={{
            background: visibleLayers.includes('locations') ? '#8e44ad' : 'white',
            color: visibleLayers.includes('locations') ? 'white' : '#333',
            border: '1px solid #8e44ad',
            borderRadius: 16,
            padding: '4px 12px',
            marginRight: 4,
            cursor: 'pointer',
            fontWeight: 500
          }}
          onClick={() => toggleLayer('locations')}
        >
          Locations
        </button>
      </Box>
    </Box>
  </Box>
);

export default DataLayersToggle;
