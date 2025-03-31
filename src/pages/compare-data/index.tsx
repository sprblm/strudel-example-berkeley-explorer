import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import CompareDatasets from './compare';

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
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Compare Climate Datasets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Explore and compare different climate datasets to identify patterns and variations
          </Typography>
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The Compare Data feature allows you to:
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 3 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    View multiple climate datasets side by side
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    Compare temperature trends across different data sources
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    Synchronize timelines and axes for better comparison
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    Export comparison results for reporting
                  </Typography>
                </Box>
              </Box>
              
              <Link to="compare" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">
                  Start Comparing Datasets
                </Button>
              </Link>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/comparison-preview.png"
                alt="Dataset comparison preview"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default CompareData;
