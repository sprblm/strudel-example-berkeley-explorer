import { Box, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { FilterContextProvider } from '../../components/FilterContext';
import { ControlsPanel } from './_components/ControlsPanel';
import { VisualizationView } from './_components/VisualizationView';
import { GlobeIcon } from '../../components/Icons';

/**
 * Main explore data page that allows users to visualize
 * and analyze climate data through interactive charts and maps.
 */
const ExploreData: React.FC = () => {
  const [activeChart, setActiveChart] = useState<'timeSeries' | 'map' | 'histogram' | 'distribution'>('timeSeries');
  const [showControls, setShowControls] = useState(true);

  const handleToggleControls = () => {
    setShowControls(!showControls);
  };

  return (
    <FilterContextProvider>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        bgcolor: '#fafafa' 
      }}>
        <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Page Header with Monitor-style formatting */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <GlobeIcon size={24} color="#3B82F6" />
            <Box>
              <Typography variant="h4" fontWeight={600} sx={{ mb: 0.5 }}>
                Explore Data
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Visualize and analyze climate data through interactive charts and maps.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex',
            flex: 1,
            gap: 3,
            height: 'calc(100% - 60px)'
          }}>
            {showControls && (
              <ControlsPanel 
                activeChart={activeChart}
                setActiveChart={setActiveChart}
              />
            )}
            
            <Box sx={{ flex: 1 }}>
              <Paper 
                elevation={0}
                sx={{ 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 2,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                <VisualizationView 
                  activeChart={activeChart} 
                  onToggleControls={handleToggleControls}
                  showControls={showControls}
                />
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </FilterContextProvider>
  );
};

export default ExploreData;
