import { Box, Typography } from '@mui/material';
import React from 'react';
import { BarChartIcon } from '../../components/Icons';
import CompareDatasets from './compare';

/**
 * Compare Data main component
 * Directly shows the comparison interface without a landing page
 */
const CompareData: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fafafa' }}>
      <Box sx={{ p: 3, flex: 1 }}>
        {/* Updated Header with Monitor-style formatting */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <BarChartIcon size={24} color="#3B82F6" />
          <Box>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 0.5 }}>
              Compare Climate Datasets
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Explore and compare different climate datasets to identify patterns and variations.
            </Typography>
          </Box>
        </Box>
        
        {/* Main content - directly show the comparison interface */}
        <CompareDatasets />
      </Box>
    </Box>
  );
};

export default CompareData;
