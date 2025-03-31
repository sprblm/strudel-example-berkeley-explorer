import { Box, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { FilterContextProvider } from '../../components/FilterContext';
import { PageHeader } from '../../components/PageHeader';
import { ControlsPanel } from './_components/ControlsPanel';
import { VisualizationView } from './_components/VisualizationView';

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
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <PageHeader 
              title="Explore Data"
              subtitle="Visualize and analyze climate data through interactive charts and maps."
              onToggleControls={handleToggleControls}
              showControls={showControls}
            />
          </Stack>

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
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 2
                }}
              >
                <VisualizationView 
                  activeChart={activeChart}
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
