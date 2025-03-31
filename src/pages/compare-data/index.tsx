import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import CompareDatasets from './compare';
import { BarChartIcon } from '../../components/Icons';

/**
 * Compare Data main component with routing
 */
const CompareData: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CompareDataLanding />} />
      <Route path="/compare" element={<CompareDatasets />} />
    </Routes>
  );
};

/**
 * Compare Data landing page
 * Provides an introduction to the dataset comparison feature
 */
const CompareDataLanding: React.FC = () => {
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
        
        {/* Main content */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 2, 
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Dataset Comparison
              </Typography>
              <Typography paragraph>
                Our comparison tool allows you to analyze multiple climate datasets side by side, 
                identifying correlations, disparities, and patterns across different sources of climate data.
              </Typography>
              <Typography paragraph>
                You can compare temperature records, precipitation patterns, sea level measurements, 
                and other climate variables from different research institutions and time periods.
              </Typography>
              <Button 
                component={Link}
                to="/compare-data/compare"
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
              >
                Start Comparing Datasets
              </Button>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  height: '100%',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Key Features
                  </Typography>
                  <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                    <li>Side-by-side visual comparison</li>
                    <li>Statistical analysis of dataset differences</li>
                    <li>Time series alignment</li>
                    <li>Multiple visualization options</li>
                    <li>Export comparison results</li>
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Supported Dataset Types
                  </Typography>
                  <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                    <li>Temperature records</li>
                    <li>Precipitation data</li>
                    <li>Sea level measurements</li>
                    <li>Atmospheric composition</li>
                    <li>Climate model outputs</li>
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default CompareData;
